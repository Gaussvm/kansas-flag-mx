"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Reusable security verification for Server Actions
 */
async function getUserProfile(supabase: any) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autorizado");
  const { data: profile } = await supabase.from('profiles').select('id, role').eq('id', user.id).single();
  if (!profile) throw new Error("Perfil no encontrado");
  return { user, profile };
}

export async function verifyMasterOrAdmin() {
  const supabase = await createClient();
  const { profile } = await getUserProfile(supabase);
  if (!['master', 'admin'].includes(profile.role)) {
    throw new Error("Acceso denegado: Se requiere rol Master/Admin.");
  }
  return supabase;
}

export async function verifyOperationalAdmin() {
  const supabase = await createClient();
  const { profile } = await getUserProfile(supabase);
  if (!['master', 'admin', 'director', 'staff_admin'].includes(profile.role)) {
    throw new Error("Acceso denegado: Se requiere rol operativo.");
  }
  return supabase;
}

export async function verifyCanManageLocation(locationId: string) {
  const supabase = await createClient();
  const { profile } = await getUserProfile(supabase);
  if (!['master', 'admin', 'director', 'staff_admin'].includes(profile.role)) {
    throw new Error("Acceso denegado: Se requiere rol operativo.");
  }
  
  if (['master', 'admin', 'director'].includes(profile.role)) {
    return supabase;
  }
  
  if (profile.role === 'staff_admin') {
    if (!locationId) throw new Error("Sede no especificada");
    const { data: loc } = await supabase.from('profile_locations')
      .select('location_id')
      .eq('profile_id', profile.id)
      .eq('location_id', locationId)
      .single();
    if (!loc) throw new Error("Acceso denegado: No tienes permiso para gestionar esta sede.");
  }
  
  return supabase;
}

export async function createProgramAction(data: { name: string; type: string; start_date: string; end_date: string; location_id: string }) {
  const supabase = await verifyCanManageLocation(data.location_id);
  
  if (data.start_date > data.end_date) {
    throw new Error("La fecha de inicio no puede ser posterior a la fecha de fin.");
  }

  const { data: existing } = await supabase.from('programs')
    .select('id')
    .eq('name', data.name)
    .eq('start_date', data.start_date)
    .single();
    
  if (existing) {
    throw new Error("El programa ya existe para esa fecha de inicio.");
  }

  const { error } = await supabase.from('programs').insert(data);
  if (error) throw new Error("Error al crear programa: " + error.message);

  revalidatePath('/dashboard/admin/programas');
  return { success: true };
}

export async function registerAthleteAndEnrollAction(data: {
  first_name: string;
  last_name: string;
  birth_date: string;
  parent_id: string;
  program_id: string;
  payment_status: string;
  medical_info?: string;
  category_id?: string;
  primary_location_id: string;
}) {
  const supabase = await verifyCanManageLocation(data.primary_location_id);

  const { data: existingAthlete } = await supabase.from('athletes')
    .select('id')
    .eq('first_name', data.first_name)
    .eq('last_name', data.last_name)
    .eq('birth_date', data.birth_date)
    .single();
    
  if (existingAthlete) {
    throw new Error("El atleta ya existe en la base de datos.");
  }

  // 1. Create Athlete
  const { data: newAthlete, error: athleteError } = await supabase.from('athletes')
    .insert({
      first_name: data.first_name,
      last_name: data.last_name,
      birth_date: data.birth_date,
      medical_info: data.medical_info || null,
      category_id: data.category_id || null,
      primary_location_id: data.primary_location_id
    })
    .select('id').single();

  if (athleteError || !newAthlete) {
    throw new Error("Fallo al crear el atleta: " + athleteError?.message);
  }

  const athleteId = newAthlete.id;

  // Manual Rollback Block
  try {
    // 2. Link Parent
    if (data.parent_id) {
      const { error: guardianError } = await supabase.from('guardian_athletes')
        .insert({ guardian_id: data.parent_id, athlete_id: athleteId });
      
      if (guardianError) throw new Error("Fallo al vincular tutor: " + guardianError.message);
    }

    // 3. Enroll in Program
    if (data.program_id) {
      const { error: enrollError } = await supabase.from('enrollments')
        .insert({
          athlete_id: athleteId,
          program_id: data.program_id,
          payment_status: data.payment_status,
          status: 'enrolled'
        });
        
      if (enrollError) {
        if (enrollError.code === '23505') {
          throw new Error("El atleta ya está inscrito en este programa.");
        }
        throw new Error("Fallo al inscribir: " + enrollError.message);
      }
    }
  } catch (err: any) {
    // MANUAL ROLLBACK: Delete the athlete if the linkage/enrollment failed
    await supabase.from('athletes').delete().eq('id', athleteId);
    throw new Error("Transacción fallida. Se ha revertido la creación del atleta: " + err.message);
  }

  revalidatePath('/dashboard/admin/crm');
  return { success: true };
}

