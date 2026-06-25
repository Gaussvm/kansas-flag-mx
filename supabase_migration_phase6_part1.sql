-- ==============================================================================
-- PHASE 6 - MULTI-LOCATION & ADVANCED ROLES MIGRATION (PART 1)
-- ==============================================================================
-- Etapa 6.1: Base segura (Tablas, Columnas, Datos) y
-- Etapa 6.2: Helpers Nuevos
-- Incluye RLS para nuevas tablas.
-- ==============================================================================

-- Habilitamos la extensión necesaria si no existe
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Crear tabla de sedes (locations)
CREATE TABLE IF NOT EXISTS public.locations (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    name text NOT NULL,
    slug text UNIQUE NOT NULL,
    address text,
    city text,
    state text,
    google_maps_url text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Crear tabla de asociación de perfiles a sedes
CREATE TABLE IF NOT EXISTS public.profile_locations (
    profile_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    location_id uuid REFERENCES public.locations(id) ON DELETE CASCADE NOT NULL,
    role_scope text,
    is_primary boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    PRIMARY KEY (profile_id, location_id)
);

-- 3. Agregar llaves foráneas a athletes y programs
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='athletes' AND column_name='primary_location_id') THEN
        ALTER TABLE public.athletes ADD COLUMN primary_location_id uuid REFERENCES public.locations(id) ON DELETE SET NULL;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='programs' AND column_name='location_id') THEN
        ALTER TABLE public.programs ADD COLUMN location_id uuid REFERENCES public.locations(id) ON DELETE SET NULL;
    END IF;
END $$;

-- 4. Actualización del Constraint de Roles en Profiles (Permitiendo viejos y nuevos)
DO $$
DECLARE
    const_name text;
BEGIN
    SELECT conname INTO const_name 
    FROM pg_constraint
    WHERE conrelid = 'public.profiles'::regclass AND contype = 'c' AND pg_get_constraintdef(oid) LIKE '%role%';
    
    IF const_name IS NOT NULL THEN
        EXECUTE 'ALTER TABLE public.profiles DROP CONSTRAINT ' || const_name;
    END IF;
END $$;

-- Mantenemos 'admin' como rol legacy temporalmente
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check 
  CHECK (role IN ('master', 'director', 'staff_admin', 'staff', 'coach', 'player', 'parent', 'admin'));

-- 5. Crear Sede Principal "Kansas Flag Principal" y Asignar Registros Huérfanos
DO $$
DECLARE
    main_loc_id uuid;
BEGIN
    -- Intentar obtener la sede si ya existe
    SELECT id INTO main_loc_id FROM public.locations WHERE slug = 'kansas-flag-principal' LIMIT 1;
    
    -- Si no existe, crearla
    IF main_loc_id IS NULL THEN
        INSERT INTO public.locations (name, slug) 
        VALUES ('Kansas Flag Principal', 'kansas-flag-principal') 
        RETURNING id INTO main_loc_id;
    END IF;

    -- Asignar sede a atletas existentes que no tengan sede
    UPDATE public.athletes SET primary_location_id = main_loc_id WHERE primary_location_id IS NULL;
    
    -- Asignar sede a programas existentes que no tengan sede
    UPDATE public.programs SET location_id = main_loc_id WHERE location_id IS NULL;

    -- Ligar TODOS los usuarios staff/admin actuales a la sede principal (si no están ligados)
    INSERT INTO public.profile_locations (profile_id, location_id, is_primary)
    SELECT id, main_loc_id, true
    FROM public.profiles 
    WHERE role IN ('admin', 'master', 'director', 'staff_admin', 'staff', 'coach')
    ON CONFLICT (profile_id, location_id) DO NOTHING;
END $$;

-- ¡Nota! NO hacemos UPDATE public.profiles SET role = 'master' WHERE role = 'admin' todavía.


-- ==============================================================================
-- ETAPA 6.2: CREACIÓN DE HELPERS (Con search_path seguro)
-- ==============================================================================

-- A. Helpers Clásicos (Alias temporales para no romper políticas viejas de RLS)
CREATE OR REPLACE FUNCTION public.is_admin() RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('master', 'admin')
  );
$$ LANGUAGE sql SECURITY DEFINER SET search_path = public, pg_temp;

CREATE OR REPLACE FUNCTION public.is_staff() RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() AND role IN ('master', 'director', 'staff_admin', 'staff', 'admin')
  );
$$ LANGUAGE sql SECURITY DEFINER SET search_path = public, pg_temp;

-- Conservamos is_guardian_of y is_assigned_coach (manteniendo validación por programa Y categoría)
CREATE OR REPLACE FUNCTION public.is_guardian_of(target_athlete_id uuid) RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.guardian_athletes
    WHERE guardian_id = auth.uid() AND athlete_id = target_athlete_id
  );
