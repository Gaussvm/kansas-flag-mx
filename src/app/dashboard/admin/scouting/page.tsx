import { createClient } from "@/lib/supabase/server";
import AssessmentEntry from "@/components/admin/AssessmentEntry";
import Link from "next/link";
import { Settings } from "lucide-react";

export default async function ScoutingPage() {
  const supabase = await createClient();

  const { data: programs, error: programsError } = await supabase
    .from("programs")
    .select("id, name, default_template_id")
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

  // Get templates and metrics
  const { data: templates } = await supabase
    .from("evaluation_templates")
    .select(`
      *,
      metrics:evaluation_metrics(*)
    `);

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-headline font-black text-white uppercase tracking-tight">Scouting y Evaluaciones</h2>
          <p className="text-zinc-400 font-body text-sm mt-1">Captura masiva de métricas físicas y técnicas.</p>
        </div>
        <Link 
          href="/dashboard/admin/scouting/templates"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors h-10 px-4 py-2 border border-white/10 bg-zinc-900 text-white hover:bg-zinc-800"
        >
          <Settings className="h-4 w-4 mr-2" /> Configurar Plantillas
        </Link>
      </div>

      <AssessmentEntry 
        programs={programs || []} 
        enrollments={enrollments || []} 
        templates={templates || []}
      />
    </div>
  );
}
