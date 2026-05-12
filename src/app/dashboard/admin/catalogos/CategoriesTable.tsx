"use client";

import { useState } from "react";
import { createCategory, toggleCategoryStatus } from "./actions";

export default function CategoriesTable({ initialCategories }: { initialCategories: any[] }) {
  const [categories, setCategories] = useState(initialCategories);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await createCategory(formData);

    if (result.success) {
      setIsModalOpen(false);
      // Let Server Components handle revalidation via revalidatePath
      // But we can eagerly update or just reload:
      window.location.reload();
    } else {
      setError(result.error || "Error al crear");
    }
    setLoading(false);
  };

  const handleToggle = async (id: string, currentStatus: boolean) => {
    const result = await toggleCategoryStatus(id, !currentStatus);
    if (result.success) {
      setCategories(categories.map(c => c.id === id ? { ...c, is_active: !currentStatus } : c));
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="p-4 sm:p-6 border-b border-white/10 bg-[#151515] flex justify-end">
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#E31837] text-white rounded-xl font-headline font-bold text-sm uppercase tracking-wider hover:bg-red-700 transition-colors shadow-lg"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Nueva Categoría
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#1a1a1a] border-b border-white/5">
              <th className="p-4 text-xs font-bold text-zinc-500 uppercase tracking-widest whitespace-nowrap">Nombre</th>
              <th className="p-4 text-xs font-bold text-zinc-500 uppercase tracking-widest whitespace-nowrap">Descripción</th>
              <th className="p-4 text-xs font-bold text-zinc-500 uppercase tracking-widest whitespace-nowrap">Estado</th>
              <th className="p-4 text-xs font-bold text-zinc-500 uppercase tracking-widest whitespace-nowrap text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {categories.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-zinc-500 font-body">
                  No hay categorías registradas.
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="p-4">
                    <p className="font-headline font-bold text-white uppercase tracking-wider">{cat.name}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-sm text-zinc-400 font-body max-w-sm truncate">{cat.description || "--"}</p>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border ${
                      cat.is_active 
                        ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                        : 'bg-zinc-800 text-zinc-500 border-zinc-700'
                    }`}>
                      {cat.is_active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button 
                      onClick={() => handleToggle(cat.id, cat.is_active)}
                      className={`text-xs font-bold uppercase tracking-wider ${cat.is_active ? 'text-zinc-500 hover:text-red-400' : 'text-zinc-500 hover:text-green-400'} transition-colors`}
                    >
                      {cat.is_active ? 'Desactivar' : 'Activar'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Nueva Categoría */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#111] border border-white/10 rounded-3xl p-6 w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-headline font-black text-white uppercase tracking-wider mb-4">Crear Categoría</h3>
            
            {error && <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl">{error}</div>}

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Nombre de la Categoría</label>
                <input 
                  type="text" 
                  name="name" 
                  required
                  placeholder="Ej. Varonil Libre"
                  className="w-full bg-black border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E31837] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1.5">Descripción (Opcional)</label>
                <textarea 
                  name="description" 
                  rows={2}
                  placeholder="Ej. Torneo sabatino para mayores de 18..."
                  className="w-full bg-black border border-white/10 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E31837] transition-colors resize-none"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold uppercase tracking-wider text-sm transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  disabled={loading}
                  className="flex-1 py-3 bg-[#E31837] hover:bg-red-700 text-white rounded-xl font-bold uppercase tracking-wider text-sm transition-colors shadow-lg disabled:opacity-50"
                >
                  {loading ? 'Guardando...' : 'Guardar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
