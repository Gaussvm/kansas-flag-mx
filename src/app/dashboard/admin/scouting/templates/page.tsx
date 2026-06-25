import { createClient } from "@/lib/supabase/server";
import { Plus, Settings, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function TemplatesPage() {
  const supabase = await createClient();
  
  const { data: templates, error } = await supabase
    .from("evaluation_templates")
    .select(`
      *,
      program:programs(name),
      location:locations(name)
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading templates:", error);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/admin/scouting">
            <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors h-10 w-10 border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800">
              <ArrowLeft className="h-5 w-5" />
            </button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-100">Plantillas de Evaluación</h1>
            <p className="text-slate-400">Gestiona las métricas para tryouts, combines y evaluaciones</p>
          </div>
        </div>
        <Link href="/dashboard/admin/scouting/templates/new">
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 bg-orange-500 text-white hover:bg-orange-600">
            <Plus className="mr-2 h-4 w-4" /> Nueva Plantilla
          </button>
        </Link>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-xl">
          <p className="font-bold mb-1">Error cargando plantillas:</p>
          <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(error, null, 2)}</pre>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {templates?.map((t) => (
          <div key={t.id} className="p-6 rounded-xl border border-slate-800 bg-slate-900/50 flex flex-col h-full">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg text-slate-200">{t.name}</h3>
                <span className="inline-flex items-center rounded-md bg-slate-800 px-2 py-1 text-xs font-medium text-slate-300 mt-2">
                  {t.type}
                </span>
              </div>
              <Link href={`/dashboard/admin/scouting/templates/${t.id}`}>
                <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors h-10 w-10 text-slate-400 hover:text-white hover:bg-slate-800">
                  <Settings className="h-5 w-5" />
                </button>
              </Link>
            </div>
            
            <p className="text-sm text-slate-400 flex-grow mb-4">
              {t.description || "Sin descripción"}
            </p>

            <div className="text-xs text-slate-500 space-y-1">
              {t.program && <div>Programa: <span className="text-slate-300">{t.program.name}</span></div>}
              {t.location && <div>Sede: <span className="text-slate-300">{t.location.name}</span></div>}
              <div className="pt-2 border-t border-slate-800 mt-2">
                Creado: {new Date(t.created_at).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
              </div>
            </div>
          </div>
        ))}
        
        {templates?.length === 0 && (
          <div className="col-span-full p-12 text-center border border-dashed border-slate-800 rounded-xl">
            <p className="text-slate-400 mb-4">No tienes plantillas creadas</p>
            <Link href="/dashboard/admin/scouting/templates/new">
              <button className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors h-10 px-4 py-2 border border-slate-700 bg-transparent hover:bg-slate-800 text-white">Crear primera plantilla</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
