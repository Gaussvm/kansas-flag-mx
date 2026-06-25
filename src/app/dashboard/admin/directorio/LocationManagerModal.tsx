"use client";

import { useState } from "react";
import { assignLocationAction, removeLocationAction, setPrimaryLocationAction } from "@/lib/actions/adminActions";

export default function LocationManagerModal({
  user,
  locations,
  onClose,
  onUpdate
}: {
  user: any;
  locations: any[];
  onClose: () => void;
  onUpdate: (updatedProfileLocations: any[]) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocationId, setSelectedLocationId] = useState("");

  const currentLocations = user.profile_locations || [];
  const availableLocations = locations.filter(loc => !currentLocations.find((pl: any) => pl.location_id === loc.id));

  const handleAssign = async () => {
    if (!selectedLocationId) return;
    setLoading(true);
    setError(null);
    try {
      const isPrimary = currentLocations.length === 0;
      await assignLocationAction(user.id, selectedLocationId, isPrimary);
      
      const addedLocation = locations.find(l => l.id === selectedLocationId);
      const updated = [...currentLocations, { location_id: selectedLocationId, is_primary: isPrimary, locations: { name: addedLocation?.name } }];
      onUpdate(updated);
      setSelectedLocationId("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (locationId: string, isPrimary: boolean) => {
    if (isPrimary && currentLocations.length > 1) {
      setError("No puedes quitar la sede primaria. Primero asigna otra sede como primaria.");
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      await removeLocationAction(user.id, locationId);
      const updated = currentLocations.filter((pl: any) => pl.location_id !== locationId);
      onUpdate(updated);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSetPrimary = async (locationId: string) => {
    setLoading(true);
    setError(null);
    try {
      await setPrimaryLocationAction(user.id, locationId);
      const updated = currentLocations.map((pl: any) => ({
        ...pl,
        is_primary: pl.location_id === locationId
      }));
      onUpdate(updated);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 sm:p-6 border-b border-white/10 flex justify-between items-center bg-[#151515]">
          <div>
            <h3 className="font-headline font-bold text-xl text-white uppercase tracking-wider">
              Gestionar Sedes
            </h3>
            <p className="text-zinc-400 text-sm mt-1">
              Usuario: <span className="text-white">{user.first_name} {user.last_name}</span>
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="p-4 sm:p-6 flex-1 overflow-y-auto space-y-6">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500 text-red-500 rounded text-sm">
              {error}
            </div>
          )}

          <div>
            <h4 className="text-sm font-label text-zinc-500 uppercase tracking-widest mb-3">Sedes Actuales</h4>
            {currentLocations.length === 0 ? (
              <p className="text-sm text-zinc-500 italic">No tiene sedes asignadas.</p>
            ) : (
              <div className="space-y-2">
                {currentLocations.map((pl: any) => (
                  <div key={pl.location_id} className={`flex items-center justify-between p-3 rounded-lg border ${pl.is_primary ? 'border-[#E31837]/30 bg-[#E31837]/5' : 'border-white/10 bg-black'}`}>
                    <div>
                      <p className={`font-bold text-sm ${pl.is_primary ? 'text-[#E31837]' : 'text-white'}`}>
                        {pl.locations?.name}
                      </p>
                      {pl.is_primary && <p className="text-[10px] uppercase text-[#E31837] tracking-wider mt-0.5 font-bold">Sede Primaria</p>}
                    </div>
                    <div className="flex gap-2">
                      {!pl.is_primary && (
                        <button 
                          onClick={() => handleSetPrimary(pl.location_id)}
                          disabled={loading}
                          className="text-xs bg-white/5 hover:bg-white/10 text-white px-2 py-1 rounded transition-colors disabled:opacity-50"
                        >
                          Hacer Primaria
                        </button>
                      )}
                      <button 
                        onClick={() => handleRemove(pl.location_id, pl.is_primary)}
                        disabled={loading}
                        className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-500 px-2 py-1 rounded transition-colors disabled:opacity-50"
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-white/10">
            <h4 className="text-sm font-label text-zinc-500 uppercase tracking-widest mb-3">Asignar Nueva Sede</h4>
            <div className="flex gap-2">
              <select
                value={selectedLocationId}
                onChange={(e) => setSelectedLocationId(e.target.value)}
                disabled={loading || availableLocations.length === 0}
                className="flex-1 bg-black border border-white/10 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#E31837] disabled:opacity-50"
              >
                <option value="">Selecciona una sede...</option>
                {availableLocations.map(loc => (
                  <option key={loc.id} value={loc.id}>{loc.name}</option>
                ))}
              </select>
              <button 
                onClick={handleAssign}
                disabled={loading || !selectedLocationId}
                className="bg-[#E31837] hover:bg-[#C1102A] text-white px-4 py-2 rounded-lg font-bold uppercase text-xs tracking-wider transition-colors disabled:opacity-50"
              >
                {loading ? 'Asignando...' : 'Asignar'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
