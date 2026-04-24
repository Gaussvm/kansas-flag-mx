import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import WhatsAppButton from "@/components/WhatsAppButton";
import InteractiveSedesSection from "@/components/InteractiveSedesSection";
import ScrollReveal from "@/components/ScrollReveal";
import ExpandableValueCard from "@/components/ExpandableValueCard";
import InteractiveLeaguesMarquee from "@/components/InteractiveLeaguesMarquee";
import ZoomableTournamentImage from "@/components/ZoomableTournamentImage";
import SocialFeedTabs from "@/components/SocialFeedTabs";

async function getChampionshipsCount() {
  const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSbinglQ3T29IkNHK37gOvbb0teLGIghv1UAhMlYYDCIn_vWV60AuS4WLM68gIbLr1lEi1dYm-1ji0s/pub?output=csv";
  if (!url) return 0;
  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return 0;
    const text = await res.text();
    const lines = text.split('\n').filter(line => line.trim().length > 0);
    return lines.length > 1 ? lines.length - 1 : 0;
  } catch (error) {
    return 0;
  }
}

async function getUpcomingTournaments() {
  const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQtQzEttGTjN-xJNcdySV6XgYiV8Sqfp6rtk7yx3PFqKawJ-tjkiv3q9baan4G3D6aBHTMdQ2ZFrTCZ/pub?output=csv";
  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error("Error fetching tournaments");
    const text = await res.text();
    
    if (text.includes('<html') || text.includes('<!DOCTYPE')) {
      throw new Error("Document is not valid CSV.");
    }

    const lines = text.split('\n').filter(line => line.trim().length > 0);
    const tournaments = lines.slice(1).map((line, index) => {
      // Split correctly handling potential quotes but simple comma separation
      const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(p => p.replace(/^"|"$/g, '').trim());
      
      let photoUrl = parts[5] || null;
      // Convertir links de Drive a directos
      if (photoUrl && photoUrl.includes('drive.google.com/file/d/')) {
        const match = photoUrl.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
        if (match && match[1]) {
          photoUrl = `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`;
        }
      } else if (photoUrl && photoUrl.includes('drive.google.com/open?id=')) {
        const match = photoUrl.match(/id=([a-zA-Z0-9_-]+)/);
        if (match && match[1]) {
           photoUrl = `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`;
        }
      }

      return {
        id: `torneo-${index}`,
        title: parts[0] || '',
        date: parts[1] || '',
        location: parts[2] || '',
        category: parts[3] || '',
        status: parts[4] || 'Próximamente',
        photo: photoUrl
      };
    }).filter(t => t.title !== '');
    
    return tournaments;
  } catch (error) {
    console.error("No se pudieron cargar los torneos", error);
    return [];
  }
}

async function getLeaguesGalleries() {
  const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vSjz1ezSamrGxgHqXZIg8Dexl-U0daORtI15XoFWKlxm0z9f7SWeq6QEuI5aaV7UUv4KurtVyZUWEZx/pub?output=csv";
  try {
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error("Error fetching leagues");
    const text = await res.text();
    
    if (text.includes('<html') || text.includes('<!DOCTYPE')) {
      throw new Error("Document is not valid CSV.");
    }

    const lines = text.split('\n').filter(line => line.trim().length > 0);
    const leagues = lines.slice(1).map((line) => {
      const parts = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(p => p.replace(/^"|"$/g, '').trim());
      
      const processDriveUrl = (u: string) => {
        if (!u) return '';
        if (u.includes('drive.google.com/file/d/')) {
          const m = u.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
          if (m && m[1]) return `https://drive.google.com/thumbnail?id=${m[1]}&sz=w1000`;
        } else if (u.includes('drive.google.com/open?id=')) {
          const m = u.match(/id=([a-zA-Z0-9_-]+)/);
          if (m && m[1]) return `https://drive.google.com/thumbnail?id=${m[1]}&sz=w1000`;
        }
        return u;
      };

      const name = parts[0] || '';
      const logoUrl = processDriveUrl(parts[1] || '');
      const photos = parts.slice(2, 11).map(p => processDriveUrl(p)).filter(p => p !== '');

      return { name, logoUrl, photos };
    }).filter(l => l.name !== '');
    
    return leagues;
  } catch (error) {
    console.error("No se pudieron cargar las ligas", error);
    return [];
  }
}

