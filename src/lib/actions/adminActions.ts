"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Reusable security verification for Server Actions
 */
async function verifyAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("No autorizado");
  
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'admin') {
    throw new Error("Acceso denegado: Se requiere rol de Administrador para ejecutar esta acción.");
  }
  return supabase;
}

export async function createProgramAction(data: { name: string; type: string; start_date: string; end_date: string }) {
  const supabase = await verifyAdmin();
  
  if (data.start_date > data.end_date) {
    throw new Error("La fecha de inicio no puede ser posterior a la fecha de fin.");
  }

  const { data: existing } = await supabase.from('programs')
    .select('id')
    .eq('name', data.name)
    .eq('start_date', data.start_date)
    .single();
    
  if (existing) {
    throw new Error("El programa ya existe para esa fecha de inicio.");
  }

  const { error } = await supabase.from('programs').insert(data);
  if (error) throw new Error("Error al crear programa: " + error.message);

  revalidatePath('/dashboard/admin/programas');
  return { success: true };
}

export async function registerAthleteAndEnrollAction(data: {
  first_name: string;
  last_name: string;
  birth_date: string;
  parent_id: string;
  program_id: string;
  payment_status: string;
}) {
  const supabase = await verifyAdmin();

  const { data: existingAthlete } = await supabase.from('athletes')
    .select('id')
    .eq('first_name', data.first_name)
    .eq('last_name', data.last_name)
    .eq('birth_date', data.birth_date)
    .single();
    
  if (existingAthlete) {
    throw new Error("El atleta ya existe en la base de datos.");
  }

  // 1. Create Athlete
  const { data: newAthlete, error: athleteError } = await supabase.from('athletes')
    .insert({
      first_name: data.first_name,
      last_name: data.last_name,
      birth_date: data.birth_date
    })
    .select('id').single();

  if (athleteError || !newAthlete) {
    throw new Error("Fallo al crear el atleta: " + athleteError?.message);
  }

  const athleteId = newAthlete.id;

  // Manual Rollback Block
  try {
    // 2. Link Parent
    if (data.parent_id) {
      const { error: guardianError } = await supabase.from('guardian_athletes')
        .insert({ guardian_id: data.parent_id, athlete_id: athleteId });
      
      if (guardianError) throw new Error("Fallo al vincular tutor: " + guardianError.message);
    }

    // 3. Enroll in Program
    if (data.program_id) {
      const { error: enrollError } = await supabase.from('enrollments')
        .insert({
          athlete_id: athleteId,
          program_id: data.program_id,
          payment_status: data.payment_status,
          status: 'active'
        });
        
      if (enrollError) {
        if (enrollError.code === '23505') {
          throw new Error("El atleta ya está inscrito en este programa.");
        }
        throw new Error("Fallo al inscribir: " + enrollError.message);
      }
    }
  } catch (err: any) {
    // MANUAL ROLLBACK: Delete the athlete if the linkage/enrollment failed
    await supabase.from('athletes').delete().eq('id', athleteId);
    throw new Error("Transacción fallida. Se ha revertido la creación del atleta: " + err.message);
  }

  revalidatePath('/dashboard/admin/crm');
  return { success: true };
}

export async function upsertScoutingResultsAction(programId: string, results: any[]) {
  const supabase = await verifyAdmin();
  if (results.length === 0) return { success: true };

  // Find or Create an Assessment for this program
  let { data: assessment } = await supabase.from('assessments')
    .select('id')
    .eq('program_id', programId)
    .limit(1)
    .single();

  let assessmentId;
  if (!assessment) {
    const { data: newAssessment, error: aError } = await supabase.from('assessments')
      .insert({
        program_id: programId,
        name: `Evaluación General`,
        date: new Date().toISOString().split('T')[0]
      })
      .select('id').single();
      
    if (aError) throw new Error("Error creando assessment: " + aError.message);
    assessmentId = newAssessment.id;
  } else {
    assessmentId = assessment.id;
  }

  // Format and Upsert
  const formattedResults = results.map(r => ({
    assessment_id: assessmentId,
    athlete_id: r.athlete_id,
    metric_key: r.metric_key,
    phase: r.phase,
    metric_label: r.metric_label,
    value_numeric: r.value_numeric,
    unit: r.unit,
    lower_is_better: r.lower_is_better
  }));

  const { error } = await supabase.from('assessment_results').upsert(formattedResults, {
    onConflict: 'assessment_id, athlete_id, metric_key, phase'
  });

  if (error) throw new Error("Error guardando resultados de scouting: " + error.message);

  revalidatePath('/dashboard/admin/scouting');
  return { success: true };
}

export async function updateProgramAction(id: string, data: { name: string; type: string; start_date: string; end_date: string; status: string }) {
  const supabase = await verifyAdmin();
  
  if (data.start_date > data.end_date) {
    throw new Error("La fecha de inicio no puede ser posterior a la fecha de fin.");
  }

  // Prevent duplicate if they changed name/start_date to match another existing one
  const { data: existing } = await supabase.from('programs')
    .select('id')
    .eq('name', data.name)
    .eq('start_date', data.start_date)
    .neq('id', id)
    .single();
    
  if (existing) {
    throw new Error("Ya existe otro programa con ese nombre en esa fecha de inicio.");
  }

  const { error } = await supabase.from('programs').update(data).eq('id', id);
  if (error) throw new Error("Error al actualizar programa: " + error.message);

  revalidatePath('/dashboard/admin/programas');
  return { success: true };
}

export async function updateProgramStatusAction(id: string, status: string) {
  const supabase = await verifyAdmin();
  
  const { error } = await supabase.from('programs').update({ status }).eq('id', id);
  if (error) throw new Error("Error al cambiar estado: " + error.message);

  revalidatePath('/dashboard/admin/programas');
  return { success: true };
}
