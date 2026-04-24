import Image from "next/image";
import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";

// Evita que Next.js almacene esta página estáticamente, para que los cambios en Google Sheets se reflejen.
export const revalidate = 60; // Revalida cada minuto

interface Championship {
  titulo: string;
  liga: string;
  categoria: string;
  temporada: string;
  fotoUrl: string;
}

// Datos de previsualización mientras el usuario conecta el Google Sheets
const dummyData: Championship[] = [
  {
    titulo: "Bicampeones Nacionales",
    liga: "AFEMEX",
    categoria: "Varonil Élite",
    temporada: "Otoño 2025",
    fotoUrl: "/images/bg-hero.jpg" // Placeholder fallback
  },
  {
    titulo: "Campeón Invicto regional",
    liga: "Tocho Flag Lomas",
    categoria: "Mixto AAA",
    temporada: "Primavera 2025",
    fotoUrl: "/images/bg-hero.jpg"
  },
  {
    titulo: "Subcampeón",
    liga: "FADEMAC",
    categoria: "Infantil U12",
    temporada: "Otoño 2024",
    fotoUrl: "/images/bg-hero.jpg"
  }
];

async function getChampionships(): Promise<Championship[]> {
  const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSbinglQ3T29IkNHK37gOvbb0teLGIghv1UAhMlYYDCIn_vWV60AuS4WLM68gIbLr1lEi1dYm-1ji0s/pub?output=csv";
  if (!url) return dummyData; // Relleno si no hay URL todavía

  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return dummyData;
    
    const text = await res.text();
    if (text.includes('<html') || text.includes('<!DOCTYPE')) return dummyData;
    
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    // Asumimos Headers: Título, Liga, Categoría, Temporada, Foto URL
    // En caso de que el usuario cambie el orden, buscaremos los índices:
    const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim().toLowerCase());
    
    const iTitulo = headers.findIndex(h => h.includes('título') || h.includes('titulo'));
    const iLiga = headers.findIndex(h => h.includes('liga'));
    const iCat = headers.findIndex(h => h.includes('categoría') || h.includes('categoria'));
    const iTemp = headers.findIndex(h => h.includes('temporada') || h.includes('año') || h.includes('fecha'));
    const iFoto = headers.findIndex(h => h.includes('foto') || h.includes('imagen') || h.includes('url'));

    const parsed = lines.slice(1).map(line => {
      // Separación de CSV por comas, ignorando comas internas si no están rodeadas
      const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(p => p.replace(/^"|"$/g, '').trim());
      
      const getValue = (idx: number) => idx >= 0 && parts[idx] ? parts[idx] : "";
      
      let photoStr = getValue(iFoto);
      
      // Transformar Google Drive Compartir a Thumbnail Directo
      if (photoStr.includes('drive.google.com/file/d/')) {
        const match = photoStr.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
        if (match && match[1]) {
          photoStr = `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`;
        }
      } else if (photoStr.includes('drive.google.com/open?id=')) {
         const match = photoStr.match(/id=([a-zA-Z0-9_-]+)/);
         if (match && match[1]) {
           photoStr = `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`;
         }
      }

      return {
        titulo: getValue(iTitulo),
        liga: getValue(iLiga),
        categoria: getValue(iCat),
        temporada: getValue(iTemp),
        fotoUrl: photoStr
      };
    }).filter(c => c.titulo !== "");

    return parsed.length > 0 ? parsed : dummyData;
  } catch (e) {
    return dummyData;
  }
}

