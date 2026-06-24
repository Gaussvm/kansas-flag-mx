"use client";

import { useState } from "react";
import { addGuardianAction, removeGuardianAction, updateGuardianRelationshipAction } from "@/lib/actions/adminActions";

export default function GuardianManager({ athlete, parents, onClose }: { athlete: any, parents: any[], onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAdd = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const parentId = formData.get("parent_id") as string;
    const relationship = formData.get("relationship") as string;

    if (!parentId) {
      setError("Selecciona un tutor.");
      setLoading(false);
      return;
    }

    try {
      await addGuardianAction(athlete.id, parentId, relationship);
      // Wait for revalidation or just let it update
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (parentId: string) => {
    if (!confirm("¿Seguro que deseas remover a este tutor del atleta?")) return;
    setLoading(true);
    try {
      await removeGuardianAction(athlete.id, parentId);
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRelationshipChange = async (parentId: string, newRel: string) => {
    setLoading(true);
    try {
      await updateGuardianRelationshipAction(athlete.id, parentId, newRel);
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter parents to exclude those already linked
  const linkedGuardianIds = athlete.guardian_athletes.map((g: any) => g.guardian_id);
  const availableParents = parents.filter(p => !linkedGuardianIds.includes(p.id));

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-zinc-950 shrink-0">
          <div>
            <h3 className="font-headline font-bold text-white text-lg">Tutores de {athlete.first_name}</h3>
            <p className="text-xs text-zinc-500">Gestiona los accesos de familiares al portal.</p>
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

          {/* Linked Guardians */}
          <div className="space-y-3">
            <h4 className="text-sm font-label text-white uppercase tracking-widest border-b border-white/5 pb-2">Tutores Actuales</h4>
            {athlete.guardian_athletes.length === 0 ? (
              <p className="text-zinc-500 text-sm italic">Este atleta no tiene tutores vinculados.</p>
            ) : (
              <div className="space-y-2">
                {athlete.guardian_athletes.map((ga: any) => (
                  <div key={ga.guardian_id} className="bg-black border border-white/10 rounded-xl p-3 flex justify-between items-center">
                    <div>
                      <p className="text-sm text-white font-bold">{ga.profiles?.email}</p>
                      <p className="text-xs text-zinc-500">{ga.profiles?.first_name} {ga.profiles?.last_name}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <select 
                        value={ga.relationship || 'Tutor Legal'} 
                        onChange={(e) => handleRelationshipChange(ga.guardian_id, e.target.value)}
                        disabled={loading}
                        className="bg-zinc-900 border border-white/10 rounded p-1 text-xs text-zinc-300 focus:outline-none focus:border-red-500"
                      >
                        <option value="Padre">Padre</option>
                        <option value="Madre">Madre</option>
                        <option value="Tutor Legal">Tutor Legal</option>
                        <option value="Familiar">Familiar</option>
                      </select>
                      <button 
                        onClick={() => handleRemove(ga.guardian_id)}
                        disabled={loading}
                        className="text-zinc-500 hover:text-red-500 transition-colors disabled:opacity-50"
                        title="Remover Tutor"
                      >
                        <span className="material-symbols-outlined text-lg">person_remove</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add Guardian Form */}
          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4">
            <h4 className="text-sm font-label text-white uppercase tracking-widest mb-3">Vincular Nuevo Tutor</h4>
            <form onSubmit={handleAdd} className="space-y-3">
              <div>
                <select name="parent_id" required className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500 text-sm">
                  <option value="">-- Seleccionar de la lista --</option>
                  {availableParents.map(p => (
                    <option key={p.id} value={p.id}>{p.email} {p.first_name ? `(${p.first_name} ${p.last_name})` : ''}</option>
                  ))}
                </select>
              </div>
              <div className="flex gap-2">
                <select name="relationship" className="w-1/2 bg-black border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500 text-sm">
                  <option value="Padre">Padre</option>
                  <option value="Madre">Madre</option>
                  <option value="Tutor Legal">Tutor Legal</option>
                  <option value="Familiar">Familiar</option>
                </select>
                <button type="submit" disabled={loading || availableParents.length === 0} className="w-1/2 bg-white/10 hover:bg-white/20 disabled:opacity-50 text-white rounded-lg font-bold text-sm transition-colors flex justify-center items-center gap-2">
                  <span className="material-symbols-outlined text-sm">person_add</span>
                  Vincular
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
