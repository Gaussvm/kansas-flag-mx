"use client";

import { useState } from "react";
import { createProgramAction } from "@/lib/actions/adminActions";

export default function ProgramForm({ locations }: { locations: any[] }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      type: formData.get("type") as string,
      start_date: formData.get("start_date") as string,
      end_date: formData.get("end_date") as string,
      location_id: formData.get("location_id") as string,
    };

    try {
      await createProgramAction(data);
      e.currentTarget.reset();
      // Optionally show success toast here
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-zinc-900 border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
      <h2 className="font-headline font-bold text-white uppercase text-xl mb-4">Nuevo Programa</h2>
      
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500 text-red-500 rounded text-sm">
          {error}
        </div>
      )}

      <div>
        <label className="block text-xs font-label text-zinc-500 uppercase mb-1">Nombre</label>
        <input name="name" required className="w-full bg-zinc-950 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500" placeholder="Ej. Summer Camp 2026" />
      </div>

      <div>
        <label className="block text-xs font-label text-zinc-500 uppercase mb-1">Tipo</label>
        <select name="type" required className="w-full bg-zinc-950 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500">
          <option value="summer_camp">Summer Camp</option>
          <option value="tournament">Torneo</option>
          <option value="clinic">Clínica</option>
          <option value="other">Otro</option>
        </select>
      </div>

      <div>
        <label className="block text-xs font-label text-zinc-500 uppercase mb-1">Sede</label>
        <select name="location_id" required defaultValue={locations?.length === 1 ? locations[0].id : ""} className="w-full bg-zinc-950 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[#E31837]">
          <option value="">-- Seleccionar sede --</option>
          {locations?.map(loc => (
            <option key={loc.id} value={loc.id}>{loc.name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-label text-zinc-500 uppercase mb-1">Inicio</label>
          <input name="start_date" type="date" required className="w-full bg-zinc-950 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500" />
        </div>
        <div>
          <label className="block text-xs font-label text-zinc-500 uppercase mb-1">Fin</label>
          <input name="end_date" type="date" required className="w-full bg-zinc-950 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500" />
        </div>
      </div>

      <button disabled={loading} className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white rounded-lg p-3 font-headline font-bold uppercase tracking-wider transition-colors">
        {loading ? "Creando..." : "Crear Programa"}
      </button>
    </form>
  );
}
