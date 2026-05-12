import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // Fetch user profile to get role and details
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="min-h-[80vh] p-8 max-w-7xl mx-auto">
      <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-sm border border-surface-container-highest">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-headline font-bold text-on-surface">
              Hola, {profile?.first_name || "Jugador"}
            </h1>
            <p className="text-on-surface-variant font-body mt-1">
              Bienvenido a tu portal de {profile?.role === 'admin' ? 'Administrador' : profile?.role === 'staff' ? 'Staff' : 'Jugador'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <a href="/dashboard/perfil" className="px-5 py-2 bg-surface-variant text-on-surface-variant rounded-full font-label text-sm font-bold hover:bg-surface-container-highest transition-colors">
              Editar Perfil
            </a>
            <form action="/auth/signout" method="post">
              <button className="px-5 py-2 bg-error-container text-on-error-container rounded-full font-label text-sm font-bold hover:bg-error hover:text-on-error transition-colors">
                Cerrar Sesión
              </button>
            </form>
          </div>
        </div>

        {/* 
          Admin Control Maestro Panel 
        */}
        {profile?.role === 'admin' && (
          <div className="mb-8">
            <div className="bg-gradient-to-r from-zinc-900 via-black to-[#1a0505] rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-[url('/images/inscripciones-hero.jpg')] bg-cover bg-center opacity-20 mix-blend-overlay group-hover:scale-105 transition-transform duration-700"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>
              
              <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-[#E31837]/20 border border-[#E31837]/50 flex items-center justify-center shadow-[0_0_30px_rgba(227,24,55,0.3)]">
                    <span className="material-symbols-outlined text-4xl text-[#E31837]">admin_panel_settings</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-headline font-black text-white uppercase tracking-wider mb-1">Control Maestro</h2>
                    <p className="text-zinc-400 font-body text-sm max-w-md">Panel de administración global: Gestiona jugadores, staff, categorías, tarifas y aprueba pagos.</p>
                  </div>
                </div>
                <a 
                  href="/dashboard/admin" 
                  className="w-full sm:w-auto px-8 py-4 bg-[#E31837] text-white rounded-xl font-headline font-black text-sm uppercase tracking-widest hover:bg-red-700 active:scale-95 transition-all shadow-[0_0_20px_rgba(227,24,55,0.4)] text-center whitespace-nowrap"
                >
                  Entrar al Panel
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Player General Modules */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Credencial (Preview) */}
          <div className="bg-surface-container rounded-2xl p-6 border border-surface-container-highest flex flex-col items-center justify-center text-center">
            <span className="material-symbols-outlined text-5xl text-primary-container mb-4">badge</span>
            <h3 className="font-headline font-bold text-lg mb-2">Credencial Digital</h3>
            <p className="text-sm text-tertiary mb-4">Accede a tu código QR para pase de lista en entrenamientos y partidos.</p>
            <a href="/dashboard/credencial" className="px-4 py-2 bg-secondary-container text-on-secondary-container rounded-full text-sm font-bold w-full hover:bg-secondary hover:text-on-secondary transition-colors">Ver Credencial</a>
          </div>

          {/* Card 2: Torneos */}
          <div className="bg-surface-container rounded-2xl p-6 border border-surface-container-highest flex flex-col items-center justify-center text-center">
            <span className="material-symbols-outlined text-5xl text-primary-container mb-4">trophy</span>
            <h3 className="font-headline font-bold text-lg mb-2">Mis Torneos</h3>
            <p className="text-sm text-tertiary mb-4">Revisa tu historial deportivo y próximos encuentros programados.</p>
            <button className="px-4 py-2 border border-outline text-on-surface rounded-full text-sm font-bold w-full">Ver Torneos</button>
          </div>

          {/* Card 3: Pagos */}
          <div className="bg-surface-container rounded-2xl p-6 border border-surface-container-highest flex flex-col items-center justify-center text-center">
            <span className="material-symbols-outlined text-5xl text-primary-container mb-4">payments</span>
            <h3 className="font-headline font-bold text-lg mb-2">Estado de Cuenta</h3>
            <p className="text-sm text-tertiary mb-4">Realiza pagos en línea o sube tus comprobantes de transferencia.</p>
            <button className="px-4 py-2 border border-outline text-on-surface rounded-full text-sm font-bold w-full">Ver Pagos</button>
          </div>
        </div>
      </div>
    </div>
  );
}
