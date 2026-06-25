import { createClient } from "@/lib/supabase/server";
import ProgramForm from "@/components/admin/ProgramForm";
import ProgramList from "@/components/admin/ProgramList";

export default async function ProgramasPage() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user?.id).single();
  const { data: profileLocations } = await supabase.from('profile_locations').select('location_id').eq('profile_id', user?.id);

  const { data: allLocations } = await supabase.from('locations').select('*').eq('is_active', true).order('name');
  
  let allowedLocations = allLocations || [];
  if (profile?.role === 'staff_admin') {
    const assignedIds = profileLocations?.map(pl => pl.location_id) || [];
    allowedLocations = allowedLocations.filter(loc => assignedIds.includes(loc.id));
  }

  const { data: programs } = await supabase
    .from("programs")
    .select(`*, locations:location_id (name)`)
    .order("start_date", { ascending: false });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-headline font-black text-white uppercase tracking-tight">Gestión de Programas</h2>
        <p className="text-zinc-400 font-body text-sm mt-1">Crea campamentos, clínicas y torneos activos.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <ProgramForm locations={allowedLocations} />
        </div>

        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-headline font-bold text-white uppercase tracking-wide">Programas Existentes</h3>
          {(!programs || programs.length === 0) ? (
            <p className="text-zinc-500 font-body text-sm">No hay programas creados.</p>
          ) : (
            <ProgramList programs={programs} locations={allowedLocations} currentUserRole={profile?.role || 'staff'} />
          )}
        </div>
      </div>
    </div>
  );
}
