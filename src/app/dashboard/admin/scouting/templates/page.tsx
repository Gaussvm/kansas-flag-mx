import { createClient } from "@/lib/supabase/server";
import { Plus, Settings } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { es } from "date-fns/locale";

export default async function TemplatesPage() {
  const supabase = await createClient();
  
  const { data: templates } = await supabase
    .from("evaluation_templates")
    .select(`
      *,
      program:programs(name),
      location:locations(name)
    `)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-100">Plantillas de Evaluación</h1>
          <p className="text-slate-400">Gestiona las métricas para tryouts, combines y evaluaciones</p>
        </div>
        <Link href="/dashboard/admin/scouting/templates/new">
          <Button className="bg-orange-500 hover:bg-orange-600">
            <Plus className="mr-2 h-4 w-4" /> Nueva Plantilla
          </Button>
        </Link>
      </div>

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
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                  <Settings className="h-5 w-5" />
                </Button>
              </Link>
            </div>
            
            <p className="text-sm text-slate-400 flex-grow mb-4">
              {t.description || "Sin descripción"}
            </p>

            <div className="text-xs text-slate-500 space-y-1">
              {t.program && <div>Programa: <span className="text-slate-300">{t.program.name}</span></div>}
              {t.location && <div>Sede: <span className="text-slate-300">{t.location.name}</span></div>}
              <div className="pt-2 border-t border-slate-800 mt-2">
                Creado: {format(new Date(t.created_at), "d MMM yyyy", { locale: es })}
              </div>
            </div>
          </div>
        ))}
        
        {templates?.length === 0 && (
          <div className="col-span-full p-12 text-center border border-dashed border-slate-800 rounded-xl">
            <p className="text-slate-400 mb-4">No tienes plantillas creadas</p>
            <Link href="/dashboard/admin/scouting/templates/new">
              <Button variant="outline" className="border-slate-700">Crear primera plantilla</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
