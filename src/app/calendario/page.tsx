import Link from "next/link";
import LiveCalendar from "@/components/LiveCalendar";

async function getMatches() {
  const url = process.env.NEXT_PUBLIC_MATCHES_CSV_URL;
  if (!url) {
    return [
      { equipo: "Kansas Flag vs Linces UVM", ligaStr: "", fecha: "Sábado 10:00 AM", fechaExacta: "", linkEnvivo: "" },
      { equipo: "Torneo Regional - Semifinal", ligaStr: "", fecha: "Domingo 12:30 PM", fechaExacta: "", linkEnvivo: "" }
    ];
  }
  try {
    let fetchUrl = url;
    if (fetchUrl.includes('/pubhtml')) {
      fetchUrl = fetchUrl.replace(/\/pubhtml.*/, '/pub?output=csv');
    }

    const res = await fetch(fetchUrl, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error("Error fetching");
    const text = await res.text();
    
    if (text.includes('<html') || text.includes('<!DOCTYPE') || text.includes('function(')) {
      throw new Error("El formato del documento no es CSV válido.");
    }

    const lines = text.split('\n').filter(line => line.trim().length > 0);
    if (lines.length < 2) return [];

    const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim().toLowerCase());
    
    // Buscadores flexibles de columnas
    const idxLiga = headers.findIndex(h => h.includes('liga'));
    const idxHora = headers.findIndex(h => h.includes('hora'));
    const idxFecha = headers.findIndex(h => h.includes('fecha'));
    const idxEnVivo = headers.findIndex(h => h.includes('transmisión') || h.includes('fb') || h.includes('vivo'));
    const idxEquipos = headers.findIndex(h => h.includes('equipo') || h.includes('título') || h.includes('titulo'));

    const matches = lines.slice(1).map(line => {
      const parts = line.split(',');
      const getValue = (idx: number) => idx >= 0 && parts[idx] ? parts[idx].replace(/"/g, '').trim() : '';

      const ligaVal = getValue(idxLiga);
      const equiposVal = getValue(idxEquipos);
      
      return {
        // En "equipo" usamos la columna Equipos (si existe) y si no, caemos en la Liga.
        equipo: equiposVal || ligaVal,
        ligaStr: equiposVal ? ligaVal : '', // Si sí hubo equipo, guardamos la liga para usarla de subtítulo
        fecha: getValue(idxHora),
        fechaExacta: getValue(idxFecha),
        linkEnvivo: getValue(idxEnVivo)
      };
    });
    
    const validMatches = matches.filter(m => m.equipo); 

    // INFO DE DIAGNÓSTICO EN PANTALLA
    if (validMatches.length === 0) {
       return [{
         equipo: "¿No hay equipo válido?",
         ligaStr: `LigaIdx:${idxLiga} EqIdx:${idxEquipos}`,
         fecha: `${headers.join('|')}`,
         fechaExacta: `Líneas detectadas: ${lines.length}`,
         linkEnvivo: ''
       }];
    }

    // Ordenar cronológicamente ascendente usando la fecha exacta
    validMatches.sort((a, b) => {
      const normalize = (dateStr: string) => {
        if (!dateStr) return "9999-99-99"; // Empujar indefinidos al final
        if (dateStr.includes('/')) {
          const p = dateStr.split('/');
          if (p.length === 3) return `${p[2]}-${p[1]}-${p[0]}`;
        }
        return dateStr;
      };
      return normalize(a.fechaExacta).localeCompare(normalize(b.fechaExacta));
    });

    return validMatches;
  } catch (error: any) {
    // DIAGNÓSTICO DE CATCH ERROR EN PANTALLA
    return [{
       equipo: "ERROR DE PROCESAMIENTO",
       ligaStr: "Revisa la conexión o el Link CSV",
       fecha: error.message || "Desconocido",
       fechaExacta: "",
       linkEnvivo: ""
    }];
  }
}

export default async function Calendario() {
  const matches = await getMatches();

  // Filtrar solo para la lista de "Próximos Partidos" los que ya pasaron
  const nowInCDMX = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Mexico_City" }));
  const year = nowInCDMX.getFullYear();
  const month = String(nowInCDMX.getMonth() + 1).padStart(2, '0');
  const day = String(nowInCDMX.getDate()).padStart(2, '0');
  const todayCDMXStr = `${year}-${month}-${day}`;

  const upcomingMatchesList = matches.filter(m => {
    let dateStr = m.fechaExacta;
    if (!dateStr) return true; // Si no hay fecha, lo mostramos (indefinido)
    
    // Normalizar formato si viene como DD/MM/YYYY
    if (dateStr.includes('/')) {
      const p = dateStr.split('/');
      if (p.length === 3) {
        const d = p[0].padStart(2, '0');
        const mo = p[1].padStart(2, '0');
        dateStr = `${p[2]}-${mo}-${d}`;
      }
    }
    
    return dateStr >= todayCDMXStr;
  });

  return (
    <>
      <section className="relative min-h-screen bg-slate-50 pt-32 pb-24 overflow-hidden -mt-20">
        <div className="absolute inset-0 z-0 overflow-hidden">
          {/* Apple-style mesh gradients */}
          <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-[#FFB81C]/20 rounded-full blur-[120px] mix-blend-multiply opacity-70 animate-pulse"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[800px] h-[800px] bg-[#E31837]/10 rounded-full blur-[150px] mix-blend-multiply opacity-70"></div>
          <div className="absolute top-[30%] left-[20%] w-[400px] h-[400px] bg-[#1877F2]/5 rounded-full blur-[100px] mix-blend-multiply opacity-50"></div>
          
          <div className="absolute w-full h-[50%] bg-gradient-to-b from-white to-transparent top-0"></div>
        </div>

        <div className="container mx-auto px-4 md:px-8 relative z-10 flex flex-col items-center">
          
          <div className="text-center mb-10 w-full max-w-5xl flex flex-col items-center">
            <div className="flex items-center gap-3 bg-white/70 backdrop-blur-md border border-zinc-200/60 px-5 py-2 rounded-full mb-6 shadow-sm">
              <span className="material-symbols-outlined text-primary">event_available</span>
              <span className="text-zinc-800 font-headline font-black uppercase tracking-widest text-sm">Organización Oficial</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-headline font-black text-zinc-900 uppercase italic tracking-tighter mb-4 text-center drop-shadow-sm">
              CALENDARIO <span className="text-primary">OFICIAL</span>
            </h1>
            <p className="text-zinc-600 font-body max-w-2xl mx-auto text-center font-medium">
              Entérate de las fechas, rivales y horarios de nuestros próximos enfrentamientos.
            </p>
          </div>

          {/* Grid de Lista y Calendario */}
          <div className="w-full max-w-6xl mt-4 grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            <div className="bg-white/60 backdrop-blur-3xl border border-white/40 p-6 md:p-8 rounded-3xl flex flex-col shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all">
              <div className="flex items-center gap-3 mb-6 md:mb-8">
                 <span className="material-symbols-outlined text-primary text-3xl">sports_score</span>
                 <h4 className="font-headline font-black text-2xl text-zinc-900 uppercase tracking-wider">Próximos Partidos</h4>
              </div>
              
              <ul className="space-y-4 md:space-y-5 flex-grow overflow-y-auto max-h-[450px] lg:max-h-[500px] pr-4 custom-scrollbar">
                {upcomingMatchesList.length > 0 ? (
                  upcomingMatchesList.map((match, i) => (
                    <li key={i} className="flex flex-col md:flex-row md:items-start gap-2 md:gap-8 border-b border-zinc-100 pb-5 pt-3 group">
                      <div className="flex flex-col md:min-w-[180px] pt-1">
                        {match.fechaExacta && (
                          <span className="text-secondary-container font-headline font-black text-xl tracking-wider uppercase drop-shadow-sm leading-none mb-1">
                            {match.fechaExacta}
                          </span>
                        )}
                        <span className="text-primary font-bold text-base tracking-widest">
                          {match.fecha.replace(/^(lunes|martes|miércoles|miercoles|jueves|viernes|sábado|sabado|domingo)\s*/i, '')}
                        </span>
                      </div>
                      <div className="flex flex-col flex-grow items-start justify-start">
                        {match.ligaStr && (
                           <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-primary border border-primary/60 bg-primary/5 px-2.5 py-0.5 rounded-md mb-2 shadow-[0_0_12px_rgba(227,24,55,0.4)]" style={{ textShadow: "0 0 8px rgba(227,24,55,0.3)" }}>
                             {match.ligaStr}
                           </span>
                        )}
                        <span className="text-zinc-900 font-black text-2xl tracking-tight group-hover:text-primary transition-colors leading-none">
                          {match.equipo}
                        </span>
                      </div>
                    </li>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-zinc-400 py-10">
                    <span className="material-symbols-outlined text-4xl mb-3 opacity-50">calendar_add_on</span>
                    <p className="italic">No hay encuentros programados por el momento.</p>
                  </div>
                )}
              </ul>
            </div>
            
            {/* Calendario Dinámico */}
            <LiveCalendar matches={matches} />
          </div>

        </div>
      </section>
    </>
  );
}
