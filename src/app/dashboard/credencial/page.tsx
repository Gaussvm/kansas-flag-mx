import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import CredentialCard from "./CredentialCard";
import Link from "next/link";

export const metadata = {
  title: "Credencial Digital | Kansas Flag",
};

export default async function CredentialPage() {
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
    <div className="min-h-[80vh] p-4 sm:p-8 flex flex-col items-center">
      <div className="w-full max-w-sm mb-6">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-on-surface-variant hover:text-on-surface transition-colors font-label font-bold text-sm">
          <span className="material-symbols-outlined text-lg">arrow_back</span>
          Volver al Portal
        </Link>
      </div>

      <CredentialCard profile={profile || {}} />

      <div className="mt-8 text-center max-w-sm">
        <p className="text-tertiary font-body text-xs">
          Esta es tu identificación oficial dentro de Kansas Flag. Muéstrala en los entrenamientos y partidos para registrar tu asistencia.
        </p>
        <div className="mt-4">
          <Link href="/dashboard/perfil" className="text-[#E31837] hover:underline font-bold text-sm">
            Editar mis datos o apodo
          </Link>
        </div>
      </div>
    </div>
  );
}
