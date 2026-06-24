"use client";

import { useState } from "react";
import AthleteEditModal from "./AthleteEditModal";
import GuardianManager from "./GuardianManager";
import EnrollmentManager from "./EnrollmentManager";

export default function AthleteDirectory({ athletes, parents, programs, categories }: { athletes: any[], parents: any[], programs: any[], categories: any[] }) {
  const [editingAthlete, setEditingAthlete] = useState<any | null>(null);
  const [managingGuardiansFor, setManagingGuardiansFor] = useState<any | null>(null);
  const [managingEnrollmentsFor, setManagingEnrollmentsFor] = useState<any | null>(null);

  // Helper to calculate age dynamically
  const calculateAge = (birthDate: string) => {
    if (!birthDate) return "--";
    const today = new Date();
    const birth = new Date(birthDate.split('T')[0]); // Safe split
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  if (!athletes || athletes.length === 0) {
    return (
      <div className="bg-zinc-900 border border-white/10 rounded-2xl p-12 text-center shadow-xl">
        <span className="material-symbols-outlined text-4xl text-zinc-700 mb-2">group_off</span>
        <p className="text-zinc-500 font-body">No hay atletas registrados en el directorio.</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm font-body whitespace-nowrap">
            <thead className="bg-zinc-950 text-zinc-500 font-label uppercase tracking-wider text-xs border-b border-white/5">
              <tr>
                <th className="px-6 py-4">Atleta</th>
                <th className="px-6 py-4">Tutores</th>
                <th className="px-6 py-4">Inscripciones</th>
                <th className="px-6 py-4 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-zinc-300">
              {athletes.map(a => {
                const categoryName = categories?.find(c => c.id === a.category_id)?.name;
                
                return (
                  <tr key={a.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-white text-base">{a.first_name} {a.last_name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-zinc-500">{a.birth_date?.split('T')[0]} ({calculateAge(a.birth_date)} años)</span>
                        {categoryName && (
                          <span className="text-[10px] px-2 py-0.5 bg-white/5 text-zinc-400 rounded-full border border-white/10 uppercase tracking-wide">
                            {categoryName}
                          </span>
                        )}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      {a.guardian_athletes?.length > 0 ? (
                        <div className="space-y-2">
                          {a.guardian_athletes.map((ga: any, i: number) => (
                            <div key={i} className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-[14px] text-zinc-600">person</span>
                              <div className="flex flex-col">
                                <span className="text-xs font-bold text-white">{ga.profiles?.email}</span>
                                <span className="text-[10px] text-zinc-500 uppercase">{ga.relationship}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-xs px-2 py-1 bg-red-900/20 text-red-400 border border-red-900/30 rounded">Sin tutor</span>
                      )}
                    </td>
                    
                    <td className="px-6 py-4">
                      {a.enrollments?.length > 0 ? (
                        <div className="space-y-1">
                          {a.enrollments.map((e: any, i: number) => (
                            <div key={i} className={`flex items-center gap-2 ${e.status === 'cancelled' ? 'opacity-50 line-through' : ''}`}>
                              <span className={`w-2 h-2 rounded-full 
                                ${e.payment_status === 'paid' ? 'bg-emerald-500' : 
                                  e.payment_status === 'waived' ? 'bg-blue-500' :
                                  'bg-amber-500'}`} 
                                title={e.payment_status} 
                              />
                              <span className="truncate max-w-[150px] text-xs">{e.programs?.name}</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-zinc-600 italic text-xs">Ninguna</span>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => setEditingAthlete(a)}
                          className="p-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
                          title="Editar Perfil"
                        >
                          <span className="material-symbols-outlined text-sm">edit</span>
                        </button>
                        <button 
                          onClick={() => setManagingGuardiansFor(a)}
                          className="p-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
                          title="Gestionar Tutores"
                        >
                          <span className="material-symbols-outlined text-sm">family_restroom</span>
                        </button>
                        <button 
                          onClick={() => setManagingEnrollmentsFor(a)}
                          className="p-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg transition-colors"
                          title="Gestionar Inscripciones"
                        >
                          <span className="material-symbols-outlined text-sm">assignment</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {editingAthlete && (
        <AthleteEditModal 
          athlete={editingAthlete} 
          categories={categories} 
          onClose={() => setEditingAthlete(null)} 
        />
      )}

      {managingGuardiansFor && (
        <GuardianManager 
          athlete={managingGuardiansFor} 
          parents={parents} 
          onClose={() => setManagingGuardiansFor(null)} 
        />
      )}

      {managingEnrollmentsFor && (
        <EnrollmentManager 
          athlete={managingEnrollmentsFor} 
          programs={programs} 
          onClose={() => setManagingEnrollmentsFor(null)} 
        />
      )}
    </>
  );
}
