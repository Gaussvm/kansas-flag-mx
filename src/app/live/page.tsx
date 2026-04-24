import Link from "next/link";


async function getLiveStreams() {
  const url = process.env.NEXT_PUBLIC_LIVE_STREAM_CSV_URL || "https://docs.google.com/spreadsheets/d/e/2PACX-1vRdmRpRwWCNTcE2KuOrE_1g1SDg9KloXQFWiMyXmhJ2YWLZ73Z_5F39XyBXZNr9sGF-R30cAn5a8zGi/pub?output=csv";
  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error("Error fetching");
    const text = await res.text();
    
    if (text.includes('<html') || text.includes('<!DOCTYPE') || text.includes('function(')) {
      throw new Error("El formato del documento no es CSV válido.");
    }

    const lines = text.split('\n').filter(line => line.trim().length > 0);
    const streams = lines.slice(1).map(line => {
      const parts = line.split(',');
      return {
        equipo: parts[0]?.replace(/"/g, '').trim() || '',
        linkEnvivo: parts.slice(1).join(',').replace(/"/g, '').trim()
      };
    });
    
    return streams.filter(s => s.equipo || s.linkEnvivo);
  } catch (error) {
    console.error("No se pudieron cargar las transmisiones", error);
    return [];
  }
}

function getEmbedUrl(url: string) {
  if (!url) return '';
  const lowerUrl = url.toLowerCase();
  
  if (lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be')) {
    let videoId = '';
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split(/[?#]/)[0];
    } else if (url.includes('v=')) {
      videoId = url.split('v=')[1]?.split('&')[0];
    } else if (url.includes('live/')) {
      videoId = url.split('live/')[1]?.split(/[?#]/)[0];
    } else if (url.includes('embed/')) {
      videoId = url.split('embed/')[1]?.split(/[?#]/)[0];
    }
    
    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
  }
  
  if (lowerUrl.includes('facebook.com') || lowerUrl.includes('fb.watch')) {
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(url)}&show_text=false&width=auto`;
  }
  
  return '';
}

export default async function LiveMatch() {
  const streams = await getLiveStreams();
  const liveUrl = streams.find(m => m.linkEnvivo && (
    m.linkEnvivo.toLowerCase().includes('facebook') || 
    m.linkEnvivo.toLowerCase().includes('fb.watch') ||
    m.linkEnvivo.toLowerCase().includes('youtube') ||
    m.linkEnvivo.toLowerCase().includes('youtu.be')
  ))?.linkEnvivo || "";

  const embedUrl = getEmbedUrl(liveUrl);

  return (
    <>
      <section className="relative min-h-screen bg-black pt-32 pb-24 overflow-hidden -mt-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute w-full h-[50%] bg-gradient-to-b from-primary/20 to-transparent top-0"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,black_100%)] opacity-80 pointer-events-none"></div>
        </div>

        <div className="container mx-auto px-4 md:px-8 relative z-10 flex flex-col items-center">
          
          <div className="text-center mb-10 w-full max-w-5xl flex flex-col items-center">
            <div className="flex items-center gap-3 bg-red-600/20 border border-red-500/50 px-5 py-2 rounded-full mb-6 relative overflow-hidden group">
              <span className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]"></span>
              <span className="w-3 h-3 bg-red-600 rounded-full animate-pulse shadow-[0_0_15px_rgba(220,38,38,0.8)]"></span>
              <span className="text-red-500 font-headline font-black uppercase tracking-widest text-sm relative z-10">Transmisión en Vivo</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-headline font-black text-white uppercase italic tracking-tighter mb-4 text-center">
              KANSAS FLAG <span className="text-primary">ARENA</span>
            </h1>
            <p className="text-zinc-400 font-body max-w-2xl mx-auto text-center">
              Sigue nuestras transmisiones en tiempo real: Football flag
            </p>
          </div>

          <div className="w-full max-w-6xl aspect-video bg-zinc-900 rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(227,24,55,0.15)] border-4 border-zinc-800 relative flex items-center justify-center">
            
            <iframe
              width="100%"
              height="100%"
              src={embedUrl}
              title="Transmisión de Kansas Flag"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className={`absolute inset-0 w-full h-full object-cover z-10 ${!liveUrl ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            ></iframe>
            
            <div className="absolute inset-0 bg-black flex flex-col items-center justify-center z-0 text-center px-4">
              <span className="material-symbols-outlined text-6xl text-zinc-600 mb-4">sports_football</span>
              <h3 className="text-2xl font-headline font-bold text-white uppercase mb-2">Fuera del Aire</h3>
              <p className="text-zinc-400 font-body">Señal en espera. Nuestras transmisiones inician 15 minutos antes de cada partido oficial.</p>
            </div>
          </div>

          {/* Botón para redireccionar a Calendario */}
          <div className="w-full max-w-6xl mt-8 text-center flex flex-col items-center">
            <Link href="/calendario" className="inline-flex items-center gap-3 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 px-10 py-5 font-headline uppercase font-black tracking-widest transition-all rounded shadow-md group">
              <span className="material-symbols-outlined">event_note</span>
              Ver Calendario de Partidos
            </Link>
          </div>

          {/* Banner de Reclutamiento debajo */}
          <div className="w-full max-w-6xl mt-8 bg-gradient-to-r from-zinc-900 via-primary/10 to-zinc-900 p-8 md:p-10 rounded-xl border border-primary/20 flex flex-col md:flex-row justify-between items-center text-center md:text-left gap-8 shadow-2xl relative overflow-hidden">
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
              
              <div className="flex-1">
                <h4 className="font-headline font-black text-3xl text-white uppercase mb-3 italic">¿LISTO PARA EL CAMPO?</h4>
                <p className="text-zinc-300 font-body text-base max-w-xl">
                  No solo nos veas desde la grada. Únete a la academia, descubre el flag football de primer nivel y asegura tu lugar en la próxima temporada oficial.
                </p>
              </div>
              
              <Link href="/inscripciones" className="bg-primary text-white border-2 border-primary hover:bg-transparent hover:text-primary px-10 py-4 font-headline font-black text-lg uppercase tracking-[0.2em] rounded transition-all flex-shrink-0 text-center shadow-[0_0_20px_rgba(227,24,55,0.4)]">
                Inscribirme Hoy
              </Link>
          </div>
          
        </div>
      </section>
    </>
  );
}
