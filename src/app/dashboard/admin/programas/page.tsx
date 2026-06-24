import { createClient } from "@/lib/supabase/server";
import ProgramForm from "@/components/admin/ProgramForm";

export default async function ProgramasPage() {
  const supabase = await createClient();
  
  const { data: programs } = await supabase
    .from("programs")
    .select("*")
    .order("start_date", { ascending: false });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-headline font-black text-white uppercase tracking-tight">Gestión de Programas</h2>
        <p className="text-zinc-400 font-body text-sm mt-1">Crea campamentos, clínicas y torneos activos.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <ProgramForm />
        </div>

        <div className="lg:col-span-2 space-y-4">
          <h3 className="font-headline font-bold text-white uppercase tracking-wide">Programas Existentes</h3>
          {(!programs || programs.length === 0) ? (
            <p className="text-zinc-500 font-body text-sm">No hay programas creados.</p>
          ) : (
            <div className="space-y-3">
              {programs.map(p => (
                <div key={p.id} className="bg-zinc-900 border border-white/5 rounded-xl p-4 flex justify-between items-center">
                  <div>
                    <h4 className="font-headline font-bold text-white text-lg">{p.name}</h4>
                    <span className="text-xs text-zinc-500 uppercase tracking-widest capitalize">{p.type.replace('_', ' ')}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-zinc-400">{new Date(p.start_date).toLocaleDateString()} - {new Date(p.end_date).toLocaleDateString()}</p>
                    <span className={`text-xs uppercase font-bold tracking-wide ${p.status === 'active' ? 'text-emerald-500' : 'text-zinc-600'}`}>
                      {p.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
