"use client";

import { useState } from "react";
import { addEnrollmentAction, manageEnrollmentAction } from "@/lib/actions/adminActions";

export default function EnrollmentManager({ athlete, programs, onClose }: { athlete: any, programs: any[], onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEnroll = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const programId = formData.get("program_id") as string;
    const paymentStatus = formData.get("payment_status") as string;

    if (!programId) {
      setError("Selecciona un programa válido.");
      setLoading(false);
      return;
    }

    try {
      await addEnrollmentAction(athlete.id, programId, paymentStatus);
      e.currentTarget.reset();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (enrollmentId: string, newStatus: string, newPaymentStatus: string) => {
    setLoading(true);
    try {
      await manageEnrollmentAction(enrollmentId, newStatus, newPaymentStatus, null);
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter programs to exclude those already enrolled (regardless of status, to prevent PK collision)
  const enrolledProgramIds = athlete.enrollments.map((e: any) => e.program_id || e.programs?.id); // Depends on how data is fetched
  const availablePrograms = programs.filter(p => !enrolledProgramIds.includes(p.id));

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-zinc-950 shrink-0">
          <div>
            <h3 className="font-headline font-bold text-white text-lg">Inscripciones de {athlete.first_name}</h3>
            <p className="text-xs text-zinc-500">Gestiona los programas y pagos del atleta.</p>
          </div>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto space-y-6">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500 text-red-500 rounded text-sm">
              {error}
            </div>
          )}

          {/* Current Enrollments */}
          <div className="space-y-3">
            <h4 className="text-sm font-label text-white uppercase tracking-widest border-b border-white/5 pb-2">Programas Inscritos</h4>
            {athlete.enrollments.length === 0 ? (
              <p className="text-zinc-500 text-sm italic">El atleta no está inscrito en ningún programa.</p>
            ) : (
              <div className="space-y-3">
                {athlete.enrollments.map((enrollment: any) => (
                  <div key={enrollment.id} className={`bg-black border border-white/10 rounded-xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${enrollment.status === 'cancelled' ? 'opacity-50' : ''}`}>
                    <div className="w-full md:w-auto">
                      <p className="text-sm text-white font-bold">{enrollment.programs?.name}</p>
                      <span className="text-xs text-zinc-500">Estado: {enrollment.status}</span>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                      {/* Estado General */}
                      <select 
                        value={enrollment.status} 
                        onChange={(e) => handleUpdate(enrollment.id, e.target.value, enrollment.payment_status)}
                        disabled={loading}
                        className="bg-zinc-900 border border-white/10 rounded p-2 text-xs text-zinc-300 focus:outline-none focus:border-red-500"
                      >
                        <option value="active">Activo</option>
                        <option value="waitlisted">Lista de Espera</option>
                        <option value="cancelled">Cancelado (Baja)</option>
                      </select>

                      {/* Estado de Pago */}
                      <select 
                        value={enrollment.payment_status} 
                        onChange={(e) => handleUpdate(enrollment.id, enrollment.status, e.target.value)}
                        disabled={loading}
                        className={`border rounded p-2 text-xs focus:outline-none focus:border-red-500 font-bold
                          ${enrollment.payment_status === 'paid' ? 'bg-emerald-900/30 border-emerald-500/30 text-emerald-400' :
                            enrollment.payment_status === 'pending' ? 'bg-amber-900/30 border-amber-500/30 text-amber-400' :
                            enrollment.payment_status === 'waived' ? 'bg-blue-900/30 border-blue-500/30 text-blue-400' :
                            'bg-zinc-900 border-white/10 text-zinc-400'
                          }
                        `}
                      >
                        <option value="pending">Pago Pendiente</option>
                        <option value="paid">Pagado</option>
                        <option value="waived">Becado / Exento</option>
                        <option value="refunded">Reembolsado</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Enrollment Form */}
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
            <h4 className="text-sm font-label text-white uppercase tracking-widest mb-3">Inscribir a nuevo programa</h4>
            <form onSubmit={handleEnroll} className="space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <select name="program_id" required className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500 text-sm">
                  <option value="">-- Seleccionar Programa --</option>
                  {availablePrograms.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
                
                <div className="flex gap-2">
                  <select name="payment_status" className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500 text-sm">
                    <option value="pending">Pago Pendiente</option>
                    <option value="paid">Pagado</option>
                    <option value="waived">Becado / Exento</option>
                  </select>
                  <button type="submit" disabled={loading || availablePrograms.length === 0} className="w-auto px-4 bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white rounded-lg font-bold text-sm transition-colors flex justify-center items-center gap-2">
                    <span className="material-symbols-outlined text-sm">add_circle</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
