"use client";
import React, { useRef, useEffect } from "react";

const sedesData = [
  {
    title: "Sede Mimosa",
    img: "/images/sede-mimosa.png",
    address: "Kansas Flag Mexico, Módulo Deportivo Mimosa.",
    link: "https://maps.app.goo.gl/iStQpXvZmD2Cd2pdA"
  },
  {
    title: "Azcapotzalco",
    img: "/images/sede-azcapotzalco.png",
    address: "Kansas Flag Mexico, Francisco Sarabia, Azcapo.",
    link: "https://maps.app.goo.gl/Lw7ZvERPuE9vm6Ly6"
  },
  {
    title: "Metepec",
    img: "/images/sede-metepec.png",
    address: "Kansas Flag Metepec, Instalaciones Principales.",
    link: "https://maps.app.goo.gl/qHvc5eE2yTNoUiMc8"
  },
  {
    title: "Coacalco",
    img: "/images/sede-coacalco.png",
    address: "Kansas Flag Coacalco.",
    link: "https://maps.app.goo.gl/XnUAMu8En1Gk422s6"
  }
];

// Duplicamos el arreglo para asegurar el efecto infinito sin cortes
const doubledSedes = [...sedesData, ...sedesData];

export default function SedesMarquee() {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scroller = scrollRef.current;
    if (!scroller) return;

    let animationFrameId: number;
    let exactScrollLeft = 0;
    // Velocidad de desplazamiento elegante, equilibrada
    const scrollSpeed = 0.5;

    const scroll = () => {
      if (scroller) {
        exactScrollLeft += scrollSpeed;
        scroller.scrollLeft = exactScrollLeft;
        
        // Si ya scrolleamos la mitad del contenido (es decir, el primer set de tarjetas), reseteamos a 0
        if (scroller.scrollLeft >= scroller.scrollWidth / 2) {
          exactScrollLeft = 0;
          scroller.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="w-full relative overflow-hidden py-4 group">
      {/* Sombras de bordes para desvanecimiento elegante */}
      <div className="absolute left-0 top-0 bottom-0 w-8 md:w-32 bg-gradient-to-r from-surface-container-low to-transparent z-20 pointer-events-none"></div>
      <div className="absolute right-0 top-0 bottom-0 w-8 md:w-32 bg-gradient-to-l from-surface-container-low to-transparent z-20 pointer-events-none"></div>
      
      {/* Contenedor escrolleable */}
      <div 
        ref={scrollRef} 
        className="flex gap-8 overflow-hidden whitespace-nowrap pl-8 md:pl-32 pb-8 pt-4 items-stretch"
        style={{ scrollBehavior: 'auto' }}
        onMouseEnter={() => { if(scrollRef.current) scrollRef.current.style.pointerEvents = 'auto'; }}
      >
        {doubledSedes.map((sede, idx) => (
          <div 
            key={idx} 
            className="inline-flex min-w-[320px] md:min-w-[400px] w-[320px] md:w-[400px] whitespace-normal bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/10 hover:border-primary/50 transition-all flex-col shadow-lg shadow-zinc-200/50 hover:shadow-2xl hover:-translate-y-2 duration-300"
          >
            <div className="h-56 overflow-hidden relative bg-zinc-800 shrink-0 group/card">
              <img className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-700" alt={sede.title} src={sede.img} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute bottom-4 left-6">
                <h3 className="text-white text-2xl font-headline font-black uppercase tracking-tight">{sede.title}</h3>
              </div>
            </div>
            <div className="p-8 flex flex-col flex-grow justify-between">
              <div className="space-y-6 flex-grow">
                <div className="flex items-start gap-4">
                  <span className="material-symbols-outlined text-primary mt-1 shrink-0">pin_drop</span>
                  <p className="text-sm font-body font-medium text-on-surface-variant line-clamp-3">{sede.address}</p>
                </div>
              </div>

              <div className="mt-8">
                <a href={sede.link} target="_blank" rel="noopener noreferrer" className="w-full bg-secondary-container text-on-secondary-container py-4 font-headline font-black uppercase tracking-widest hover:brightness-95 transition-all flex items-center justify-center gap-2 rounded-md kinetic-shadow">
                  Cómo llegar
                  <span className="material-symbols-outlined">directions</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
