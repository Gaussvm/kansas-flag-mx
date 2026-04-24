"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export default function ZoomableTournamentImage({ src, alt }: { src: string, alt: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => { document.body.style.overflow = "auto"; };
  }, [isOpen]);

  return (
    <>
      <div 
         className="w-full h-56 bg-gradient-to-br from-[#E31837]/90 via-zinc-950 to-[#FFB81C]/50 overflow-hidden relative z-0 cursor-pointer group flex items-center justify-center border-b border-zinc-800"
         onClick={() => setIsOpen(true)}
      >
         <img 
            src={src} 
            alt={alt} 
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700" 
         />
         <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent pointer-events-none"></div>
         <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg flex items-center justify-center">
            <span className="material-symbols-outlined text-white text-sm">zoom_in</span>
         </div>
      </div>

      {isOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/95 backdrop-blur-md cursor-zoom-out animate-in fade-in duration-200"
            onClick={() => setIsOpen(false)}
          ></div>
          <button 
             onClick={() => setIsOpen(false)}
             className="absolute top-4 right-4 md:top-6 md:right-6 bg-zinc-800/80 hover:bg-zinc-700 text-white p-2 rounded-full transition-colors z-[100] shadow-2xl backdrop-blur-md"
          >
             <span className="material-symbols-outlined">close</span>
          </button>
          <img 
            src={src} 
            alt={alt} 
            className="relative z-10 max-w-full max-h-[90vh] object-contain shadow-2xl rounded-lg animate-in zoom-in-95 duration-200" 
          />
        </div>,
        document.body
      )}
    </>
  );
}
