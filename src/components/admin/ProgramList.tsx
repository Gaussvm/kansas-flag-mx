"use client";

import { useState } from "react";
import { updateProgramAction, updateProgramStatusAction } from "@/lib/actions/adminActions";

export default function ProgramList({ programs, locations, currentUserRole }: { programs: any[], locations: any[], currentUserRole: string }) {
  const [editingProgram, setEditingProgram] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusLoading, setStatusLoading] = useState<string | null>(null); // program id
  const [error, setError] = useState<string | null>(null);

  // Parse YYYY-MM-DD reliably without timezone shifts
  const formatLocalDate = (dateStr: string) => {
    if (!dateStr) return "";
    const parts = dateStr.split('T')[0].split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateStr;
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      type: formData.get("type") as string,
      status: formData.get("status") as string,
      start_date: formData.get("start_date") as string,
      end_date: formData.get("end_date") as string,
      location_id: formData.get("location_id") as string,
    };

    try {
      await updateProgramAction(editingProgram.id, data);
      setEditingProgram(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    setStatusLoading(id);
    try {
      await updateProgramStatusAction(id, newStatus);
    } catch (err: any) {
      alert("Error: " + err.message);
    } finally {
      setStatusLoading(null);
    }
  };

  return (
    <>
      <div className="space-y-3">
        {programs.map(p => (
          <div key={p.id} className={`bg-zinc-900 border border-white/5 rounded-xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${p.status === 'archived' ? 'opacity-60' : ''}`}>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h4 className="font-headline font-bold text-white text-lg">{p.name}</h4>
                <span className={`text-[10px] px-2 py-0.5 rounded-full uppercase font-bold tracking-wide 
                  ${p.status === 'active' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 
                    p.status === 'archived' ? 'bg-zinc-800 text-zinc-400 border border-zinc-700' :
                    p.status === 'completed' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                    'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}
                >
                  {p.status}
                </span>
              </div>
              <div className="flex gap-2 mt-1">
                <span className="text-xs text-zinc-500 uppercase tracking-widest capitalize">{p.type.replace('_', ' ')}</span>
                {p.locations && (
                  <>
                    <span className="text-xs text-zinc-600">•</span>
                    <span className="text-xs text-zinc-400 uppercase tracking-widest font-bold">{p.locations.name}</span>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex flex-col sm:items-end w-full sm:w-auto gap-3">
              <p className="text-sm text-zinc-400 whitespace-nowrap">
                {formatLocalDate(p.start_date)} - {formatLocalDate(p.end_date)}
              </p>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => setEditingProgram(p)}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-xs font-bold transition-colors flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px]">edit</span>
                  Editar
                </button>
                
                {p.status === 'archived' ? (
                  <button 
                    disabled={statusLoading === p.id}
                    onClick={() => handleStatusChange(p.id, 'active')}
                    className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-500 border border-emerald-600/30 rounded text-xs font-bold transition-colors flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[14px]">unarchive</span>
                    Reactivar
                  </button>
                ) : (
                  <button 
                    disabled={statusLoading === p.id}
                    onClick={() => handleStatusChange(p.id, 'archived')}
                    className="px-3 py-1.5 bg-red-900/30 hover:bg-red-900/60 text-red-400 border border-red-900/50 rounded text-xs font-bold transition-colors flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-[14px]">archive</span>
                    Archivar
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {editingProgram && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
            <div className="p-4 border-b border-white/5 flex justify-between items-center">
              <h3 className="font-headline font-bold text-white text-lg">Editar Programa</h3>
              <button onClick={() => setEditingProgram(null)} className="text-zinc-500 hover:text-white">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500 text-red-500 rounded text-sm mb-4">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-label text-zinc-500 uppercase mb-1">Nombre</label>
                <input name="name" defaultValue={editingProgram.name} required className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-label text-zinc-500 uppercase mb-1">Tipo</label>
                  <select name="type" defaultValue={editingProgram.type} required className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500">
                    <option value="summer_camp">Summer Camp</option>
                    <option value="tournament">Torneo</option>
                    <option value="clinic">Clínica</option>
                    <option value="other">Otro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-label text-zinc-500 uppercase mb-1">Estado</label>
                  <select name="status" defaultValue={editingProgram.status} required className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500">
                    <option value="draft">Draft</option>
                    <option value="active">Activo</option>
                    <option value="completed">Completado</option>
                    <option value="archived">Archivado</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-label text-zinc-500 uppercase mb-1">Inicio</label>
                  <input name="start_date" defaultValue={editingProgram.start_date.split('T')[0]} type="date" required className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500" />
                </div>
                <div>
                  <label className="block text-xs font-label text-zinc-500 uppercase mb-1">Fin</label>
                  <input name="end_date" defaultValue={editingProgram.end_date.split('T')[0]} type="date" required className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[#E31837]" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-label text-zinc-500 uppercase mb-1">Sede</label>
                <select name="location_id" defaultValue={editingProgram.location_id || ""} required className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[#E31837]">
                  <option value="">-- Seleccionar sede --</option>
                  {locations?.map(loc => (
                    <option key={loc.id} value={loc.id}>{loc.name}</option>
                  ))}
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button type="button" onClick={() => setEditingProgram(null)} className="px-4 py-2 text-zinc-400 hover:text-white rounded-lg font-bold text-sm transition-colors">
                  Cancelar
                </button>
                <button type="submit" disabled={loading} className="px-6 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white rounded-lg font-headline font-bold text-sm tracking-wider transition-colors">
                  {loading ? "Guardando..." : "Guardar Cambios"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
