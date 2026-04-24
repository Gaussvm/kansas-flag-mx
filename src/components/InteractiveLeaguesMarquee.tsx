"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export interface LeagueGalleryData {
  name: string;
  logoUrl: string;
  photos: string[];
}

export default function InteractiveLeaguesMarquee({ leagues }: { leagues: LeagueGalleryData[] }) {
  const [selectedLeague, setSelectedLeague] = useState<LeagueGalleryData | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fallback default logos if missing or failed to map
  const defaultLogos: Record<string, string> = {
    "FMFA": "/logos/Liga 6.png",
    "World Championships": "/logos/Liga 1.png",
    "FADEMAC": "/logos/Liga 5.png",
    "LMTI": "/logos/Liga 2.png",
    "LNT": "/logos/Liga 3.png",
    "The Best AFFEMEX": "/logos/Liga 4.png"
  };

  // Fallbacks if Google Sheets isn't populated or mapped properly yet
  const displayLeagues = leagues && leagues.length > 0 ? [...leagues, ...leagues, ...leagues, ...leagues] : [];

  // Disable body scroll when modal open
  useEffect(() => {
    if (selectedLeague) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => { document.body.style.overflow = "auto"; };
  }, [selectedLeague]);

  if (!displayLeagues.length) return null;

  return (
    <>
      <section className="bg-white py-4 overflow-hidden relative z-20 shadow-2xl border-y-4 border-zinc-100">
        <div className="flex animate-slide-infinite w-max hover:[animation-play-state:paused]">
          {displayLeagues.map((league, i) => (
            <div 
              key={`${league.name}-${i}`} 
              className="flex gap-32 sm:gap-48 items-center px-16 sm:px-24 group cursor-pointer"
              onClick={() => setSelectedLeague(league)}
            >
              <div className="relative">
                <img 
                  src={league.logoUrl || defaultLogos[league.name] || "/images/logo.png"} 
                  alt={league.name} 
                  className="h-20 md:h-24 w-auto object-contain group-hover:scale-110 group-hover:drop-shadow-xl transition-all duration-300 cursor-pointer" 
                />
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] bg-zinc-900 text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider whitespace-nowrap">Ver Fotos</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pop-up Gallery Modal */}
      {selectedLeague && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/90 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setSelectedLeague(null)}
          ></div>
          
          <div className="relative bg-zinc-900 border border-zinc-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl flex flex-col animate-in zoom-in-95 duration-300">
            {/* Close Button */}
            <button 
              onClick={() => setSelectedLeague(null)}
              className="absolute top-4 right-4 md:top-6 md:right-6 bg-zinc-800 hover:bg-zinc-700 text-white p-2 rounded-full transition-colors z-[100] shadow-lg"
            >
              <span className="material-symbols-outlined">close</span>
            </button>

            {/* Header */}
            <div className="flex flex-col items-center justify-center pt-10 pb-6 px-6 bg-zinc-950/80 border-b border-zinc-800 sticky top-0 z-50">
              <div className="bg-white p-4 rounded-2xl shadow-xl mb-4">
                <img 
                  src={selectedLeague.logoUrl || defaultLogos[selectedLeague.name] || "/images/logo.png"} 
                  alt={selectedLeague.name} 
                  className="h-16 md:h-24 w-auto object-contain" 
                />
              </div>
              <h3 className="text-2xl md:text-3xl font-headline font-black uppercase text-white tracking-widest text-center">
                {selectedLeague.name}
              </h3>
            </div>

            {/* Grid 3x3 */}
            <div className="p-6 md:p-8 bg-zinc-900">
              {selectedLeague.photos.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                  {selectedLeague.photos.map((photo, i) => (
                    <div key={i} className="aspect-square bg-zinc-800 rounded-xl overflow-hidden group relative shadow-inner">
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity z-10 pointer-events-none"></div>
                      <img 
                        src={photo} 
                        alt={`${selectedLeague.name} galería ${i}`} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-20 flex flex-col items-center justify-center text-zinc-500 bg-zinc-800/20 rounded-2xl border-2 border-dashed border-zinc-800">
                   <span className="material-symbols-outlined text-5xl md:text-7xl mb-4 opacity-50">imagesmode</span>
                   <p className="font-body italic md:text-xl text-center px-4">Esta liga aún no cuenta con fotografías en galería.</p>
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
