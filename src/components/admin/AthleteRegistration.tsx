"use client";

import { useState } from "react";
import { registerAthleteAndEnrollAction } from "@/lib/actions/adminActions";

interface Parent {
  id: string;
  email: string;
}

interface Program {
  id: string;
  name: string;
}

export default function AthleteRegistration({ parents, programs }: { parents: Parent[], programs: Program[] }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const data = {
      first_name: formData.get("first_name") as string,
      last_name: formData.get("last_name") as string,
      birth_date: formData.get("birth_date") as string,
      parent_id: formData.get("parent_id") as string,
      program_id: formData.get("program_id") as string,
      payment_status: formData.get("payment_status") as string,
    };

    try {
      await registerAthleteAndEnrollAction(data);
      e.currentTarget.reset();
      // Optionally show success
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-zinc-900 border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
      <h2 className="font-headline font-bold text-white uppercase text-xl mb-4 border-b border-white/10 pb-4">Registrar Nuevo Atleta</h2>
      
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500 text-red-500 rounded text-sm">
          {error}
        </div>
      )}

      {/* Step 1: Atleta */}
      <div className="space-y-4">
        <h3 className="text-sm font-label text-zinc-500 uppercase tracking-widest flex items-center gap-2">
          <span className="w-5 h-5 rounded bg-zinc-800 flex items-center justify-center text-xs">1</span>
          Datos del Atleta
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Nombre</label>
            <input name="first_name" required className="w-full bg-zinc-950 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500" placeholder="Ej. Liam" />
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Apellido</label>
            <input name="last_name" required className="w-full bg-zinc-950 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500" placeholder="Ej. Guzmán" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs text-zinc-400 mb-1">Fecha de Nacimiento</label>
            <input name="birth_date" type="date" required className="w-full bg-zinc-950 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500" />
          </div>
        </div>
      </div>

      {/* Step 2: Parent */}
      <div className="space-y-4 pt-4 border-t border-white/5">
        <h3 className="text-sm font-label text-zinc-500 uppercase tracking-widest flex items-center gap-2">
          <span className="w-5 h-5 rounded bg-zinc-800 flex items-center justify-center text-xs">2</span>
          Vincular Tutor (Papá/Mamá)
        </h3>
        
        {/* Opción A: Seleccionar */}
        <div>
          <label className="block text-xs text-zinc-400 mb-1">Seleccionar tutor existente</label>
          <select name="parent_id" className="w-full bg-zinc-950 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500">
            <option value="">-- Sin tutor por ahora --</option>
            {parents.map(p => (
              <option key={p.id} value={p.id}>{p.email}</option>
            ))}
          </select>
        </div>

        {/* Opción B: Visual Mockup */}
        <div className="mt-2 p-3 bg-zinc-950 border border-white/5 border-dashed rounded-lg opacity-50 pointer-events-none">
          <label className="block text-xs text-zinc-400 mb-1 flex justify-between">
            Invitar nuevo tutor por correo
            <span className="bg-red-500 text-white text-[10px] px-2 rounded uppercase font-bold">Próximamente</span>
          </label>
          <input disabled className="w-full bg-black border border-white/10 rounded-lg p-2 text-zinc-600" placeholder="correo@ejemplo.com" />
        </div>
      </div>

      {/* Step 3: Enrollment */}
      <div className="space-y-4 pt-4 border-t border-white/5">
        <h3 className="text-sm font-label text-zinc-500 uppercase tracking-widest flex items-center gap-2">
          <span className="w-5 h-5 rounded bg-zinc-800 flex items-center justify-center text-xs">3</span>
          Inscripción a Programa
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Programa</label>
            <select name="program_id" className="w-full bg-zinc-950 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500">
              <option value="">-- Sin inscribir por ahora --</option>
              {programs.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Estado de Pago</label>
            <select name="payment_status" className="w-full bg-zinc-950 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500">
              <option value="pending">Pendiente</option>
              <option value="paid">Pagado</option>
            </select>
          </div>
        </div>
      </div>

      <button disabled={loading} className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white rounded-lg p-4 font-headline font-bold uppercase tracking-wider transition-colors mt-6">
        {loading ? "Registrando..." : "Registrar e Inscribir Atleta"}
      </button>
    </form>
  );
}