export async function upsertScoutingResultsAction(programId: string, results: any[]) {
  const supabase = await verifyOperationalAdmin();
  if (results.length === 0) return { success: true };

  // Find or Create an Assessment for this program
  let { data: assessment } = await supabase.from('assessments')
    .select('id')
    .eq('program_id', programId)
    .limit(1)
    .single();

  let assessmentId;
  if (!assessment) {
    const { data: newAssessment, error: aError } = await supabase.from('assessments')
      .insert({
        program_id: programId,
        name: `Evaluación General`,
        date: new Date().toISOString().split('T')[0]
      })
      .select('id').single();
      
    if (aError) throw new Error("Error creando assessment: " + aError.message);
    assessmentId = newAssessment.id;
  } else {
    assessmentId = assessment.id;
  }

  // Format and Upsert
  const formattedResults = results.map(r => ({
    assessment_id: assessmentId,
    athlete_id: r.athlete_id,
    metric_key: r.metric_key,
    phase: r.phase,
    metric_label: r.metric_label,
    value_numeric: r.value_numeric,
    unit: r.unit,
    lower_is_better: r.lower_is_better
  }));

  const { error } = await supabase.from('assessment_results').upsert(formattedResults, {
    onConflict: 'assessment_id, athlete_id, metric_key, phase'
  });

  if (error) throw new Error("Error guardando resultados de scouting: " + error.message);

  revalidatePath('/dashboard/admin/scouting');
  return { success: true };
}

export async function updateProgramAction(id: string, data: { name: string; type: string; start_date: string; end_date: string; status: string; location_id: string }) {
  const supabase = await verifyCanManageLocation(data.location_id);
  
  if (data.start_date > data.end_date) {
    throw new Error("La fecha de inicio no puede ser posterior a la fecha de fin.");
  }

  // Prevent duplicate if they changed name/start_date to match another existing one
  const { data: existing } = await supabase.from('programs')
    .select('id')
    .eq('name', data.name)
    .eq('start_date', data.start_date)
    .neq('id', id)
    .single();
    
  if (existing) {
    throw new Error("Ya existe otro programa con ese nombre en esa fecha de inicio.");
  }

  const { error } = await supabase.from('programs').update(data).eq('id', id);
  if (error) throw new Error("Error al actualizar programa: " + error.message);

  revalidatePath('/dashboard/admin/programas');
  return { success: true };
}

export async function updateProgramStatusAction(id: string, status: string) {
  const supabase = await verifyOperationalAdmin();
  
  const { error } = await supabase.from('programs').update({ status }).eq('id', id);
  if (error) throw new Error("Error al cambiar estado: " + error.message);

  revalidatePath('/dashboard/admin/programas');
  return { success: true };
}

// ============================================================================
// PHASE 5: CRM MANAGEMENT ACTIONS
// ============================================================================

export async function updateAthleteAction(id: string, data: { first_name: string; last_name: string; birth_date: string; medical_info: string; category_id: string | null; primary_location_id: string }) {
  const supabase = await verifyCanManageLocation(data.primary_location_id);
  
  const { error } = await supabase.from('athletes').update({
    first_name: data.first_name,
    last_name: data.last_name,
    birth_date: data.birth_date,
    medical_info: data.medical_info,
    category_id: data.category_id || null,
    primary_location_id: data.primary_location_id
  }).eq('id', id);
  
  if (error) throw new Error("Error al actualizar atleta: " + error.message);

  revalidatePath('/dashboard/admin/crm');
  return { success: true };
}

export async function addGuardianAction(athleteId: string, parentId: string, relationship: string) {
  const supabase = await verifyOperationalAdmin();
  
  const { data: existing } = await supabase.from('guardian_athletes')
    .select('*')
    .eq('athlete_id', athleteId)
    .eq('guardian_id', parentId)
    .single();

  if (existing) {
    throw new Error("Este tutor ya está vinculado al atleta.");
  }

  const { error } = await supabase.from('guardian_athletes').insert({
    athlete_id: athleteId,
    guardian_id: parentId,
    relationship: relationship || 'Tutor Legal'
  });
  
  if (error) throw new Error("Error al vincular tutor: " + error.message);

  revalidatePath('/dashboard/admin/crm');
  return { success: true };
}

