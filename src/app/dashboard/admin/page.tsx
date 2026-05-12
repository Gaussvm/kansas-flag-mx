import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export const metadata = {
  title: "Control Maestro | Kansas Flag",
};

export default async function AdminDashboardHome() {
  const supabase = await createClient();

  // Fetch some quick stats
  const { count: usersCount } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  const { count: categoriesCount } = await supabase
    .from("categories")
    .select("*", { count: "exact", head: true });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
          <span className="material-symbols-outlined text-4xl text-[#E31837] mb-2">groups</span>
          <h3 className="text-3xl font-headline font-black text-white">{usersCount || 0}</h3>
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">Usuarios Totales</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
          <span className="material-symbols-outlined text-4xl text-[#E31837] mb-2">category</span>
          <h3 className="text-3xl font-headline font-black text-white">{categoriesCount || 0}</h3>
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">Categorías Activas</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
          <span className="material-symbols-outlined text-4xl text-[#E31837] mb-2">attach_money</span>
          <h3 className="text-3xl font-headline font-black text-white">--</h3>
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest mt-1">Pagos Pendientes</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-headline font-black text-white uppercase tracking-wider mb-4 border-b border-white/10 pb-2">Módulos de Gestión</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <Link href="/dashboard/admin/directorio" className="group relative bg-black border border-white/10 rounded-2xl p-6 hover:border-[#E31837]/50 transition-colors overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-8xl text-white">group</span>
            </div>
            <div className="relative z-10">
              <h3 className="text-xl font-headline font-black text-white uppercase tracking-wider mb-2">Directorio</h3>
              <p className="text-sm text-zinc-400 font-body mb-4 max-w-[80%]">Visualiza todos los jugadores registrados, asigna roles de Staff o Administrador.</p>
              <span className="text-[#E31837] font-bold text-sm uppercase tracking-widest group-hover:text-red-400 flex items-center gap-1">
                Administrar Usuarios <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </span>
            </div>
          </Link>

          <Link href="/dashboard/admin/catalogos" className="group relative bg-black border border-white/10 rounded-2xl p-6 hover:border-[#E31837]/50 transition-colors overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-8xl text-white">list_alt</span>
            </div>
            <div className="relative z-10">
              <h3 className="text-xl font-headline font-black text-white uppercase tracking-wider mb-2">Catálogos</h3>
              <p className="text-sm text-zinc-400 font-body mb-4 max-w-[80%]">Crea y edita las categorías oficiales (Varonil, Femenil, Mixto) y Torneos.</p>
              <span className="text-[#E31837] font-bold text-sm uppercase tracking-widest group-hover:text-red-400 flex items-center gap-1">
                Configurar Liga <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </span>
            </div>
          </Link>

          <Link href="/dashboard/admin/finanzas" className="group relative bg-black border border-white/10 rounded-2xl p-6 hover:border-[#E31837]/50 transition-colors overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <span className="material-symbols-outlined text-8xl text-white">account_balance</span>
            </div>
            <div className="relative z-10">
              <h3 className="text-xl font-headline font-black text-white uppercase tracking-wider mb-2">Finanzas y Tarifas</h3>
              <p className="text-sm text-zinc-400 font-body mb-4 max-w-[80%]">Configura los costos de inscripción y revisa los comprobantes de pago subidos.</p>
              <span className="text-[#E31837] font-bold text-sm uppercase tracking-widest group-hover:text-red-400 flex items-center gap-1">
                Administrar Pagos <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </span>
            </div>
          </Link>

        </div>
      </div>
    </div>
  );
}
