"use client";

import React, { useState } from "react";
import Link from "next/link";

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
  }
];

export default function InteractiveSedesSection() {
  const [activeCampusId, setActiveCampusId] = useState(campuses[0].id);
  const activeCampus = campuses.find((c) => c.id === activeCampusId) || campuses[0];

  return (
    <section className="py-24 bg-surface px-8">
      <div className="container mx-auto">
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          <div className="w-full lg:w-1/3">
            <h2 className="text-5xl font-headline font-black uppercase tracking-tighter mb-8 italic">
              Sedes y <br />
              <span className="text-primary">Horarios</span>
            </h2>
            <div className="space-y-6">
              {campuses.map((campus) => {
                const isActive = activeCampusId === campus.id;
                return (
                  <div
                    key={campus.id}
                    onClick={() => setActiveCampusId(campus.id)}
                    className={`p-6 bg-surface-container-high border-r-4 ${campus.borderColor} cursor-pointer transition-all duration-300 ${
                      isActive
                        ? "kinetic-shadow bg-white scale-100 opacity-100"
                        : "opacity-50 hover:opacity-100 hover:scale-[1.01]"
                    }`}
                  >
                    <h5 className="text-xl font-headline font-black uppercase italic mb-2">
                      {campus.name}
                    </h5>
                    <p className="text-on-surface-variant text-sm mb-4">
                      {campus.schedule}
                    </p>
                    <div className={`font-black uppercase text-xs flex items-center gap-2 ${isActive ? 'text-green-600' : 'text-primary'}`}>
                      {isActive ? "MOSTRANDO EN MAPA" : "VER EN MAPA"}{" "}
                      <span className="material-symbols-outlined text-sm">
                        {isActive ? "check_circle" : "location_on"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-8">
              <Link
                href="/sedes"
                className="block w-full bg-black text-white py-4 font-headline text-center font-bold uppercase tracking-widest text-sm hover:bg-primary transition-all"
              >
                Abrir Buscador Completo
              </Link>
            </div>
          </div>
          <div className="w-full lg:w-2/3 h-[500px] bg-zinc-200 relative overflow-hidden rounded-lg border-4 border-zinc-100 shadow-xl">
            <iframe
              key={activeCampus.id} 
              src={activeCampus.mapUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 transition-opacity duration-500 animate-in fade-in zoom-in-95"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}
