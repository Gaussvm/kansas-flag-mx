"use client";

import { useState, useMemo, useEffect } from "react";
import { upsertScoutingResultsAction } from "@/lib/actions/adminActions";
import { EvaluationTemplate, EvaluationMetric } from "@/lib/types/scouting";
import { createClient } from "@/lib/supabase/client";

export default function AssessmentEntry({ 
  programs, 
  enrollments, 
  templates 
}: { 
  programs: any[], 
  enrollments: any[],
  templates: EvaluationTemplate[]
}) {
  const [selectedProgram, setSelectedProgram] = useState("");
  const [selectedPhase, setSelectedPhase] = useState("initial");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  // Form State: { athleteId: { metricKey: value } }
  const [formData, setFormData] = useState<Record<string, Record<string, string>>>({});

  const athletesInProgram = useMemo(() => enrollments
    .filter(e => e.program_id === selectedProgram)
    .map(e => ({
      id: e.athlete_id,
      name: `${e.athletes?.first_name} ${e.athletes?.last_name}`
    })), [enrollments, selectedProgram]);

  const activeTemplate = useMemo(() => {
    if (!selectedProgram) return null;
    const program = programs.find(p => p.id === selectedProgram);
    if (!program?.default_template_id) return null;
    return templates.find(t => t.id === program.default_template_id) || null;
  }, [selectedProgram, programs, templates]);

  const activeMetrics = useMemo(() => {
    if (!activeTemplate?.metrics) return [];
    return activeTemplate.metrics
      .filter(m => m.is_active)
      .sort((a, b) => a.sort_order - b.sort_order);
  }, [activeTemplate]);

  // Load existing results when program or phase changes
  useEffect(() => {
    async function loadExistingResults() {
      if (!selectedProgram) {
        setFormData({});
        return;
      }
      
      const { data: assessment } = await supabase
        .from('assessments')
        .select('id')
        .eq('program_id', selectedProgram)
        .limit(1)
        .single();
        
      if (!assessment) {
        setFormData({});
        return;
      }

      const { data: results } = await supabase
        .from('assessment_results')
        .select('athlete_id, metric_key, value_numeric, value_boolean, value_text')
        .eq('assessment_id', assessment.id)
        .eq('phase', selectedPhase);

      if (results && results.length > 0) {
        const newFormData: Record<string, Record<string, string>> = {};
        results.forEach(r => {
          if (!newFormData[r.athlete_id]) newFormData[r.athlete_id] = {};
          
          let val = '';
          if (r.value_numeric !== null) val = String(r.value_numeric);
          else if (r.value_boolean !== null) val = String(r.value_boolean);
          else if (r.value_text !== null) val = r.value_text;
          
          newFormData[r.athlete_id][r.metric_key] = val;
        });
        setFormData(newFormData);
      } else {
        setFormData({});
      }
    }
    
    loadExistingResults();
  }, [selectedProgram, selectedPhase, supabase]);

  const handleInputChange = (athleteId: string, metricKey: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [athleteId]: {
        ...(prev[athleteId] || {}),
        [metricKey]: value
      }
    }));
  };

  const handleSave = async () => {
    if (!selectedProgram) {
      setError("Selecciona un programa primero.");
      return;
    }
    
    setLoading(true);
    setError(null);

    // Transform formData into flat array for upsert
    const results = [];
    for (const athleteId of Object.keys(formData)) {
      const athleteData = formData[athleteId];
      for (const metricKey of Object.keys(athleteData)) {
        const valStr = athleteData[metricKey];
        if (valStr === undefined || valStr === "") continue;

        const metricConfig = activeMetrics.find(m => m.metric_key === metricKey);
        if (!metricConfig) continue;

        const isNumeric = metricConfig.input_type === 'number' || metricConfig.input_type === 'rating' || metricConfig.input_type === 'percentage';
        const isBoolean = metricConfig.input_type === 'boolean';
        
        let valNum = null;
        let valBool = null;
        let valText = null;

        if (isNumeric) {
           const parsed = parseFloat(valStr as string);
           if (!isNaN(parsed)) valNum = parsed;
        } else if (isBoolean) {
           valBool = valStr === 'true';
        } else {
           valText = valStr;
        }

        results.push({
          athlete_id: athleteId,
          metric_key: metricKey,
          evaluation_metric_id: metricConfig.id,
          phase: selectedPhase,
          metric_label: metricConfig.label,
          value_numeric: valNum,
          value_boolean: valBool,
          value_text: valText,
          unit: metricConfig.unit,
          lower_is_better: metricConfig.lower_is_better
        });
      }
    }

    try {
      await upsertScoutingResultsAction(selectedProgram, results);
      // Optional: Show success toast, clear form
      setFormData({});
      alert("Resultados guardados exitosamente.");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
      
      {/* Filters Header */}
      <div className="flex flex-col md:flex-row gap-4 bg-zinc-950 p-4 rounded-xl border border-white/5">
        <div className="flex-grow">
          <label className="block text-xs font-label text-zinc-500 uppercase mb-1">Programa</label>
          <select 
            value={selectedProgram}
            onChange={(e) => setSelectedProgram(e.target.value)}
            className="w-full bg-black border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-red-500"
          >
            <option value="">-- Seleccionar --</option>
            {programs.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        
        <div className="w-full md:w-48">
          <label className="block text-xs font-label text-zinc-500 uppercase mb-1">Fase de Evaluación</label>
          <select 
            value={selectedPhase}
            onChange={(e) => setSelectedPhase(e.target.value)}
            className="w-full bg-black border border-white/10 rounded-lg p-2 text-white focus:outline-none focus:border-red-500"
          >
            <option value="initial">Inicial</option>
            <option value="progress">Progreso (Intermedio)</option>
            <option value="final">Final</option>
          </select>
        </div>
        
        <div className="w-full md:w-auto flex items-end">
          <button 
            onClick={handleSave}
            disabled={loading || athletesInProgram.length === 0}
            className="w-full md:w-auto px-6 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white rounded-lg font-headline font-bold uppercase tracking-wider transition-colors"
          >
            {loading ? "Guardando..." : "Guardar Grid"}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500 text-red-500 rounded text-sm">
          {error}
        </div>
      )}

      {/* Data Grid */}
      {selectedProgram ? (
        !activeTemplate ? (
          <div className="text-center py-12 border border-dashed border-white/10 rounded-xl">
            <span className="material-symbols-outlined text-4xl text-zinc-800 mb-2">fact_check</span>
            <p className="text-zinc-500">Este programa no tiene una plantilla de evaluación asignada.</p>
            <a href="/dashboard/admin/scouting/templates" className="inline-block mt-4 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-white text-sm font-medium transition-colors">
              Ir a Configurar Plantillas &rarr;
            </a>
          </div>
        ) : athletesInProgram.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-white/10 rounded-xl">
            <p className="text-zinc-500">No hay atletas inscritos en este programa.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-left text-sm font-body whitespace-nowrap">
              <thead className="bg-zinc-950 text-zinc-400 font-label uppercase tracking-wider text-xs">
                <tr>
                  <th className="px-4 py-3 sticky left-0 bg-zinc-950 z-10 border-r border-white/10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.5)]">Atleta</th>
                  {activeMetrics.map(m => (
                    <th key={m.metric_key} className="px-4 py-3 text-center min-w-[120px]">
                      <span className="block">{m.label}</span>
                      {m.unit && <span className="text-[10px] text-zinc-600 lowercase">({m.unit})</span>}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-zinc-300">
                {athletesInProgram.map(athlete => (
                  <tr key={athlete.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 sticky left-0 bg-zinc-900 border-r border-white/10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.5)] font-bold text-white">
                      {athlete.name}
                    </td>
                    {activeMetrics.map(m => (
                      <td key={m.metric_key} className="px-2 py-2 text-center">
                        {m.input_type === 'boolean' ? (
                          <input 
                            type="checkbox"
                            checked={formData[athlete.id]?.[m.metric_key] === 'true'}
                            onChange={(e) => handleInputChange(athlete.id, m.metric_key, e.target.checked ? 'true' : 'false')}
                            className="w-5 h-5 rounded border-zinc-700 bg-zinc-900 text-red-500 mx-auto block"
                          />
                        ) : m.input_type === 'select' ? (
                           <select
                            value={formData[athlete.id]?.[m.metric_key] || ''}
                            onChange={(e) => handleInputChange(athlete.id, m.metric_key, e.target.value)}
                            className="w-full min-w-[100px] bg-black border border-white/10 rounded p-2 text-white focus:outline-none focus:border-red-500"
                           >
                             <option value="">--</option>
                             {(m.options || []).map((opt: string) => (
                               <option key={opt} value={opt}>{opt}</option>
                             ))}
                           </select>
                        ) : m.input_type === 'textarea' ? (
                           <textarea
                            value={formData[athlete.id]?.[m.metric_key] || ''}
                            onChange={(e) => handleInputChange(athlete.id, m.metric_key, e.target.value)}
                            className="w-full min-w-[150px] bg-black border border-white/10 rounded p-2 text-white focus:outline-none focus:border-red-500"
                            placeholder="Notas..."
                            rows={1}
                           />
                        ) : (
                          <input 
                            type={m.input_type === 'number' || m.input_type === 'percentage' || m.input_type === 'rating' ? 'number' : 'text'}
                            step="any"
                            value={formData[athlete.id]?.[m.metric_key] || ''}
                            onChange={(e) => handleInputChange(athlete.id, m.metric_key, e.target.value)}
                            className="w-full min-w-[80px] bg-black border border-white/10 rounded p-2 text-center text-white focus:outline-none focus:border-red-500 mx-auto block"
                            placeholder="--"
                          />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      ) : (
        <div className="text-center py-12 border border-dashed border-white/10 rounded-xl">
          <span className="material-symbols-outlined text-4xl text-zinc-800 mb-2">fact_check</span>
          <p className="text-zinc-500">Selecciona un programa para cargar la cuadrícula de captura.</p>
        </div>
      )}
    </div>
  );
}
