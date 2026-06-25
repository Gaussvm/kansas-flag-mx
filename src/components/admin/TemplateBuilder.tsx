"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, GripVertical, Save, AlertCircle } from "lucide-react";
import { EvaluationTemplate, EvaluationMetric, InputType, Visibility } from "@/lib/types/scouting";
import { createTemplateAction, updateTemplateAction, upsertMetricsAction } from "@/lib/actions/scoutingActions";

export default function TemplateBuilder({ 
  initialTemplate, 
  initialMetrics,
  locations,
  programs
}: { 
  initialTemplate: any;
  initialMetrics: any[];
  locations: any[];
  programs: any[];
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [template, setTemplate] = useState<Partial<EvaluationTemplate>>(
    initialTemplate || {
      name: "",
      description: "",
      type: "custom",
      is_active: true,
      location_id: "",
      program_id: ""
    }
  );

  const [metrics, setMetrics] = useState<Partial<EvaluationMetric>[]>(
    initialMetrics?.length ? initialMetrics : [
      {
        metric_key: "nueva_metrica",
        label: "Nueva Métrica",
        input_type: "number",
        visibility: "internal",
        category: "físico",
        lower_is_better: false,
        required: false,
        sort_order: 10
      }
    ]
  );

  const handleTemplateChange = (e: any) => {
    setTemplate({ ...template, [e.target.name]: e.target.value });
  };

  const handleMetricChange = (index: number, field: keyof EvaluationMetric, value: any) => {
    const newMetrics = [...metrics];
    newMetrics[index] = { ...newMetrics[index], [field]: value };
    setMetrics(newMetrics);
  };

  const addMetric = () => {
    setMetrics([
      ...metrics,
      {
        metric_key: `metrica_${metrics.length + 1}`,
        label: `Métrica ${metrics.length + 1}`,
        input_type: "number",
        visibility: "internal",
        category: "físico",
        lower_is_better: false,
        required: false,
        sort_order: (metrics.length + 1) * 10
      }
    ]);
  };

  const removeMetric = (index: number) => {
    const newMetrics = [...metrics];
    newMetrics.splice(index, 1);
    setMetrics(newMetrics);
  };

  const handleSubmit = async () => {
    if (!template.name) {
      setError("El nombre de la plantilla es requerido");
      return;
    }
    if (metrics.length === 0) {
      setError("Debes agregar al menos una métrica");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      let templateId = template.id;

      if (!templateId) {
        const newTemplate = await createTemplateAction(template);
        templateId = newTemplate.id;
      } else {
        await updateTemplateAction(templateId, template);
      }

      await upsertMetricsAction(templateId!, metrics);
      
      router.push("/dashboard/admin/scouting/templates");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputTypes: {value: InputType, label: string}[] = [
    {value: 'number', label: 'Número'},
    {value: 'text', label: 'Texto Corto'},
    {value: 'textarea', label: 'Texto Largo'},
    {value: 'select', label: 'Selección Múltiple'},
    {value: 'boolean', label: 'Sí / No (Checkbox)'},
    {value: 'rating', label: 'Estrellas (Rating)'},
    {value: 'time', label: 'Tiempo (MM:SS)'},
    {value: 'distance', label: 'Distancia'},
  ];

  const visibilities: {value: Visibility, label: string}[] = [
    {value: 'internal', label: 'Interno (Staff)'},
    {value: 'parent_visible', label: 'Visible para Papás'},
    {value: 'coach_only', label: 'Solo Coaches'},
  ];

  return (
    <div className="space-y-8">
      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-200 p-4 rounded-xl flex items-center gap-3">
          <AlertCircle className="h-5 w-5" />
          <p>{error}</p>
        </div>
      )}

      {/* Template Info Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-4">
        <h2 className="text-xl font-semibold text-slate-100 mb-4">Información General</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Nombre de la Plantilla *</label>
            <input 
              name="name"
              value={template.name || ""}
              onChange={handleTemplateChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
              placeholder="Ej. Combine Summer Camp 2026"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Tipo</label>
            <select 
              name="type"
              value={template.type || "custom"}
              onChange={handleTemplateChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:ring-2 focus:ring-orange-500 outline-none"
            >
              <option value="combine">Combine</option>
              <option value="scouting">Scouting</option>
              <option value="tournament">Torneo</option>
              <option value="custom">Personalizado</option>
            </select>
          </div>

          <div className="col-span-full space-y-2">
            <label className="text-sm font-medium text-slate-300">Descripción</label>
            <textarea 
              name="description"
              value={template.description || ""}
              onChange={handleTemplateChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 focus:ring-2 focus:ring-orange-500 outline-none"
              placeholder="Descripción breve..."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Restringir a Sede (Opcional)</label>
            <select 
              name="location_id"
              value={template.location_id || ""}
              onChange={handleTemplateChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 outline-none"
            >
              <option value="">Global (Todas las sedes)</option>
              {locations.map(loc => <option key={loc.id} value={loc.id}>{loc.name}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-300">Asignar a Programa Default (Opcional)</label>
            <select 
              name="program_id"
              value={template.program_id || ""}
              onChange={handleTemplateChange}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-slate-200 outline-none"
            >
              <option value="">Ninguno</option>
              {programs.filter(p => !template.location_id || p.location_id === template.location_id).map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Metrics Builder */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-100">Métricas de Evaluación</h2>
            <p className="text-sm text-slate-400">Define los campos que se evaluarán en esta plantilla</p>
          </div>
          <button type="button" onClick={addMetric} className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors h-10 px-4 py-2 border border-slate-700 bg-slate-800 text-white hover:bg-slate-700">
            <Plus className="h-4 w-4 mr-2" /> Agregar Métrica
          </button>
        </div>

        <div className="space-y-4">
          {metrics.map((metric, index) => (
            <div key={index} className="flex flex-col gap-4 p-4 border border-slate-800 bg-slate-950 rounded-xl relative group">
              
              <div className="flex items-start gap-4">
                <div className="mt-2 text-slate-600 cursor-grab">
                  <GripVertical className="h-5 w-5" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-grow">
                  <div className="space-y-2">
                    <label className="text-xs text-slate-500">Label (Público)</label>
                    <input 
                      value={metric.label || ""}
                      onChange={(e) => handleMetricChange(index, 'label', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none focus:border-orange-500"
                      placeholder="Ej. 40-Yard Dash"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-slate-500">Database Key (Único)</label>
                    <input 
                      value={metric.metric_key || ""}
                      onChange={(e) => handleMetricChange(index, 'metric_key', e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-400 outline-none"
                      placeholder="ej_40_yard"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-slate-500">Tipo de Entrada</label>
                    <select 
                      value={metric.input_type || "number"}
                      onChange={(e) => handleMetricChange(index, 'input_type', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none"
                    >
                      {inputTypes.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs text-slate-500">Categoría</label>
                    <input 
                      value={metric.category || ""}
                      onChange={(e) => handleMetricChange(index, 'category', e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-200 outline-none"
                      placeholder="físico, técnico, actitud..."
                    />
                  </div>
                </div>

                <button 
                  type="button"
                  onClick={() => removeMetric(index)}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors h-10 w-10 text-slate-500 hover:text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>

              {/* Advanced Options Row */}
              <div className="pl-9 grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-xs text-slate-500">Visibilidad</label>
                  <select 
                    value={metric.visibility || "internal"}
                    onChange={(e) => handleMetricChange(index, 'visibility', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 outline-none"
                  >
                    {visibilities.map(v => <option key={v.value} value={v.value}>{v.label}</option>)}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-slate-500">Unidad (ej. kg, s, cm)</label>
                  <input 
                    value={metric.unit || ""}
                    onChange={(e) => handleMetricChange(index, 'unit', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 outline-none"
                    placeholder="s, kg, pts"
                  />
                </div>

                <div className="flex items-center gap-2 pt-6">
                  <input 
                    type="checkbox"
                    id={`lower_better_${index}`}
                    checked={metric.lower_is_better || false}
                    onChange={(e) => handleMetricChange(index, 'lower_is_better', e.target.checked)}
                    className="rounded border-slate-700 bg-slate-900 text-orange-500"
                  />
                  <label htmlFor={`lower_better_${index}`} className="text-xs text-slate-400">¿Menor es mejor? (ej. Tiempo)</label>
                </div>

                {metric.input_type === 'select' && (
                  <div className="space-y-2 col-span-full">
                    <label className="text-xs text-slate-500">Opciones (separadas por coma)</label>
                    <input 
                      value={metric.options ? metric.options.join(',') : ""}
                      onChange={(e) => handleMetricChange(index, 'options', e.target.value.split(',').map(s => s.trim()))}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-300 outline-none focus:border-orange-500"
                      placeholder="Opción 1, Opción 2, Opción 3"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button 
          type="button"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors h-10 px-4 py-2 border border-slate-700 bg-slate-900 hover:bg-slate-800 text-white"
          onClick={() => router.push("/dashboard/admin/scouting/templates")}
        >
          Cancelar
        </button>
        <button 
          type="button"
          onClick={handleSubmit} 
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors h-10 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white disabled:opacity-50"
        >
          <Save className="h-4 w-4 mr-2" />
          {isSubmitting ? "Guardando..." : "Guardar Plantilla"}
        </button>
      </div>
    </div>
  );
}
