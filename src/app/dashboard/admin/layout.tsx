import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import AdminNav from "./AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col md:flex-row border-t border-white/5">
      {/* Sidebar Navigation */}
      <AdminNav />

      {/* Main Content Area */}
      <div className="flex-grow p-4 sm:p-8 overflow-y-auto w-full">
        <div className="w-full mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 pb-6 border-b border-white/10">
            <div>
              <h1 className="text-3xl font-headline font-black text-white uppercase tracking-tight">Control Maestro</h1>
              <p className="text-zinc-400 font-body text-sm mt-1">Gestión global de la Liga Kansas Flag</p>
            </div>
            <Link 
              href="/dashboard"
              className="px-4 py-2 bg-white/10 text-white rounded-lg font-headline font-bold text-sm hover:bg-white/20 transition-colors flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">exit_to_app</span>
              <span className="hidden sm:inline">Salir al Portal</span>
            </Link>
          </div>

          {/* Render Active Page */}
          {children}
        </div>
      </div>
    </div>
  );
}
