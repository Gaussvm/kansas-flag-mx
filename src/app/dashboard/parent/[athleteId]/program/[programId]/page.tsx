import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import BoletinDashboard from "@/components/parent/BoletinDashboard";

interface PageProps {
  params: Promise<{
    athleteId: string;
    programId: string;
  }>;
}

export default async function BoletinPage({ params }: PageProps) {
  const supabase = await createClient();
  const resolvedParams = await params;

  // 1. Get Athlete & Enrollment Data
  const { data: athlete } = await supabase
    .from("athletes")
    .select(`
      *,
      enrollments!inner (
        *,
        programs!inner (*)
      )
    `)
    .eq("id", resolvedParams.athleteId)
    .eq("enrollments.program_id", resolvedParams.programId)
    .single();

  if (!athlete) {
    notFound();
  }

  // The `enrollments` array will have exactly 1 item because of the !inner and .eq filters
  const enrollment = athlete.enrollments[0];
  const program = enrollment.programs;

  // 2. Get Assessment Results (Filtered by athlete & program via inner join)
  const { data: results } = await supabase
    .from("assessment_results")
    .select(`
      *,
      assessments!inner ( program_id )
    `)
    .eq("athlete_id", resolvedParams.athleteId)
    .eq("assessments.program_id", resolvedParams.programId)
    .order('created_at', { ascending: true });

  // 3. Get Public Coach Notes
  const { data: notes } = await supabase
    .from("coach_notes")
    .select("*")
    .eq("athlete_id", resolvedParams.athleteId)
    .eq("is_private", false)
    .order('created_at', { ascending: false });

  // 4. Get Evidence Links
  const { data: evidence } = await supabase
    .from("evidence_links")
    .select("*")
    .eq("athlete_id", resolvedParams.athleteId)
    .order('created_at', { ascending: false });

  return (
    <BoletinDashboard
      athlete={athlete}
      program={program}
      enrollment={enrollment}
      results={results || []}
      notes={notes || []}
      evidence={evidence || []}
    />
  );
}
