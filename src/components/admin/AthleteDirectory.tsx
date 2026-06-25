"use client";

import { useState } from "react";
import AthleteEditModal from "./AthleteEditModal";
import GuardianManager from "./GuardianManager";
import EnrollmentManager from "./EnrollmentManager";
import AthleteRegistration from "./AthleteRegistration";

export default function AthleteDirectory({ athletes, parents, programs, categories, locations, currentUserRole }: { athletes: any[], parents: any[], programs: any[], categories: any[], locations: any[], currentUserRole: string }) {
  const [editingAthlete, setEditingAthlete] = useState<any | null>(null);
  const [managingGuardiansFor, setManagingGuardiansFor] = useState<any | null>(null);
  const [managingEnrollmentsFor, setManagingEnrollmentsFor] = useState<any | null>(null);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

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

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h3 className="font-headline font-bold text-white uppercase tracking-wide">Directorio de Atletas</h3>
        <button 
          onClick={() => setShowRegistrationModal(true)}
          className="bg-[#E31837] hover:bg-red-600 text-white px-4 py-2 rounded-lg font-headline font-bold tracking-wider text-sm flex items-center gap-2 transition-colors"
        >
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          Agregar Atleta
        </button>
      </div>

      {(!athletes || athletes.length === 0) ? (
        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-12 text-center shadow-xl">
          <span className="material-symbols-outlined text-4xl text-zinc-700 mb-2">group_off</span>
          <p className="text-zinc-500 font-body">No hay atletas registrados en el directorio.</p>
        </div>
      ) : (
        <div className="bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm font-body whitespace-nowrap">
            <thead className="bg-zinc-950 text-zinc-500 font-label uppercase tracking-wider text-xs border-b border-white/5">
              <tr>
                <th className="px-6 py-4">Atleta</th>
                <th className="px-6 py-4">Tutores</th>
                <th className="px-6 py-4">Sede</th>
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
                      {a.locations ? (
                        <span className="text-xs font-bold text-white bg-white/5 px-2 py-1 rounded border border-white/10 uppercase tracking-wide">
                          {a.locations.name}
                        </span>
                      ) : (
                        <span className="text-xs px-2 py-1 bg-red-900/20 text-red-400 border border-red-900/30 rounded">Sin sede</span>
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
      )}

      {/* Modals */}
      {editingAthlete && athletes.find(a => a.id === editingAthlete.id) && (
        <AthleteEditModal 
          athlete={athletes.find(a => a.id === editingAthlete.id)} 
          categories={categories} 
          locations={locations}
          onClose={() => setEditingAthlete(null)} 
        />
      )}

      {managingGuardiansFor && athletes.find(a => a.id === managingGuardiansFor.id) && (
        <GuardianManager 
          athlete={athletes.find(a => a.id === managingGuardiansFor.id)} 
          parents={parents} 
          onClose={() => setManagingGuardiansFor(null)} 
        />
      )}

      {managingEnrollmentsFor && athletes.find(a => a.id === managingEnrollmentsFor.id) && (
        <EnrollmentManager 
          athlete={athletes.find(a => a.id === managingEnrollmentsFor.id)} 
          programs={programs} 
          onClose={() => setManagingEnrollmentsFor(null)} 
        />
      )}

      {showRegistrationModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-4xl my-8">
            <button 
              onClick={() => setShowRegistrationModal(false)}
              className="absolute -top-4 -right-4 sm:-top-6 sm:-right-6 w-10 h-10 bg-zinc-800 hover:bg-red-600 text-white rounded-full flex items-center justify-center transition-colors z-10 border border-white/10 shadow-xl"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
            <div className="max-h-[85vh] overflow-y-auto rounded-2xl no-scrollbar">
              <AthleteRegistration 
                parents={parents} 
                programs={programs} 
                categories={categories} 
                locations={locations}
                currentUserRole={currentUserRole}
                onSuccess={() => setShowRegistrationModal(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