export default async function Home() {
  const upcomingTournaments = await getUpcomingTournaments();
  const leaguesGalleries = await getLeaguesGalleries();
  const championshipsCount = await getChampionshipsCount();
  return (
    <>
      {/* Hero Section */}
      <header className="relative h-[100vh] min-h-[700px] flex items-center overflow-hidden bg-zinc-900 -mt-20">
        <div className="absolute inset-0 z-0 hidden md:block">
          <iframe 
            src="https://www.youtube.com/embed/iHj_jHTIyyk?autoplay=1&mute=1&controls=0&loop=1&playlist=iHj_jHTIyyk&playsinline=1&rel=0&showinfo=0&disablekb=1&fs=0&modestbranding=1"
            allow="autoplay; encrypted-media"
            style={{ width: '100vw', height: '56.25vw', minHeight: '100vh', minWidth: '177.77vh' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-[0.75] grayscale-[0.25] contrast-125 brightness-110"
            frameBorder="0"
          ></iframe>
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/30 to-transparent"></div>
        </div>
        <div className="absolute inset-0 z-0 md:hidden bg-[url('/images/bg-hero-mobile.jpg')] bg-cover bg-center">
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/30 to-black/90"></div>
        </div>
        <div className="w-full px-8 md:pl-16 lg:pl-32 relative z-10 pt-32 md:pt-48 pb-32 md:pb-40">
          <div className="max-w-4xl">
            <span className="inline-block bg-secondary-container text-on-secondary-container px-4 py-1 font-headline font-black uppercase tracking-widest text-sm mb-6 -skew-x-12 animate-in slide-in-from-left duration-1000">
              🏈 Football Flag Mexico Team - Tochito Club 🏈
            </span>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-headline font-black text-white uppercase leading-[0.85] tracking-tighter mb-8 italic animate-in slide-in-from-bottom-8 duration-1000 delay-200 fade-in">
              El Talento Gana Partidos, <br /> <span className="text-[#E31837]">El Equipo Gana Campeonatos.</span>
            </h1>
            <div className="flex flex-col sm:flex-row gap-4 animate-in slide-in-from-bottom-8 duration-1000 delay-300 fade-in">
              <Link href="/programas" className="bg-primary text-center text-white px-10 py-5 text-xl font-headline font-black uppercase tracking-tighter rounded-md transition-all hover:bg-secondary-container hover:text-on-secondary-container transform active:scale-95">
                Ver Programas
              </Link>
              <Link href="/sedes" className="border-2 text-center border-white text-white px-10 py-5 text-xl font-headline font-black uppercase tracking-tighter rounded-md transition-all hover:bg-white hover:text-black transform active:scale-95">
                Sedes
              </Link>
            </div>
          </div>
        </div>
        <div className="hidden md:block absolute top-32 md:right-16 lg:right-32 z-20">
          <img
            alt="Kansas Flag México Logo Oficial"
            className="w-48 lg:w-64 h-auto drop-shadow-[0_20px_50px_rgba(227,24,55,0.3)] animate-in fade-in zoom-in duration-1000 delay-700"
            src="/images/logo.png"
          />
        </div>
      </header>

      {/* Associated Leagues Marquee */}
      <ScrollReveal delay={200}>
        <InteractiveLeaguesMarquee leagues={leaguesGalleries} />
      </ScrollReveal>

      {/* Próximos Torneos (Boletín) */}
      <section className="bg-zinc-950 py-24 relative z-20 border-b-4 border-[#E31837] overflow-hidden shadow-2xl">
        <ScrollReveal>
          <div className="container mx-auto px-8 relative z-10">
            <div className="flex flex-col md:flex-row md:justify-between items-start md:items-end mb-16 gap-6">
              <div>
                <h2 className="text-4xl md:text-6xl font-headline font-black uppercase tracking-tighter italic text-white mb-2">
                  Próximos <span className="text-[#E31837]">Torneos</span>
                </h2>
                <p className="text-zinc-400 font-body text-lg">Inscríbete a la siguiente justa deportiva. Cupos limitados.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingTournaments.length > 0 ? upcomingTournaments.map((tournament) => {
                const isAvailable = tournament.status.toLowerCase().includes("abierta") || tournament.status.toLowerCase().includes("disponible");
                const wappParams = new URLSearchParams({
                  text: `Hola, me interesa pedir informes para inscribirme al torneo: ${tournament.title}`
                });
                const whatsappUrl = `https://wa.me/525539971470?${wappParams.toString()}`;

                return (
                  <div key={tournament.id} className="bg-white border-2 border-zinc-200 rounded-2xl overflow-hidden hover:shadow-[0_20px_50px_rgba(255,255,255,0.4)] transition-all group flex flex-col h-full shadow-2xl relative">
                    {tournament.photo ? (
                      <ZoomableTournamentImage src={tournament.photo} alt={tournament.title} />
                    ) : null}
                    <div className="absolute inset-0 bg-gradient-to-br from-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                    <div className="p-6 md:p-8 flex-grow relative z-10">
                      <div className="flex justify-between items-start mb-6">
                        <span className={`px-4 py-1 text-xs font-bold uppercase tracking-widest rounded-full ${isAvailable ? 'bg-[#E31837]/10 text-[#E31837] border border-[#E31837]/20' : 'bg-zinc-200 text-zinc-500 border border-zinc-300'}`}>
                          {tournament.status}
                        </span>
                        <span className="material-symbols-outlined text-[#FFB81C] group-hover:text-[#E31837] drop-shadow-md transition-colors duration-500">emoji_events</span>
                      </div>
                      
                      <h3 className="text-2xl font-headline font-black text-zinc-900 italic uppercase tracking-wider mb-2 group-hover:text-[#E31837] transition-colors duration-300">
                        {tournament.title}
                      </h3>
                      
                      <ul className="space-y-4 mt-8 text-sm text-zinc-700 font-body">
                        <li className="flex items-start gap-3">
                          <span className="material-symbols-outlined text-base mt-0.5 text-[#E31837]">calendar_month</span>
                          <span className="font-medium">{tournament.date}</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="material-symbols-outlined text-base mt-0.5 text-[#E31837]">location_on</span>
                          <span className="font-medium">{tournament.location}</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <span className="material-symbols-outlined text-base mt-0.5 text-[#E31837]">group</span>
                          <span className="font-medium">{tournament.category}</span>
                        </li>
                      </ul>
                    </div>
                    
                    <div className="p-6 md:p-8 pt-0 mt-auto relative z-10">
                      <a 
                        href={whatsappUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center gap-3 py-4 font-headline uppercase font-black tracking-widest transition-all rounded bg-[#25D366] text-white hover:bg-[#20bd5a] hover:-translate-y-1 shadow-[0_10px_20px_rgba(37,211,102,0.3)]"
                      >
                        {isAvailable ? 'Inscribirme / Info' : 'Me Interesa'}
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" fill="currentColor" className="h-5 w-5">
                          <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-2.1-3.6 2.1-3.2 7.6-14.1 1.4-2.8.7-5.1-.7-7.9-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                );
              }) : (
                <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12 px-6 flex flex-col items-center justify-center border-2 border-dashed border-zinc-800 rounded-xl">
                  <span className="material-symbols-outlined text-4xl text-zinc-600 mb-4 opacity-50">calendar_add_on</span>
                  <h3 className="text-xl font-headline font-black uppercase text-zinc-400 italic">No hay torneos nuevos anunciados</h3>
                  <p className="text-zinc-500 font-body">Mantente al pendiente de nuestras redes sociales.</p>
                </div>
              )}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Programs Bento Grid */}
      <section className="py-24 bg-surface-container-low px-8 overflow-hidden">
        <ScrollReveal>
          <div className="container mx-auto">
            <h2 className="text-5xl md:text-7xl font-headline font-black uppercase tracking-tighter text-center mb-20 italic">
              Nuestros <span className="text-primary">Programas</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[180px] md:auto-rows-auto md:grid-rows-2 gap-3 md:gap-4 md:h-[600px]">
              
              <div className="col-span-2 md:col-span-2 row-span-2 md:row-span-2 relative group overflow-hidden rounded-xl">
                <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="infantiles" src="/images/infantiles-real.jpg" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90"></div>
                <div className="absolute bottom-5 md:bottom-8 left-5 md:left-8">
                  <h3 className="text-3xl md:text-4xl font-headline font-black text-white uppercase italic">Infantiles</h3>
                  <p className="text-sm md:text-base text-zinc-300 font-bold mb-3 md:mb-4">De 5 a 12 años</p>
                  <Link href="/programas"><button className="bg-primary text-white px-4 md:px-6 py-2 font-headline font-black uppercase italic text-xs md:text-sm hover:bg-secondary-container hover:text-on-secondary-container transition-all">Ver Detalles</button></Link>
                </div>
              </div>

              <div className="col-span-2 md:col-span-2 row-span-1 relative group overflow-hidden rounded-xl">
                <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="femenil" src="/images/femenil-real.jpg" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>
                <div className="absolute bottom-4 md:bottom-6 left-4 md:left-6">
                  <h3 className="text-2xl md:text-3xl font-headline font-black text-white uppercase italic">Femenil</h3>
                  <p className="text-xs md:text-sm text-zinc-300 font-bold">Todas las edades</p>
                </div>
              </div>

              <div className="col-span-1 row-span-1 relative group overflow-hidden rounded-xl">
                <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="varonil" src="/images/varonil-real.jpg" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>
                <div className="absolute bottom-3 md:bottom-4 left-3 md:left-4">
                  <h3 className="text-lg md:text-2xl font-headline font-black text-white uppercase italic leading-tight">Varonil</h3>
                </div>
              </div>

              <div className="col-span-1 row-span-1 relative group overflow-hidden rounded-xl">
                <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="mixto" src="/images/categoria-mixto.jpg" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>
                <div className="absolute bottom-3 md:bottom-4 left-3 md:left-4">
                  <h3 className="text-lg md:text-2xl font-headline font-black text-white uppercase italic leading-tight">Mixto</h3>
                </div>
              </div>

            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-zinc-950 text-white relative z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-full opacity-20 pointer-events-none overflow-hidden">
          <span className="text-[15rem] md:text-[20rem] font-black italic select-none leading-none absolute top-12 md:top-24 right-[-5%] md:right-0 animate-in slide-in-from-right duration-1000 bg-gradient-to-r from-[#E31837] to-[#FFB81C] text-transparent bg-clip-text">FLAG</span>
        </div>
        <ScrollReveal>
          <div className="container mx-auto px-8 relative z-10">
            <div className="max-w-3xl mb-12 md:mb-20">
              <h2 className="text-5xl md:text-8xl font-headline font-black uppercase tracking-tighter italic leading-none mb-6">
                El <span className="animate-ember-glow">Corazón</span> <br /> <span className="text-white">de</span> <span className="text-secondary-container">Kansas</span>
              </h2>
              <p className="text-xl text-zinc-400 font-body">No solo formamos atletas, forjamos el carácter y el liderazgo necesario para ganar dentro y fuera del campo.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              <ExpandableValueCard
                icon="workspace_premium"
                title="Coaching Profesional"
                text="Staff técnico certificado nacional e internacionalmente con experiencia en niveles profesionales, colegiales y de iniciación."
                colorClass="text-primary"
                borderColorClass="border-primary"
              />
              <ExpandableValueCard
                icon="public"
                title="Exposición Internacional"
                text="Participación en torneos internacionales USA y Canadá. Oportunidades de visorías para becas deportivas."
                colorClass="text-secondary-container"
                borderColorClass="border-secondary-container"
              />
              <ExpandableValueCard
                icon="groups"
                title="Comunidad & Familia"
                text="Un entorno seguro y vibrante donde fomentamos la unión, la disciplina, el respeto y la lealtad competitiva."
                colorClass="text-[#FFB81C]"
                borderColorClass="border-[#FFB81C]"
              />
              <Link href="/hall-of-fame" className="block group">
                <div className="flex flex-col p-6 md:p-8 bg-gradient-to-br from-yellow-500 via-[#FFB81C] to-yellow-600 border-l-4 border-yellow-300 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 shadow-[0_10px_30px_rgba(255,184,28,0.4)] select-none rounded-r-xl h-full relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-20 rounded-full blur-2xl -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700"></div>
                   <div className="flex items-center gap-4 relative z-10">
                     <span className="material-symbols-outlined text-4xl lg:text-5xl text-white drop-shadow-md" style={{ fontVariationSettings: "'FILL' 1" }}>trophy</span>
                     <h4 className="text-xl md:text-2xl font-headline font-black uppercase italic text-white m-0 leading-tight drop-shadow-sm">Hall of <br/>Fame</h4>
                   </div>
                   <div className="mt-4 relative z-10">
                     <p className="text-yellow-900 text-sm md:text-base font-bold leading-relaxed group-hover:text-black transition-colors duration-300">
                       {championshipsCount > 0 
                         ? `Historia de gloria: ${championshipsCount} trofeos ganados en ligas y nacionales.` 
                         : `Explora el muro de nuestros equipos campeones.`}
                     </p>
                     <p className="text-white text-xs uppercase tracking-widest font-black mt-3 flex items-center gap-1">Ver Títulos <span className="material-symbols-outlined text-[14px]">arrow_forward</span></p>
                   </div>
                </div>
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* Locations Section */}
      <ScrollReveal>
        <InteractiveSedesSection />
      </ScrollReveal>

      {/* News/Updates Section */}
      <section className="py-24 bg-zinc-950 relative z-10 px-8 overflow-hidden">
        <ScrollReveal>
          <div className="container mx-auto">
            <div className="flex flex-col md:flex-row md:justify-between items-start md:items-end gap-8 md:gap-0 mb-12 md:mb-16">
              <div>
                <h2 className="text-5xl md:text-7xl font-headline font-black uppercase tracking-tighter text-white italic">
                  El Pulso <span className="text-primary block md:inline-block animate-heartbeat-neon">Kansas</span>
                </h2>
                <div className="h-2 w-24 bg-secondary-container mt-4"></div>
              </div>
            </div>
            <SocialFeedTabs />
          </div>
        </ScrollReveal>
      </section>

      {/* YouTube Gallery Section */}
      <section className="py-24 bg-surface-container-highest px-8 overflow-hidden">
        <ScrollReveal>
          <div className="container mx-auto">
            {/* Elfsight YouTube Gallery | Kansas Flag YT */}
            <Script src="https://elfsightcdn.com/platform.js" strategy="lazyOnload" />
            <div className="elfsight-app-2de62bad-5a32-413b-8ab2-a318b3415f60 w-full" data-elfsight-app-lazy></div>
          </div>
        </ScrollReveal>
      </section>
      
      <WhatsAppButton />
    </>
  );
}
