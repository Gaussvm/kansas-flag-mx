"use client";

import { useState } from "react";
import { SCOUTING_METRICS } from "@/lib/constants/metrics";
import { upsertScoutingResultsAction } from "@/lib/actions/adminActions";

export default function AssessmentEntry({ programs, enrollments }: { programs: any[], enrollments: any[] }) {
  const [selectedProgram, setSelectedProgram] = useState("");
  const [selectedPhase, setSelectedPhase] = useState("initial");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State: { athleteId: { metricKey: value } }
  const [formData, setFormData] = useState<Record<string, Record<string, string>>>({});

  const athletesInProgram = enrollments
    .filter(e => e.program_id === selectedProgram)
    .map(e => ({
      id: e.athlete_id,
      name: `${e.athletes?.first_name} ${e.athletes?.last_name}`
    }));

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
      const metrics = formData[athleteId];
      for (const metricKey of Object.keys(metrics)) {
        const valStr = metrics[metricKey];
        if (valStr.trim() === "") continue;

        const valNum = parseFloat(valStr);
        const metricConfig = SCOUTING_METRICS.find(m => m.key === metricKey);
        
        if (metricConfig && !isNaN(valNum)) {
          results.push({
            athlete_id: athleteId,
            metric_key: metricKey,
            phase: selectedPhase,
            metric_label: metricConfig.label,
            value_numeric: valNum,
            unit: metricConfig.unit,
            lower_is_better: metricConfig.lower_is_better
          });
        }
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
        athletesInProgram.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-white/10 rounded-xl">
            <p className="text-zinc-500">No hay atletas inscritos en este programa.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-white/10">
            <table className="w-full text-left text-sm font-body whitespace-nowrap">
              <thead className="bg-zinc-950 text-zinc-400 font-label uppercase tracking-wider text-xs">
                <tr>
                  <th className="px-4 py-3 sticky left-0 bg-zinc-950 z-10 border-r border-white/10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.5)]">Atleta</th>
                  {SCOUTING_METRICS.map(m => (
                    <th key={m.key} className="px-4 py-3 text-center">
                      <span className="block">{m.label}</span>
                      <span className="text-[10px] text-zinc-600 lowercase">({m.unit})</span>
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
                    {SCOUTING_METRICS.map(m => (
                      <td key={m.key} className="px-2 py-2">
                        <input 
                          type="number"
                          step="0.01"
                          value={formData[athlete.id]?.[m.key] || ''}
                          onChange={(e) => handleInputChange(athlete.id, m.key, e.target.value)}
                          className="w-20 bg-black border border-white/10 rounded p-2 text-center text-white focus:outline-none focus:border-red-500 mx-auto block"
                          placeholder="--"
                        />
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
