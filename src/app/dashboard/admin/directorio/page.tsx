import { createClient } from "@/lib/supabase/server";
import UsersTable from "./UsersTable";

export const metadata = {
  title: "Directorio de Usuarios | Control Maestro",
};

export default async function DirectorioPage() {
  const supabase = await createClient();

  // Fetch all profiles
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching profiles:", error);
  }

  return (
    <div className="animate-in fade-in duration-500">
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-headline font-black text-white uppercase tracking-wider">Directorio de Usuarios</h2>
          <p className="text-zinc-400 font-body text-sm mt-1">Gestiona los permisos y roles de todos los miembros.</p>
        </div>
        <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl flex items-center gap-2">
          <span className="material-symbols-outlined text-[#E31837]">group</span>
          <span className="font-headline font-bold text-white">{profiles?.length || 0} Registrados</span>
        </div>
      </div>

      <div className="bg-[#111] border border-white/10 rounded-2xl overflow-hidden">
        <UsersTable initialUsers={profiles || []} />
      </div>
    </div>
  );
}
