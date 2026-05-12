import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProfileForm from "./ProfileForm";
import Link from "next/link";

export const metadata = {
  title: "Editar Perfil | Kansas Flag",
};

export default async function ProfilePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return (
    <div className="min-h-[80vh] p-4 sm:p-8 max-w-3xl mx-auto">
      <div className="mb-6 flex items-center gap-4">
        <Link href="/dashboard" className="w-10 h-10 flex items-center justify-center bg-surface-container rounded-full hover:bg-surface-container-highest transition-colors">
          <span className="material-symbols-outlined text-on-surface">arrow_back</span>
        </Link>
        <div>
          <h1 className="text-2xl sm:text-3xl font-headline font-black text-on-surface uppercase tracking-tight">
            Personaliza tu Gafete
          </h1>
          <p className="text-tertiary font-body text-sm mt-1">
            Estos datos aparecerán en tu Credencial Digital.
          </p>
        </div>
      </div>

      <div className="bg-surface-container-lowest rounded-3xl p-6 sm:p-8 shadow-sm border border-surface-container-highest">
        <ProfileForm profile={profile || {}} />
      </div>
    </div>
  );
}
