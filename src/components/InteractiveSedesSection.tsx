"use client";

import React, { useState } from "react";

const campuses = [
  {
    id: "sede-mimosa",
    name: "Sede Mimosa",
    schedule: "Kansas Flag Mexico (Módulo Deportivo)",
    mapUrl: "https://maps.google.com/maps?q=Kansas+Flag+Mexico+Modulo+Deportivo+Mimosa&hl=es&z=15&output=embed",
    borderColor: "border-primary",
  },
  {
    id: "sede-azcapotzalco",
    name: "Sede Azcapotzalco",
    schedule: "Kansas Flag Mexico (Francisco Sarabia)",
    mapUrl: "https://maps.google.com/maps?q=Kansas+Flag+Mexico+Francisco+Sarabia+Azcapotzalco&hl=es&z=15&output=embed",
    borderColor: "border-secondary-container",
  },
  {
    id: "sede-metepec",
    name: "Sede Metepec",
    schedule: "Kansas Flag Metepec",
    mapUrl: "https://maps.google.com/maps?q=Kansas+flag+Metepec&hl=es&z=15&output=embed",
    borderColor: "border-primary",
  },
  {
    id: "sede-coacalco",
    name: "Sede Coacalco",
    schedule: "Kansas Flag Coacalco",
    mapUrl: "https://maps.google.com/maps?q=Ex-campo+jaguares+coacalco&hl=es&z=15&output=embed",
    borderColor: "border-secondary-container",
  }
];

export default function InteractiveSedesSection() {
  const [activeCampusId, setActiveCampusId] = useState(campuses[0].id);
  const activeCampus = campuses.find((c) => c.id === activeCampusId) || campuses[0];

  return (
    <section className="bg-surface relative overflow-hidden">
      <div className="pt-12 pb-8 px-8 container mx-auto relative z-10">
        <h2 className="text-4xl lg:text-5xl font-headline font-black uppercase tracking-tighter mb-6 italic text-center lg:text-left">
          Sedes y <span className="text-primary">Horarios</span>
        </h2>
        
        {/* Mapa Panorámico */}
        <div className="w-full h-[250px] lg:h-[300px] bg-zinc-200 relative overflow-hidden rounded-xl border-4 border-zinc-100 shadow-[0_10px_30px_rgba(0,0,0,0.1)] mb-6">
          <iframe
            key={activeCampus.id} 
            src={activeCampus.mapUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 transition-opacity duration-500 animate-in fade-in zoom-in-95 bg-white"
          ></iframe>
        </div>

        {/* Tarjetas Selectoras (Grid Horizontal) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {campuses.map((campus) => {
            const isActive = activeCampusId === campus.id;
            return (
              <div
                key={campus.id}
                onClick={() => setActiveCampusId(campus.id)}
                className={`
                  cursor-pointer transition-all duration-300 relative
                  flex flex-col justify-between
                  rounded-xl p-4 lg:p-6
                  border-b-4 ${campus.borderColor}
                  ${
                  isActive
                    ? "bg-white text-zinc-900 shadow-[0_10px_30px_rgba(0,0,0,0.1)] scale-100 ring-2 ring-zinc-200"
                    : "bg-surface-container-high text-zinc-400 shadow-sm opacity-70 hover:opacity-100 hover:scale-[1.02] hover:bg-white"
                  }
                `}
              >
                <div>
                  <h5 className={`text-sm lg:text-lg font-headline font-black uppercase italic mb-1 ${isActive ? 'text-zinc-900' : 'text-zinc-500'}`}>
                    {campus.name}
                  </h5>
                  {isActive && (
                    <p className="text-zinc-500 text-xs hidden lg:block mb-4 animate-in fade-in duration-300">
                      {campus.schedule}
                    </p>
                  )}
                </div>
                
                <div className={`font-black uppercase text-[10px] lg:text-xs flex items-center gap-1.5 mt-4 ${isActive ? 'text-green-600' : 'text-primary'}`}>
                  {isActive ? "MOSTRANDO" : "VER MAPA"}{" "}
                  <span className="material-symbols-outlined text-xs lg:text-base">
                    {isActive ? "check_circle" : "location_on"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cinta de Construcción Amarilla */}
      <div 
        className="w-full py-4 text-black font-black uppercase font-headline tracking-[0.2em] relative overflow-hidden flex whitespace-nowrap shadow-[0_0_20px_rgba(255,184,28,0.4)]"
        style={{ 
            background: 'repeating-linear-gradient(-45deg, #FFB81C, #FFB81C 40px, #1a1a1a 40px, #1a1a1a 80px)',
            borderTop: '4px solid #FFB81C',
            borderBottom: '4px solid #FFB81C'
        }}
      >
        <div className="absolute inset-0 bg-[#FFB81C]/90"></div>
        <div className="animate-slide-reverse-infinite flex gap-12 relative z-10 w-max hover:[animation-play-state:paused]">
          {[...Array(12)].map((_, i) => (
             <span key={i} className="flex items-center gap-4 text-lg drop-shadow-md">
                 <span className="material-symbols-outlined text-2xl">construction</span>
                 🚧 PRÓXIMAMENTE TIJUANA, QUERÉTARO Y PLAYA DEL CARMEN 🚧
             </span>
          ))}
        </div>
      </div>
    </section>
  );
}
