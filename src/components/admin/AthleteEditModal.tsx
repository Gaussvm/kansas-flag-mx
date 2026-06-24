"use client";

import { useState } from "react";
import { updateAthleteAction } from "@/lib/actions/adminActions";

export default function AthleteEditModal({ athlete, categories, onClose }: { athlete: any, categories: any[], onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const data = {
      first_name: formData.get("first_name") as string,
      last_name: formData.get("last_name") as string,
      birth_date: formData.get("birth_date") as string,
      medical_info: formData.get("medical_info") as string,
      category_id: formData.get("category_id") as string || null,
    };

    try {
      await updateAthleteAction(athlete.id, data);
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden">
        <div className="p-4 border-b border-white/5 flex justify-between items-center bg-zinc-950">
          <h3 className="font-headline font-bold text-white text-lg">Editar Atleta</h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500 text-red-500 rounded text-sm mb-4">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-label text-zinc-500 uppercase mb-1">Nombre</label>
              <input name="first_name" defaultValue={athlete.first_name} required className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500" />
            </div>
            <div>
              <label className="block text-xs font-label text-zinc-500 uppercase mb-1">Apellido</label>
              <input name="last_name" defaultValue={athlete.last_name} required className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-label text-zinc-500 uppercase mb-1">Fecha de Nacimiento</label>
              <input name="birth_date" type="date" defaultValue={athlete.birth_date?.split('T')[0]} required className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500" />
            </div>
            <div>
              <label className="block text-xs font-label text-zinc-500 uppercase mb-1">Categoría Oficial</label>
              <select name="category_id" defaultValue={athlete.category_id || ""} className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500">
                <option value="">-- Sin categoría --</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-label text-zinc-500 uppercase mb-1">Información Médica / Alergias</label>
            <textarea name="medical_info" defaultValue={athlete.medical_info || ""} rows={3} className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500" placeholder="Alergias, asma, lesiones previas..." />
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-zinc-400 hover:text-white rounded-lg font-bold text-sm transition-colors">
              Cancelar
            </button>
            <button type="submit" disabled={loading} className="px-6 py-2 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white rounded-lg font-headline font-bold text-sm tracking-wider transition-colors">
              {loading ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
