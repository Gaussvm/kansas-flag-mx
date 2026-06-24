import Link from "next/link";

interface Program {
  id: string;
  name: string;
  type: string;
  start_date: string;
  end_date: string;
}

interface Enrollment {
  id: string;
  status: string;
  payment_status: string;
  programs: Program | null;
}

interface Athlete {
  id: string;
  first_name: string;
  last_name: string;
  birth_date: string;
  enrollments: Enrollment[];
}

export default function AthleteCard({ athlete }: { athlete: Athlete }) {
  // We'll show the active programs. If there are multiple, we'll list them.
  const activeEnrollments = athlete.enrollments?.filter(e => e.status !== 'cancelled') || [];

  return (
    <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row gap-6 shadow-xl relative overflow-hidden group">
      {/* Subtle Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-red-500/0 to-red-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      {/* Athlete Avatar */}
      <div className="flex-shrink-0 flex justify-center md:justify-start">
        <div className="w-24 h-24 rounded-full bg-zinc-800 border-2 border-zinc-700 flex items-center justify-center shadow-inner overflow-hidden">
          <span className="material-symbols-outlined text-4xl text-zinc-600">person</span>
        </div>
      </div>

      {/* Athlete Info */}
      <div className="flex-grow flex flex-col">
        <h2 className="text-2xl font-headline font-black text-white uppercase tracking-tight">
          {athlete.first_name} {athlete.last_name}
        </h2>
        
        {/* Programs List */}
        <div className="mt-4 flex-grow">
          <h3 className="text-xs font-label font-bold text-zinc-500 uppercase tracking-widest mb-2">Programas Inscritos</h3>
          
          {activeEnrollments.length === 0 ? (
            <p className="text-sm text-zinc-400 font-body">Sin programas activos.</p>
          ) : (
            <div className="space-y-3">
              {activeEnrollments.map((enrollment) => (
                <div key={enrollment.id} className="bg-zinc-950 border border-white/5 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h4 className="font-headline font-bold text-white">{enrollment.programs?.name}</h4>
                    <span className="text-xs text-zinc-400 capitalize">{enrollment.programs?.type.replace('_', ' ')}</span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {/* Payment Badge */}
                    {enrollment.payment_status === 'paid' ? (
                      <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">check_circle</span>
                        Pagado
                      </span>
                    ) : enrollment.payment_status === 'pending' ? (
                      <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1">
                        <span className="material-symbols-outlined text-sm">schedule</span>
                        Pendiente
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-zinc-800 text-zinc-400 border border-zinc-700 rounded-full text-xs font-bold uppercase tracking-wide">
                        {enrollment.payment_status}
                      </span>
                    )}

                    {/* Action Button */}
                    <Link
                      href={`/dashboard/parent/${athlete.id}/program/${enrollment.programs?.id}`}
                      className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-headline font-bold text-sm transition-colors flex items-center gap-1 shadow-lg shadow-red-900/20"
                    >
                      Ver Boletín
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </Link>
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