export default async function HallOfFame() {
  const campeonatos = await getChampionships();

  return (
    <main className="min-h-screen bg-zinc-950 pt-32 pb-24 relative overflow-hidden">
      {/* Fondo estético */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-yellow-600/40 via-zinc-950 to-zinc-950"></div>
      <div className="absolute top-0 right-0 w-[80vw] h-[80vw] bg-yellow-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 z-0 pointer-events-none"></div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        {/* Encabezado */}
        <ScrollReveal>
          <div className="flex flex-col md:flex-row md:justify-between items-start md:items-end gap-6 mb-20 border-b border-zinc-800 pb-12">
            <div className="max-w-2xl">
              <Link href="/" className="inline-flex items-center text-zinc-500 hover:text-[#FFB81C] font-bold text-sm uppercase tracking-widest transition-colors mb-6">
                <span className="material-symbols-outlined mr-2 text-base">arrow_back</span>
                Volver al inicio
              </Link>
              <h1 className="text-6xl md:text-8xl font-headline font-black uppercase tracking-tighter italic text-white leading-none">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-[#FFB81C] to-yellow-600">Hall</span> of Fame
              </h1>
              <p className="text-xl text-zinc-400 mt-6 font-body">
                Nuestra historia se escribe con esfuerzo, sacrificio y disciplina. Conoce a los equipos y generaciones que han forjado el legado dorado de Kansas Flag.
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* Grid de Trofeos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
          {campeonatos.map((camp, idx) => (
            <ScrollReveal key={idx} delay={idx * 100}>
              <div className="group relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-yellow-500/50 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(255,184,28,0.15)] flex flex-col h-full h-[450px]">
                {/* Imagen del Campeón */}
                <div className="h-[250px] w-full relative overflow-hidden bg-black">
                  {camp.fotoUrl ? (
                    <Image 
                      src={camp.fotoUrl} 
                      alt={camp.titulo} 
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100 grayscale-[0.3] group-hover:grayscale-0"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-zinc-950">
                      <span className="material-symbols-outlined text-zinc-800 text-6xl">workspace_premium</span>
                    </div>
                  )}
                  {/* Gradiente súper VIP para fundir la imagen */}
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent pointer-events-none"></div>
                  
                  {/* Etiqueta Flotante de Temporada */}
                  {camp.temporada && (
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-zinc-700 text-white text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-lg">
                      {camp.temporada}
                    </div>
                  )}
                </div>

                {/* Info Textual */}
                <div className="p-8 pt-0 relative z-10 flex flex-col flex-grow items-start justify-end -mt-10">
                  {/* Icon Tofeo / Liga */}
                  <div className="flex gap-2 mb-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-yellow-400 to-[#FFB81C] p-0.5 shadow-[0_0_15px_rgba(255,184,28,0.4)]">
                      <div className="h-full w-full bg-zinc-900 rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600">trophy</span>
                      </div>
                    </div>
                  </div>
                  
                  {camp.liga && (
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#FFB81C] border border-[#FFB81C]/40 bg-[#FFB81C]/5 px-2 py-0.5 rounded-md mb-3 shadow-[0_0_10px_rgba(255,184,28,0.2)]">
                      {camp.liga}
                    </span>
                  )}
                  
                  <h3 className="text-2xl md:text-3xl font-headline font-black uppercase italic text-white leading-none mb-2 group-hover:text-[#FFB81C] transition-colors">{camp.titulo}</h3>
                  
                  {camp.categoria && (
                    <p className="text-zinc-400 text-sm font-bold mt-auto pt-4 border-t border-zinc-800 w-full flex items-center gap-2">
                       <span className="material-symbols-outlined text-sm">groups</span>
                       Cat. {camp.categoria}
                    </p>
                  )}
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Notificación si son dummy y Mensaje Motivacional */}
        {campeonatos === dummyData && (
          <div className="mt-16 bg-blue-500/10 border border-blue-500/30 rounded-xl p-6 text-center text-blue-200 text-sm font-body max-w-2xl mx-auto">
            <span className="material-symbols-outlined text-blue-400 text-3xl mb-2">info</span>
            <p><strong>Modo Vista Previa Activado:</strong> Esta página está mostrando datos de ejemplo porque aún no se ha conectado el enlace oficial de Google Sheets. <br/>Añade `NEXT_PUBLIC_CAMPEONATOS_CSV_URL` en tu archivo de variables de entorno o Vercel.</p>
          </div>
        )}
      </div>
    </main>
  );
}
