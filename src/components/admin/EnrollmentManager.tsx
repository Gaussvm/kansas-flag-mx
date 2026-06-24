"use client";

import { useState } from "react";
import { addEnrollmentAction, manageEnrollmentAction } from "@/lib/actions/adminActions";
import { uploadReceiptAction, approveReceiptAction, rejectReceiptAction, getReceiptSignedUrlAction } from "@/lib/actions/paymentActions";

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

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, enrollmentId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('enrollment_id', enrollmentId);
      
      await uploadReceiptAction(formData);
    } catch (err: any) {
      alert("Error al subir: " + err.message);
    } finally {
      setLoading(false);
      e.target.value = ''; // clear input
    }
  };

  const viewReceipt = async (filePath: string) => {
    try {
      const { signedUrl } = await getReceiptSignedUrlAction(filePath);
      window.open(signedUrl, '_blank');
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleApprove = async (receiptId: string, isPartial: boolean) => {
    const msg = isPartial 
      ? "¿Aprobar comprobante como PAGO PARCIAL? La inscripción quedará como 'Pagado Parcial'."
      : "¿Aprobar comprobante como PAGO TOTAL? La inscripción pasará a 'Pagado'.";
    if(!confirm(msg)) return;
    setLoading(true);
    try {
      await approveReceiptAction(receiptId, isPartial, "Aprobado por admin");
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (receiptId: string) => {
    const notes = prompt("Razón del rechazo:");
    if (notes === null) return;
    
    setLoading(true);
    try {
      await rejectReceiptAction(receiptId, notes || "Rechazado por admin");
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
      <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
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
                        <option value="enrolled">Activo</option>
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
                            enrollment.payment_status === 'partial' ? 'bg-purple-900/30 border-purple-500/30 text-purple-400' :
                            enrollment.payment_status === 'pending' ? 'bg-amber-900/30 border-amber-500/30 text-amber-400' :
                            enrollment.payment_status === 'waived' ? 'bg-blue-900/30 border-blue-500/30 text-blue-400' :
                            'bg-zinc-900 border-white/10 text-zinc-400'
                          }
                        `}
                      >
                        <option value="pending">Pago Pendiente</option>
                        <option value="partial">Pagado Parcial</option>
                        <option value="paid">Pagado Total</option>
                        <option value="waived">Becado / Exento</option>
                        <option value="refunded">Reembolsado</option>
                      </select>
                    </div>
                    
                    {/* Comprobantes de Pago */}
                    <div className="w-full mt-4 border-t border-white/5 pt-4">
                      <div className="flex justify-between items-center mb-3">
                        <h5 className="text-xs font-label text-zinc-400 uppercase tracking-widest">Comprobantes de Pago</h5>
                        <label className={`cursor-pointer text-xs bg-zinc-800 hover:bg-zinc-700 text-white px-3 py-1.5 rounded transition-colors ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
                          <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">upload</span> Subir manual</span>
                          <input type="file" className="hidden" accept="image/jpeg, image/png, image/webp, application/pdf" onChange={(e) => handleUpload(e, enrollment.id)} disabled={loading} />
                        </label>
                      </div>
                      
                      {enrollment.payment_receipts && enrollment.payment_receipts.length > 0 ? (
                        <div className="space-y-2">
                          {enrollment.payment_receipts.map((receipt: any) => (
                            <div key={receipt.id} className="flex flex-col md:flex-row md:items-center justify-between bg-zinc-950 p-3 rounded-lg border border-white/5 gap-3">
                              <div className="flex flex-col">
                                <span className="text-white font-medium text-xs truncate max-w-[250px] md:max-w-[350px] lg:max-w-[450px]">{receipt.file_name}</span>
                                <span className="text-zinc-500 text-[10px] mt-0.5">
                                  {new Date(receipt.created_at).toLocaleDateString()} • Subido por: {receipt.profiles?.first_name || 'Desconocido'}
                                </span>
                                {receipt.admin_notes && (
                                  <span className="text-red-400/80 text-[10px] italic mt-1">Nota: {receipt.admin_notes}</span>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider
                                  ${receipt.status === 'approved' ? 'bg-emerald-900/30 text-emerald-400' :
                                    receipt.status === 'rejected' ? 'bg-red-900/30 text-red-400' :
                                    'bg-amber-900/30 text-amber-400'}`}>
                                  {receipt.status === 'pending_review' ? 'PENDIENTE' : receipt.status === 'approved' ? 'APROBADO' : 'RECHAZADO'}
                                </span>
                                
                                <button onClick={() => viewReceipt(receipt.file_path)} className="text-blue-400 hover:text-blue-300 text-xs font-bold transition-colors">Ver</button>
                                
                                {receipt.status === 'pending_review' && (
                                  <div className="flex items-center gap-2 border-l border-white/10 pl-3 ml-1">
                                    <button onClick={() => handleApprove(receipt.id, false)} disabled={loading} className="text-emerald-500 hover:text-emerald-400 disabled:opacity-50 transition-colors flex items-center gap-0.5 text-[10px] font-bold" title="Aprobar Total">
                                      <span className="material-symbols-outlined text-[16px]">check_circle</span> TOTAL
                                    </button>
                                    <button onClick={() => handleApprove(receipt.id, true)} disabled={loading} className="text-purple-500 hover:text-purple-400 disabled:opacity-50 transition-colors flex items-center gap-0.5 text-[10px] font-bold" title="Aprobar Parcial">
                                      <span className="material-symbols-outlined text-[16px]">monetization_on</span> PARCIAL
                                    </button>
                                    <button onClick={() => handleReject(receipt.id)} disabled={loading} className="text-red-500 hover:text-red-400 disabled:opacity-50 transition-colors flex items-center gap-0.5 text-[10px] font-bold ml-1" title="Rechazar">
                                      <span className="material-symbols-outlined text-[16px]">cancel</span>
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-xs text-zinc-600 italic bg-zinc-950 p-3 rounded border border-white/5">No hay comprobantes cargados.</p>
                      )}
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
