import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function ParentLayout({
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

  if (profile?.role !== "parent" && profile?.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col border-t border-white/5">
      {/* Header NavBar */}
      <header className="bg-zinc-900 border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-red-500 text-3xl">sports_football</span>
            <span className="font-headline font-black text-xl text-white tracking-wide uppercase">Kansas Flag</span>
            <span className="ml-2 px-2 py-0.5 bg-red-500/20 text-red-400 rounded text-xs font-bold font-label uppercase tracking-widest">Parent Portal</span>
          </div>
          
          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard/parent"
              className="text-zinc-400 hover:text-white transition-colors font-headline font-bold text-sm"
            >
              Mis Atletas
            </Link>
            
            <form action="/auth/signout" method="post">
              <button className="flex items-center justify-center p-2 rounded-full hover:bg-white/10 text-zinc-400 hover:text-white transition-colors">
                <span className="material-symbols-outlined text-xl">logout</span>
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-grow p-4 sm:p-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
