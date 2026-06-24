import { createClient } from "@/lib/supabase/server";
import AthleteCard from "@/components/parent/AthleteCard";

export default async function ParentDashboardPage() {
  const supabase = await createClient();

  // The RLS policy "Padres ven sus atletas" ensures this only returns
  // the athletes linked to the logged-in user in guardian_athletes.
  const { data: athletes, error } = await supabase
    .from("athletes")
    .select(`
      id, 
      first_name, 
      last_name, 
      birth_date,
      enrollments (
        id, 
        status, 
        payment_status,
          id, 
          name, 
          type, 
          start_date, 
          end_date 
        ),
        payment_receipts (
          id,
          file_path,
          file_name,
          status,
          created_at
        )
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching athletes:", error);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-headline font-black text-white uppercase tracking-tight">Mis Atletas</h1>
        <p className="text-zinc-400 font-body text-sm mt-1">
          Gestiona y revisa el progreso de tus hijos en los programas de Kansas Flag.
        </p>
      </div>

      {!athletes || athletes.length === 0 ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-12 text-center flex flex-col items-center">
          <span className="material-symbols-outlined text-6xl text-zinc-700 mb-4">group_off</span>
          <h2 className="text-xl font-headline font-bold text-white mb-2">No hay atletas vinculados</h2>
          <p className="text-zinc-400 font-body max-w-md mx-auto">
            Aún no tienes atletas vinculados a tu cuenta. Si crees que esto es un error, por favor contacta a la administración de Kansas Flag.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {athletes.map((athlete) => (
            <AthleteCard key={athlete.id} athlete={athlete as any} />
          ))}
        </div>
      )}
    </div>
  );
}
