"use client";

import { useState } from "react";
import { uploadReceiptAction, getReceiptSignedUrlAction } from "@/lib/actions/paymentActions";

export default function PaymentUploader({ enrollmentId, paymentStatus, receipts }: { enrollmentId: string, paymentStatus: string, receipts: any[] }) {
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('enrollment_id', enrollmentId);
      await uploadReceiptAction(formData);
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
      e.target.value = '';
    }
  };

  const viewReceipt = async (filePath: string) => {
    try {
      const { signedUrl } = await getReceiptSignedUrlAction(filePath);
      window.open(signedUrl, '_blank');
    } catch (err: any) {
      alert("Error: " + err.message);
    }
  };

  return (
    <div className="w-full mt-3 border-t border-white/5 pt-3">
      <div className="flex justify-between items-center mb-2">
        <h5 className="text-[10px] font-label text-zinc-500 uppercase tracking-widest">Comprobantes de Pago</h5>
        {paymentStatus !== 'paid' && paymentStatus !== 'waived' && (
           <label className={`cursor-pointer bg-red-600/20 hover:bg-red-600 border border-red-500/50 hover:border-red-500 text-red-100 px-3 py-1 rounded-full text-xs font-bold transition-colors ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
             {loading ? 'Subiendo...' : 'Subir Comprobante'}
             <input type="file" className="hidden" accept="image/jpeg, image/png, image/webp, application/pdf" onChange={handleUpload} disabled={loading} />
           </label>
        )}
      </div>

      {receipts && receipts.length > 0 ? (
         <div className="space-y-1.5">
           {receipts.map(receipt => (
              <div key={receipt.id} className="flex items-center justify-between bg-zinc-950 p-2 rounded-lg text-xs border border-white/5">
                <div className="flex flex-col">
                  <span className="text-zinc-300 truncate max-w-[150px]">{receipt.file_name}</span>
                  <span className="text-[10px] text-zinc-600">{new Date(receipt.created_at).toLocaleDateString()}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider
                    ${receipt.status === 'approved' ? 'bg-emerald-900/30 text-emerald-400' :
                      receipt.status === 'rejected' ? 'bg-red-900/30 text-red-400' :
                      'bg-amber-900/30 text-amber-400'}`}>
                    {receipt.status === 'pending_review' ? 'En Revisión' : receipt.status === 'approved' ? 'Aprobado' : 'Rechazado'}
                  </span>
                  <button onClick={() => viewReceipt(receipt.file_path)} className="text-blue-400 hover:text-blue-300 font-bold text-xs transition-colors">Ver</button>
                </div>
              </div>
           ))}
         </div>
      ) : (
         <p className="text-xs text-zinc-600 italic bg-black/20 p-2 rounded">No has subido comprobantes aún.</p>
      )}
    </div>
  );
}
