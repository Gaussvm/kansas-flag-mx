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

  if (profile?.role === 'admin') {
    redirect("/dashboard/admin");
  }

  if (profile?.role === 'parent') {
    redirect("/dashboard/parent");
  }

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
