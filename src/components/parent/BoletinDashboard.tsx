import Link from "next/link";

interface Result {
  metric_key: string;
  metric_label: string;
  value_numeric: number | null;
  value_text: string | null;
  value_boolean: boolean | null;
  unit: string | null;
  lower_is_better: boolean;
  phase: string;
  created_at: string;
  evaluation_metrics?: {
    category: string;
    input_type: string;
    options: any;
  } | null;
}

interface Note {
  id: string;
  note_text: string;
  created_at: string;
}

interface Evidence {
  id: string;
  title: string;
  url: string;
  type: string;
}

interface Props {
  athlete: any;
  program: any;
  enrollment: any;
  results: Result[];
  notes: Note[];
  evidence: Evidence[];
}

export default function BoletinDashboard({ athlete, program, enrollment, results, notes, evidence }: Props) {
  // Group results by category -> metric_key
  const categoriesMap = new Map<string, Map<string, { label: string, unit: string | null, lower_is_better: boolean, input_type: string, initial?: Result, final?: Result, progress?: Result[] }>>();
  
  results.forEach(r => {
    const category = r.evaluation_metrics?.category || 'General';
    const inputType = r.evaluation_metrics?.input_type || 'number';

    if (!categoriesMap.has(category)) {
      categoriesMap.set(category, new Map());
    }
    const metricsMap = categoriesMap.get(category)!;

    if (!metricsMap.has(r.metric_key)) {
      metricsMap.set(r.metric_key, { label: r.metric_label, unit: r.unit, lower_is_better: r.lower_is_better, input_type: inputType, progress: [] });
    }
    const m = metricsMap.get(r.metric_key)!;
    if (r.phase === 'initial') m.initial = r;
    else if (r.phase === 'final') m.final = r;
    else m.progress!.push(r);
  });

  const categories = Array.from(categoriesMap.entries()).map(([catName, metricsMap]) => ({
    name: catName,
    metrics: Array.from(metricsMap.values())
  }));

  return (
    <div className="space-y-8 pb-12">
      {/* Header & Navigation */}
      <div>
        <Link href="/dashboard/parent" className="text-zinc-400 hover:text-white flex items-center gap-1 font-label text-sm uppercase tracking-widest mb-4 transition-colors">
          <span className="material-symbols-outlined text-sm">arrow_back</span>
          Volver a mis Atletas
        </Link>
        <h1 className="text-3xl md:text-4xl font-headline font-black text-white uppercase tracking-tight">
          Boletín Deportivo
        </h1>
        <p className="text-zinc-400 font-body mt-1">
          {athlete.first_name} {athlete.last_name} • {program.name}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Info & Notes */}
        <div className="lg:col-span-1 space-y-6">
          {/* Status Card */}
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 shadow-xl">
            <h3 className="font-headline font-bold text-white uppercase tracking-wide mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-red-500">info</span>
              Información
            </h3>
            
            <div className="space-y-4 font-body text-sm">
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-zinc-400">Atleta</span>
                <span className="text-white font-bold">{athlete.first_name} {athlete.last_name}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-zinc-400">Programa</span>
                <span className="text-white font-bold">{program.name}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/5 pb-2">
                <span className="text-zinc-400">Inscripción</span>
                <span className="text-white capitalize">{enrollment.status}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-zinc-400">Estado de Pago</span>
                {enrollment.payment_status === 'paid' ? (
                  <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded text-xs font-bold uppercase">Pagado</span>
                ) : (
                  <span className="px-2 py-1 bg-amber-500/10 text-amber-400 rounded text-xs font-bold uppercase">Pendiente</span>
                )}
              </div>
            </div>
          </div>

          {/* Coach Notes */}
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 shadow-xl">
            <h3 className="font-headline font-bold text-white uppercase tracking-wide mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-red-500">sticky_note_2</span>
              Notas del Coach
            </h3>
            
            {notes.length === 0 ? (
              <p className="text-zinc-500 font-body text-sm italic">No hay notas publicadas todavía.</p>
            ) : (
              <div className="space-y-4">
                {notes.map(n => (
                  <div key={n.id} className="bg-zinc-950 border border-white/5 p-4 rounded-xl relative">
                    <span className="material-symbols-outlined absolute top-2 right-2 text-zinc-800 text-4xl pointer-events-none">format_quote</span>
                    <p className="text-zinc-300 font-body text-sm relative z-10">"{n.note_text}"</p>
                    <p className="text-xs text-zinc-600 mt-2 font-label uppercase tracking-widest">{new Date(n.created_at).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Evidencias */}
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 shadow-xl">
            <h3 className="font-headline font-bold text-white uppercase tracking-wide mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-red-500">movie</span>
              Evidencia Multimedia
            </h3>
            
            {evidence.length === 0 ? (
              <p className="text-zinc-500 font-body text-sm italic">No hay enlaces o videos disponibles.</p>
            ) : (
              <div className="space-y-3">
                {evidence.map(e => (
                  <a key={e.id} href={e.url} target="_blank" rel="noopener noreferrer" className="block bg-zinc-950 hover:bg-zinc-800 border border-white/5 rounded-xl p-3 transition-colors flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-red-500/10 text-red-500 flex items-center justify-center flex-shrink-0">
                      <span className="material-symbols-outlined">play_arrow</span>
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-white font-headline font-bold text-sm truncate">{e.title}</p>
                      <p className="text-zinc-500 text-xs truncate">{e.url}</p>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Metrics & Scouting */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 shadow-xl h-full">
            <h3 className="font-headline font-black text-2xl text-white uppercase tracking-tight mb-6 flex items-center gap-3 border-b border-white/10 pb-4">
              <span className="material-symbols-outlined text-red-500 text-3xl">speed</span>
              Evaluación Física y Técnica
            </h3>
            
            {categories.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <span className="material-symbols-outlined text-6xl text-zinc-800 mb-4">analytics</span>
                <p className="text-zinc-400 font-body">Las métricas de evaluación estarán disponibles pronto.</p>
              </div>
            ) : (
              <div className="space-y-10">
                {categories.map(category => (
                  <div key={category.name} className="space-y-6">
                    <h4 className="text-xl font-bold text-red-500 uppercase tracking-widest border-b border-red-500/20 pb-2">
                      {category.name}
                    </h4>
                    <div className="grid gap-6">
                      {category.metrics.map(m => {
                        const isNumeric = m.input_type === 'number' || m.input_type === 'rating' || m.input_type === 'percentage';
                        const isBoolean = m.input_type === 'boolean';
                        
                        const renderValue = (res?: Result) => {
                          if (!res) return '--';
                          if (isNumeric && res.value_numeric != null) return res.value_numeric;
                          if (isBoolean && res.value_boolean != null) return res.value_boolean ? 'Sí' : 'No';
                          if (res.value_text != null) return res.value_text;
                          return '--';
                        };

                        let improvement = null;
                        let isBetter = false;

                        if (isNumeric) {
                          const initialVal = m.initial?.value_numeric;
                          const finalVal = m.final?.value_numeric;
                          if (initialVal != null && finalVal != null) {
                            const diff = finalVal - initialVal;
                            improvement = Math.abs(diff);
                            if (m.lower_is_better) {
                              isBetter = diff < 0; 
                            } else {
                              isBetter = diff > 0; 
                            }
                          }
                        }

                        return (
                          <div key={m.label} className="bg-zinc-950 rounded-xl p-5 border border-white/5 relative overflow-hidden">
                            <h4 className="font-headline font-bold text-lg text-white mb-4">{m.label}</h4>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div className="flex flex-col">
                                <span className="text-xs text-zinc-500 font-label uppercase tracking-widest mb-1">Inicial</span>
                                <span className="text-2xl font-black text-white">
                                  {renderValue(m.initial)}
                                  {m.unit && <span className="text-sm text-zinc-500 font-normal ml-1">{m.unit}</span>}
                                </span>
                              </div>
                              
                              <div className="flex flex-col">
                                <span className="text-xs text-zinc-500 font-label uppercase tracking-widest mb-1">Final</span>
                                <span className="text-2xl font-black text-white">
                                  {renderValue(m.final)}
                                  {m.unit && <span className="text-sm text-zinc-500 font-normal ml-1">{m.unit}</span>}
                                </span>
                              </div>

                              <div className="col-span-2 flex flex-col justify-center">
                                {isNumeric ? (
                                  improvement !== null && improvement !== 0 ? (
                                    <div className={`flex items-center gap-2 p-3 rounded-lg ${isBetter ? 'bg-emerald-500/10 text-emerald-400' : 'bg-zinc-800 text-zinc-400'}`}>
                                      <span className="material-symbols-outlined">
                                        {isBetter ? 'trending_up' : 'trending_flat'}
                                      </span>
                                      <div>
                                        <p className="font-bold font-headline text-sm uppercase tracking-wide">
                                          {isBetter ? 'Mejora' : 'Sin mejora notable'}
                                        </p>
                                        <p className="text-xs">
                                          Diferencia de {improvement.toFixed(2)} {m.unit}
                                        </p>
                                      </div>
                                    </div>
                                  ) : m.final && m.initial && improvement === 0 ? (
                                    <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-500/10 text-blue-400">
                                      <span className="material-symbols-outlined">drag_handle</span>
                                      <span className="font-bold font-headline text-sm uppercase tracking-wide">Mantenido</span>
                                    </div>
                                  ) : (
                                    <div className="flex items-center gap-2 p-3 rounded-lg border border-dashed border-white/10 text-zinc-500">
                                      <span className="material-symbols-outlined">pending</span>
                                      <span className="text-xs uppercase tracking-wide">Esperando evaluación final</span>
                                    </div>
                                  )
                                ) : (
                                  <div className="flex items-center gap-2 p-3 rounded-lg border border-white/5 bg-white/[0.02] text-zinc-400">
                                    <span className="material-symbols-outlined">notes</span>
                                    <span className="text-xs">Registro {isBoolean ? 'binario' : 'cualitativo'}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