export async function removeGuardianAction(athleteId: string, parentId: string) {
  const supabase = await verifyOperationalAdmin();
  
  const { error } = await supabase.from('guardian_athletes')
    .delete()
    .match({ athlete_id: athleteId, guardian_id: parentId });
    
  if (error) throw new Error("Error al remover tutor: " + error.message);

  revalidatePath('/dashboard/admin/crm');
  return { success: true };
}

export async function updateGuardianRelationshipAction(athleteId: string, parentId: string, relationship: string) {
  const supabase = await verifyOperationalAdmin();
  
  const { error } = await supabase.from('guardian_athletes')
    .update({ relationship })
    .match({ athlete_id: athleteId, guardian_id: parentId });
    
  if (error) throw new Error("Error al actualizar parentesco: " + error.message);

  revalidatePath('/dashboard/admin/crm');
  return { success: true };
}

export async function manageEnrollmentAction(enrollmentId: string, status: string, paymentStatus: string, notes: string | null) {
  const supabase = await verifyOperationalAdmin();
  
  const { error } = await supabase.from('enrollments')
    .update({ 
      status, 
      payment_status: paymentStatus,
      // If there are notes, we'd update them if the column exists. Skipping notes for now to prevent schema issues.
    })
    .eq('id', enrollmentId);
    
  if (error) throw new Error("Error al actualizar inscripción: " + error.message);

  revalidatePath('/dashboard/admin/crm');
  return { success: true };
}

export async function addEnrollmentAction(athleteId: string, programId: string, paymentStatus: string) {
  const supabase = await verifyOperationalAdmin();
  
  const { error } = await supabase.from('enrollments').insert({
    athlete_id: athleteId,
    program_id: programId,
    payment_status: paymentStatus,
    status: 'enrolled'
  });
  
  if (error) {
    if (error.code === '23505') throw new Error("El atleta ya está inscrito en este programa.");
    throw new Error("Error al inscribir: " + error.message);
  }

  revalidatePath('/dashboard/admin/crm');
  return { success: true };
}

// ============================================================================
// PHASE 6: ROLE & LOCATION MANAGEMENT ACTIONS
// ============================================================================

export async function updateUserRoleAction(userId: string, newRole: string) {
  const supabase = await verifyMasterOrAdmin();
  
  // Prevent removing last master/admin
  if (newRole !== 'master' && newRole !== 'admin') {
    const { data: masters } = await supabase.from('profiles').select('id').in('role', ['master', 'admin']);
    if (masters && masters.length <= 1 && masters[0].id === userId) {
      throw new Error("No puedes quitarte el rol de Master/Admin porque eres el último superusuario del sistema.");
    }
  }

  const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', userId);
  if (error) throw new Error("Error actualizando rol: " + error.message);

  revalidatePath('/dashboard/admin/directorio');
  return { success: true };
}

export async function assignLocationAction(userId: string, locationId: string, isPrimary: boolean = false) {
  const supabase = await verifyMasterOrAdmin();
  
  if (isPrimary) {
    // Unset current primary
    await supabase.from('profile_locations').update({ is_primary: false }).eq('profile_id', userId);
  }

  const { error } = await supabase.from('profile_locations').upsert({
    profile_id: userId,
    location_id: locationId,
    is_primary: isPrimary
  }, { onConflict: 'profile_id, location_id' });

  if (error) throw new Error("Error asignando sede: " + error.message);

  revalidatePath('/dashboard/admin/directorio');
  return { success: true };
}

export async function removeLocationAction(userId: string, locationId: string) {
  const supabase = await verifyMasterOrAdmin();
  
  const { error } = await supabase.from('profile_locations')
    .delete()
    .match({ profile_id: userId, location_id: locationId });
    
  if (error) throw new Error("Error removiendo sede: " + error.message);

  revalidatePath('/dashboard/admin/directorio');
  return { success: true };
}

export async function setPrimaryLocationAction(userId: string, locationId: string) {
  const supabase = await verifyMasterOrAdmin();
  
  await supabase.from('profile_locations').update({ is_primary: false }).eq('profile_id', userId);
  const { error } = await supabase.from('profile_locations').update({ is_primary: true })
    .match({ profile_id: userId, location_id: locationId });
    
  if (error) throw new Error("Error estableciendo sede primaria: " + error.message);

  revalidatePath('/dashboard/admin/directorio');
  return { success: true };
}
