"use client";

import { useState } from "react";
import { updateProfile } from "./actions";

export default function ProfileForm({ profile }: { profile: any }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await updateProfile(formData);

    if (result?.error) {
      setError(result.error);
    } else {
      setMessage("¡Perfil actualizado con éxito!");
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {message && (
        <div className="p-4 bg-green-500/20 text-green-700 dark:text-green-400 border border-green-500/50 rounded-xl font-body text-sm text-center">
          {message}
        </div>
      )}
      {error && (
        <div className="p-4 bg-red-500/20 text-red-700 dark:text-red-400 border border-red-500/50 rounded-xl font-body text-sm text-center">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Nombre</label>
          <input
            type="text"
            name="first_name"
            defaultValue={profile.first_name || ""}
            className="w-full px-4 py-3 bg-surface border border-outline rounded-xl focus:outline-none focus:border-primary text-on-surface transition-all"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Apellido</label>
          <input
            type="text"
            name="last_name"
            defaultValue={profile.last_name || ""}
            className="w-full px-4 py-3 bg-surface border border-outline rounded-xl focus:outline-none focus:border-primary text-on-surface transition-all"
            required
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Apodo (Para el gafete)</label>
          <input
            type="text"
            name="nickname"
            defaultValue={profile.nickname || ""}
            className="w-full px-4 py-3 bg-surface border border-outline rounded-xl focus:outline-none focus:border-primary text-on-surface transition-all"
            placeholder="Ej. El Tanque"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Número de Jugador</label>
          <input
            type="text"
            name="player_number"
            defaultValue={profile.player_number || ""}
            className="w-full px-4 py-3 bg-surface border border-outline rounded-xl focus:outline-none focus:border-primary text-on-surface transition-all"
            placeholder="Ej. 10"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Altura</label>
          <input
            type="text"
            name="height"
            defaultValue={profile.height || ""}
            className="w-full px-4 py-3 bg-surface border border-outline rounded-xl focus:outline-none focus:border-primary text-on-surface transition-all"
            placeholder="Ej. 1.80m"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Categoría</label>
          <select
            name="category"
            defaultValue={profile.category || ""}
            className="w-full px-4 py-3 bg-surface border border-outline rounded-xl focus:outline-none focus:border-primary text-on-surface transition-all"
          >
            <option value="">Selecciona...</option>
            <option value="Varonil">Varonil</option>
            <option value="Femenil">Femenil</option>
            <option value="Mixto">Mixto</option>
            <option value="Infantil">Infantil</option>
            <option value="Staff">Staff</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-on-surface-variant uppercase tracking-wider mb-1.5">Frase de Jugador</label>
        <textarea
          name="quote"
          defaultValue={profile.quote || ""}
          rows={2}
          className="w-full px-4 py-3 bg-surface border border-outline rounded-xl focus:outline-none focus:border-primary text-on-surface transition-all resize-none"
          placeholder="Ej. El límite es el cielo..."
        ></textarea>
      </div>

      <div className="pt-4 border-t border-outline-variant">
        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto px-8 py-4 bg-primary text-on-primary rounded-xl font-headline font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-md disabled:opacity-50"
        >
          {loading ? "Guardando..." : "Guardar Perfil"}
        </button>
      </div>
    </form>
  );
}
