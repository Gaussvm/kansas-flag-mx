"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { verifyOperationalAdmin, verifyCanManageLocation, verifyTemplateManager } from "./adminActions";
import { EvaluationTemplate, EvaluationMetric } from "@/lib/types/scouting";

export async function createTemplateAction(data: Partial<EvaluationTemplate>) {
  await verifyTemplateManager(); // Bloquea Director, coach, staff
  const supabase = await verifyCanManageLocation(data.location_id || ""); // Bloquea a staff_admin si no es de su sede
  
  const { data: newTemplate, error } = await supabase.from('evaluation_templates')
    .insert({
      name: data.name,
      description: data.description,
      type: data.type || 'custom',
      program_id: data.program_id || null,
      location_id: data.location_id || null,
      is_active: true
    })
    .select()
    .single();

  if (error) throw new Error("Error creando plantilla: " + error.message);

  if (data.program_id) {
    await supabase.from('programs').update({ default_template_id: newTemplate.id }).eq('id', data.program_id);
  }

  revalidatePath('/dashboard/admin/scouting/templates');
  return newTemplate;
}

export async function updateTemplateAction(id: string, data: Partial<EvaluationTemplate>) {
  await verifyTemplateManager();
  const supabase = await verifyCanManageLocation(data.location_id || ""); 
  
  const { error } = await supabase.from('evaluation_templates')
    .update({
      name: data.name,
      description: data.description,
      type: data.type,
      program_id: data.program_id,
      location_id: data.location_id,
      is_active: data.is_active
    })
    .eq('id', id);

  if (error) throw new Error("Error actualizando plantilla: " + error.message);

  if (data.program_id) {
    await supabase.from('programs').update({ default_template_id: id }).eq('id', data.program_id);
  }

  revalidatePath('/dashboard/admin/scouting/templates');
  return { success: true };
}

export async function upsertMetricsAction(templateId: string, metrics: Partial<EvaluationMetric>[]) {
  const supabase = await verifyTemplateManager();
  
  const formattedMetrics = metrics.map(m => ({
    ...(m.id && { id: m.id }), // Include ID only if it exists (for update vs insert)
    template_id: templateId,
    metric_key: m.metric_key,
    label: m.label,
    description: m.description,
    input_type: m.input_type || 'number',
    unit: m.unit,
    lower_is_better: m.lower_is_better || false,
    required: m.required || false,
    sort_order: m.sort_order || 0,
    min_value: m.min_value,
    max_value: m.max_value,
    options: m.options,
    visibility: m.visibility || 'internal',
    category: m.category || 'físico',
    is_active: m.is_active !== undefined ? m.is_active : true
  }));

  const { error } = await supabase.from('evaluation_metrics')
    .upsert(formattedMetrics, { onConflict: 'template_id,metric_key' });

  if (error) throw new Error("Error guardando métricas: " + error.message);

  revalidatePath(`/dashboard/admin/scouting/templates/${templateId}`);
  return { success: true };
}
