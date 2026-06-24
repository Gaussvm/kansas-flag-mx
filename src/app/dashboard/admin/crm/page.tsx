import { createClient } from "@/lib/supabase/server";
import AthleteRegistration from "@/components/admin/AthleteRegistration";

export default async function CRMPage() {
  const supabase = await createClient();

  // Get active programs
  const { data: programs } = await supabase
    .from("programs")
    .select("id, name")
    .eq("status", "active")
    .order("start_date", { ascending: false });

  // Get parents with their emails from profiles table
  const { data: parents } = await supabase
    .from("profiles")
    .select("id, email")
    .eq("role", "parent")
    .order("email", { ascending: true });

  // Get all athletes with their guardian and enrollment info for the table
  const { data: athletes } = await supabase
    .from("athletes")
    .select(`
      *,
      guardian_athletes (
        profiles ( email )
      ),
      enrollments (
        payment_status,
        programs ( name )
      )
    `)
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-headline font-black text-white uppercase tracking-tight">Familias y CRM</h2>
        <p className="text-zinc-400 font-body text-sm mt-1">Alta de atletas, asignación de tutores e inscripciones.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-1">
          <AthleteRegistration parents={parents || []} programs={programs || []} />
        </div>

        <div className="xl:col-span-2 space-y-4">
          <h3 className="font-headline font-bold text-white uppercase tracking-wide">Directorio de Atletas</h3>
          
          <div className="bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm font-body">
                <thead className="bg-zinc-950 text-zinc-500 font-label uppercase tracking-wider text-xs border-b border-white/5">
                  <tr>
                    <th className="px-6 py-4">Atleta</th>
                    <th className="px-6 py-4">Tutor (Email)</th>
                    <th className="px-6 py-4">Inscripciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-zinc-300">
                  {(!athletes || athletes.length === 0) ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-zinc-500">No hay atletas registrados.</td>
                    </tr>
                  ) : (
                    athletes.map(a => (
                      <tr key={a.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-bold text-white">{a.first_name} {a.last_name}</p>
                          <p className="text-xs text-zinc-500">{new Date(a.birth_date).toLocaleDateString()}</p>
                        </td>
                        <td className="px-6 py-4">
                          {a.guardian_athletes?.length > 0 ? (
                            a.guardian_athletes.map((ga: any, i: number) => (
                              <div key={i} className="text-sm truncate max-w-[150px]" title={ga.profiles?.email}>
                                {ga.profiles?.email}
                              </div>
                            ))
                          ) : (
                            <span className="text-zinc-600 italic">Sin tutor</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {a.enrollments?.length > 0 ? (
                            <div className="space-y-1">
                              {a.enrollments.map((e: any, i: number) => (
                                <div key={i} className="flex items-center gap-2">
                                  <span className="truncate max-w-[120px] text-xs">{e.programs?.name}</span>
                                  <span className={`w-2 h-2 rounded-full ${e.payment_status === 'paid' ? 'bg-emerald-500' : 'bg-amber-500'}`} title={e.payment_status} />
                                </div>
                              ))}
                            </div>
                          ) : (
                            <span className="text-zinc-600 italic">Ninguna</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
