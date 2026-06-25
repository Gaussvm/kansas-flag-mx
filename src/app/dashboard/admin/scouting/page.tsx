import { createClient } from "@/lib/supabase/server";
import AssessmentEntry from "@/components/admin/AssessmentEntry";

export default async function ScoutingPage() {
  const supabase = await createClient();

  const { data: programs, error: programsError } = await supabase
    .from("programs")
    .select("id, name")
    .order("start_date", { ascending: false });

  if (programsError) console.error("Programs error:", programsError);

  // Get all enrollments with athlete info
  const { data: enrollments, error: enrollmentsError } = await supabase
    .from("enrollments")
    .select(`
      athlete_id,
      program_id,
      athletes ( first_name, last_name )
    `);

  if (enrollmentsError) console.error("Enrollments error:", enrollmentsError);

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
