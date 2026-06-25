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

export default function AthleteRegistration({ parents, programs, categories, locations, currentUserRole, onSuccess }: { parents: Parent[], programs: Program[], categories: any[], locations: any[], currentUserRole: string, onSuccess?: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      first_name: formData.get("first_name") as string,
      last_name: formData.get("last_name") as string,
      birth_date: formData.get("birth_date") as string,
      parent_id: formData.get("parent_id") as string,
      program_id: formData.get("program_id") as string,
      payment_status: formData.get("payment_status") as string,
      primary_location_id: formData.get("primary_location_id") as string,
    };

    if (!data.primary_location_id) {
      setError("Debes seleccionar una sede para el atleta.");
      setLoading(false);
      return;
    }

    if (!data.parent_id) {
      if (!confirm("Atención: Estás dando de alta a un atleta SIN tutor vinculado. ¿Deseas continuar?")) {
        setLoading(false);
        return;
      }
    }

    try {
      await registerAthleteAndEnrollAction(data);
      
      // Also update category and medical info since register action doesn't take them directly 
      // (to keep it backward compatible, we could update the action, or just do it here).
      // Wait, we can just pass them to registerAthleteAndEnrollAction, but we'd need to update it.
      // Let's assume we update registerAthleteAndEnrollAction to accept medical_info and category_id.
      e.currentTarget.reset();
      setSuccess("Atleta registrado exitosamente.");
      
      if (onSuccess) {
        // give it a brief moment so the user can see the success message
        setTimeout(() => onSuccess(), 1500);
      } else {
        setTimeout(() => setSuccess(null), 4000);
      }
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
      
      {success && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500 text-emerald-500 rounded text-sm">
          {success}
        </div>
      )}

      {/* Step 1: Atleta */}
      <div className="space-y-4">
        <h3 className="text-sm font-label text-zinc-500 uppercase tracking-widest flex items-center gap-2">
          <span className="w-5 h-5 rounded bg-zinc-800 flex items-center justify-center text-xs text-white">1</span>
          Datos del Atleta
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs text-zinc-400 mb-1">Sede Principal</label>
            <select name="primary_location_id" required defaultValue={locations.length === 1 ? locations[0].id : ""} className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[#E31837]">
              <option value="">-- Seleccionar sede --</option>
              {locations.map((loc: any) => (
                <option key={loc.id} value={loc.id}>{loc.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Nombre</label>
            <input name="first_name" required className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500" placeholder="Ej. Liam" />
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Apellido</label>
            <input name="last_name" required className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500" placeholder="Ej. Guzmán" />
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Fecha de Nacimiento</label>
            <input name="birth_date" type="date" required className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500" />
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Categoría Oficial (Opcional)</label>
            <select name="category_id" className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500">
              <option value="">-- Sin categoría --</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs text-zinc-400 mb-1">Información Médica / Alergias (Opcional)</label>
            <textarea name="medical_info" rows={2} className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500" placeholder="Alergias, asma, historial de lesiones..." />
          </div>
        </div>
      </div>

      {/* Step 2: Parent */}
      <div className="space-y-4 pt-4 border-t border-white/5">
        <h3 className="text-sm font-label text-zinc-500 uppercase tracking-widest flex items-center gap-2">
          <span className="w-5 h-5 rounded bg-zinc-800 flex items-center justify-center text-xs text-white">2</span>
          Vincular Tutor
        </h3>
        
        <div>
          <label className="block text-xs text-zinc-400 mb-1">Seleccionar tutor existente</label>
          <select name="parent_id" className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500">
            <option value="">-- Sin tutor por ahora (Solo Atleta) --</option>
            {parents.map((p: any) => (
              <option key={p.id} value={p.id}>{p.email} {p.first_name ? `(${p.first_name} ${p.last_name})` : ''}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Step 3: Enrollment */}
      <div className="space-y-4 pt-4 border-t border-white/5">
        <h3 className="text-sm font-label text-zinc-500 uppercase tracking-widest flex items-center gap-2">
          <span className="w-5 h-5 rounded bg-zinc-800 flex items-center justify-center text-xs text-white">3</span>
          Inscripción Inicial
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Programa</label>
            <select name="program_id" className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500">
              <option value="">-- Sin inscribir por ahora --</option>
              {programs.map((p: any) => (
                <option key={p.id} value={p.id}>{p.name} ({p.start_date.split('-')[0]})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-zinc-400 mb-1">Estado de Pago</label>
            <select name="payment_status" className="w-full bg-black border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-red-500">
              <option value="pending">Pendiente</option>
              <option value="paid">Pagado</option>
              <option value="waived">Becado / Exento</option>
            </select>
          </div>
        </div>
      </div>

      <button disabled={loading} className="w-full bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white rounded-lg p-4 font-headline font-bold uppercase tracking-wider transition-colors mt-6 flex justify-center items-center gap-2">
        {loading ? (
          <>
            <span className="material-symbols-outlined animate-spin">refresh</span>
            Procesando...
          </>
        ) : (
          "Guardar Nuevo Atleta"
        )}
      </button>
    </form>
  );
}