$$ LANGUAGE sql SECURITY DEFINER SET search_path = public, pg_temp;

CREATE OR REPLACE FUNCTION public.is_assigned_coach(target_athlete_id uuid) RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.coach_assignments ca
    WHERE ca.coach_id = auth.uid() AND (
      (ca.program_id IS NOT NULL AND EXISTS (
         SELECT 1 FROM public.enrollments e WHERE e.program_id = ca.program_id AND e.athlete_id = target_athlete_id
      ))
      OR
      (ca.category_id IS NOT NULL AND EXISTS (
         SELECT 1 FROM public.athletes a WHERE a.category_id = ca.category_id AND a.id = target_athlete_id
      ))
    )
  );
$$ LANGUAGE sql SECURITY DEFINER SET search_path = public, pg_temp;


-- B. Helpers Nuevos (Arquitectura Fase 6)
CREATE OR REPLACE FUNCTION public.get_my_role() RETURNS text AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER SET search_path = public, pg_temp;

-- Temporales: tratamos 'admin' como 'master' para no romper
CREATE OR REPLACE FUNCTION public.is_master() RETURNS boolean AS $$
  SELECT public.get_my_role() IN ('master', 'admin');
$$ LANGUAGE sql SECURITY DEFINER SET search_path = public, pg_temp;

CREATE OR REPLACE FUNCTION public.is_director_or_above() RETURNS boolean AS $$
  SELECT public.get_my_role() IN ('master', 'admin', 'director');
$$ LANGUAGE sql SECURITY DEFINER SET search_path = public, pg_temp;

CREATE OR REPLACE FUNCTION public.can_manage_roles() RETURNS boolean AS $$
  SELECT public.is_master();
$$ LANGUAGE sql SECURITY DEFINER SET search_path = public, pg_temp;

CREATE OR REPLACE FUNCTION public.user_has_location(target_location_id uuid) RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profile_locations 
    WHERE profile_id = auth.uid() AND location_id = target_location_id
  );
$$ LANGUAGE sql SECURITY DEFINER SET search_path = public, pg_temp;

CREATE OR REPLACE FUNCTION public.can_view_location(target_location_id uuid) RETURNS boolean AS $$
BEGIN
  IF public.is_director_or_above() THEN RETURN true; END IF;
  RETURN public.user_has_location(target_location_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

CREATE OR REPLACE FUNCTION public.can_manage_location(target_location_id uuid) RETURNS boolean AS $$
DECLARE 
  v_role text;
BEGIN
  v_role := public.get_my_role();
  IF v_role IN ('master', 'admin', 'director') THEN RETURN true; END IF;
  IF v_role = 'staff_admin' THEN 
    RETURN public.user_has_location(target_location_id);
  END IF;
  RETURN false;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public, pg_temp;

-- ==============================================================================
-- RLS PARA NUEVAS TABLAS
-- ==============================================================================

-- Activar RLS
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profile_locations ENABLE ROW LEVEL SECURITY;

-- Limpiar políticas existentes si las hubiera (idempotencia)
DROP POLICY IF EXISTS "Admins and Directors see all locations" ON public.locations;
DROP POLICY IF EXISTS "Staff see assigned locations" ON public.locations;
DROP POLICY IF EXISTS "Public users see active locations" ON public.locations;
DROP POLICY IF EXISTS "Only master and admin can manage locations" ON public.locations;

DROP POLICY IF EXISTS "Master and admin manage profile_locations" ON public.profile_locations;
DROP POLICY IF EXISTS "Director can view all profile_locations" ON public.profile_locations;
DROP POLICY IF EXISTS "Staff can view their own profile_locations" ON public.profile_locations;


-- Políticas para locations
CREATE POLICY "Admins and Directors see all locations" ON public.locations
  FOR SELECT USING (public.is_director_or_above());

CREATE POLICY "Staff see assigned locations" ON public.locations
  FOR SELECT USING (
    public.get_my_role() IN ('staff_admin', 'staff', 'coach') 
    AND public.user_has_location(id)
  );

CREATE POLICY "Public users see active locations" ON public.locations
  FOR SELECT USING (
    public.get_my_role() IN ('parent', 'player') AND is_active = true
  );

CREATE POLICY "Only master and admin can manage locations" ON public.locations
  FOR ALL USING (public.is_master());

-- Políticas para profile_locations
CREATE POLICY "Master and admin manage profile_locations" ON public.profile_locations
  FOR ALL USING (public.is_master());

CREATE POLICY "Director can view all profile_locations" ON public.profile_locations
  FOR SELECT USING (public.is_director_or_above());

CREATE POLICY "Staff can view their own profile_locations" ON public.profile_locations
  FOR SELECT USING (
    profile_id = auth.uid() AND 
    public.get_my_role() IN ('staff_admin', 'staff', 'coach')
  );
