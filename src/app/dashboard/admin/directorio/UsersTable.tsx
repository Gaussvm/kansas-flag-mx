"use client";

import { useState } from "react";
import { updateUserRole } from "./actions";

export default function UsersTable({ initialUsers }: { initialUsers: any[] }) {
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const filteredUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase();
    return (
      (u.first_name || "").toLowerCase().includes(term) ||
      (u.last_name || "").toLowerCase().includes(term) ||
      (u.nickname || "").toLowerCase().includes(term)
    );
  });

  const handleRoleChange = async (userId: string, newRole: string) => {
    setLoadingId(userId);
    const result = await updateUserRole(userId, newRole);
    if (result.success) {
      setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
    } else {
      alert(result.error);
    }
    setLoadingId(null);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="p-4 sm:p-6 border-b border-white/10 bg-[#151515] flex flex-col sm:flex-row gap-4 justify-between items-center">
        <div className="relative w-full max-w-md">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">search</span>
          <input
            type="text"
            placeholder="Buscar jugador por nombre o apodo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black border border-white/10 text-white rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-[#E31837] transition-colors"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#1a1a1a] border-b border-white/5">
              <th className="p-4 text-xs font-bold text-zinc-500 uppercase tracking-widest whitespace-nowrap">Jugador</th>
              <th className="p-4 text-xs font-bold text-zinc-500 uppercase tracking-widest whitespace-nowrap">Contacto</th>
              <th className="p-4 text-xs font-bold text-zinc-500 uppercase tracking-widest whitespace-nowrap text-center">Gafete</th>
              <th className="p-4 text-xs font-bold text-zinc-500 uppercase tracking-widest whitespace-nowrap">Rol</th>
              <th className="p-4 text-xs font-bold text-zinc-500 uppercase tracking-widest whitespace-nowrap text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-zinc-500 font-body">
                  No se encontraron usuarios.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => {
                const avatar = user.avatar_url || "https://ui-avatars.com/api/?name=" + (user.nickname || user.first_name || "J") + "&background=E31837&color=fff";
                const isUpdating = loadingId === user.id;

                return (
                  <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={avatar} alt="Avatar" className="w-10 h-10 rounded-full border border-white/10 object-cover" />
                        <div>
                          <p className="font-headline font-bold text-white uppercase text-sm leading-none mb-1">
                            {user.first_name} {user.last_name}
                          </p>
                          <p className="text-xs text-zinc-500 font-body">
                            {user.nickname ? `"${user.nickname}"` : "Sin apodo"} • Cat: {user.category || "N/A"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-zinc-300">{user.phone || "Sin teléfono"}</p>
                    </td>
                    <td className="p-4 text-center">
                      {user.player_number ? (
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-white font-headline font-bold text-sm border border-white/20">
                          {user.player_number}
                        </span>
                      ) : (
                        <span className="text-zinc-600 text-xs">--</span>
                      )}
                    </td>
                    <td className="p-4">
                      <div className="relative inline-block w-32">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          disabled={isUpdating}
                          className={`w-full appearance-none bg-black border rounded-lg px-3 py-1.5 text-xs font-bold uppercase tracking-wider focus:outline-none transition-colors ${
                            user.role === 'admin' 
                              ? 'border-[#E31837] text-[#E31837]' 
                              : user.role === 'staff'
                              ? 'border-blue-500 text-blue-500'
                              : 'border-zinc-700 text-zinc-400'
                          } ${isUpdating ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        >
                          <option value="player">Jugador</option>
                          <option value="staff">Staff</option>
                          <option value="admin">Admin</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-sm pointer-events-none opacity-50">
                          expand_more
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <button className="p-2 text-zinc-500 hover:text-white transition-colors rounded-lg hover:bg-white/10" title="Ver Detalles">
                        <span className="material-symbols-outlined text-[20px]">visibility</span>
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
