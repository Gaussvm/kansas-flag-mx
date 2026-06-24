import { createClient } from "@/lib/supabase/server";
import AssessmentEntry from "@/components/admin/AssessmentEntry";

export default async function ScoutingPage() {
  const supabase = await createClient();

  const { data: programs } = await supabase
    .from("programs")
    .select("id, name")
    .eq("status", "active")
    .order("start_date", { ascending: false });

  // Get all active enrollments with athlete info
  const { data: enrollments } = await supabase
    .from("enrollments")
    .select(`
      athlete_id,
      program_id,
      athletes ( first_name, last_name )
    `)
    .eq("status", "active");

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-headline font-black text-white uppercase tracking-tight">Scouting y Evaluaciones</h2>
        <p className="text-zinc-400 font-body text-sm mt-1">Captura masiva de métricas físicas y técnicas.</p>
      </div>

      <AssessmentEntry programs={programs || []} enrollments={enrollments || []} />
    </div>
  );
}
