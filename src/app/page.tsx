import Image from "next/image";
import Link from "next/link";
import Script from "next/script";
import WhatsAppButton from "@/components/WhatsAppButton";
import InteractiveSedesSection from "@/components/InteractiveSedesSection";

export default function Home() {
  return (
    <>
      {/* Hero Section */}
      <header className="relative h-[100vh] min-h-[700px] flex items-center overflow-hidden bg-zinc-900 -mt-20">
        <div className="absolute inset-0 z-0">
          <iframe 
            src="https://www.youtube.com/embed/iHj_jHTIyyk?autoplay=1&mute=1&controls=0&loop=1&playlist=iHj_jHTIyyk&playsinline=1&rel=0&showinfo=0&disablekb=1&fs=0&modestbranding=1"
            allow="autoplay; encrypted-media"
            style={{ width: '100vw', height: '56.25vw', minHeight: '100vh', minWidth: '177.77vh' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-60 grayscale-[0.3] contrast-125"
            frameBorder="0"
          ></iframe>
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent"></div>
        </div>
        <div className="w-full px-8 md:pl-16 lg:pl-32 relative z-10 pt-20">
          <div className="max-w-4xl">
            <span className="inline-block bg-secondary-container text-on-secondary-container px-4 py-1 font-headline font-black uppercase tracking-widest text-sm mb-6 -skew-x-12">
              EST. 2024 • THE KINETIC ARENA
            </span>
            <h1 className="text-6xl md:text-9xl font-headline font-black text-white uppercase leading-[0.85] tracking-tighter mb-8 italic">
              Nuestra Dinastía <br /> <span className="text-[#E31837]">Empieza Aquí</span>
            </h1>
            <p className="text-xl md:text-2xl text-zinc-300 font-body max-w-2xl mb-10 leading-relaxed">
              Entrena con los campeones. De 5 a 50 años. Proyección nacional e internacional con el sello de excelencia de Kansas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-primary text-white px-10 py-5 text-xl font-headline font-black uppercase tracking-tighter rounded-md transition-all hover:bg-secondary-container hover:text-on-secondary-container transform active:scale-95">
                Clase de Prueba Gratis
              </button>
              <Link href="/programas" className="border-2 text-center border-white text-white px-10 py-5 text-xl font-headline font-black uppercase tracking-tighter rounded-md transition-all hover:bg-white hover:text-black transform active:scale-95">
                Ver Programas
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute top-32 right-8 md:right-16 lg:right-32 z-20">
          <img
            alt="Kansas Flag México Logo Oficial"
            className="w-48 md:w-64 lg:w-80 h-auto drop-shadow-[0_20px_50px_rgba(227,24,55,0.3)] animate-in fade-in zoom-in duration-1000"
            src="https://lh3.googleusercontent.com/aida/ADBb0ugYAmmwGLyM7LozBXkATmoPFuziDvo0uB3nrlILDssM2TrMZ3Ryuc3WwbNsTojhqs61wEybV5KLIIM3GH0EkjFftc9-BvvImIeSTp3qiDkDg0PlbLBEBYmZ90nqWhSlqB1qbyD1IzMb1VSlV6iP2x0jZLOMq6QnpV7CfFWvxPCRbG0h0Dt007Kq76uUVVGquQLUN3rMsaMH7GrQuE6c0idssnWVoEII2hfOOnDlsiffjX9hHEds3m3yipF6ufI19dS6xAU8ov7wrg"
          />
        </div>
      </header>

      {/* Associated Leagues Marquee */}
      <section className="bg-white py-12 overflow-hidden relative z-20 shadow-2xl border-y-4 border-zinc-100">
        <div className="flex animate-slide-infinite w-max hover:[animation-play-state:paused] cursor-pointer">
          {/* We duplicate the array to create a seamless infinite loop across all screen sizes */}
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex gap-32 sm:gap-48 items-center px-16 sm:px-24">
              <img src="/logos/Liga 6.png" alt="FMFA" className="h-20 w-auto object-contain hover:scale-110 transition-transform" />
              <img src="/logos/Liga 1.png" alt="World Championships Youth Flag" className="h-24 w-auto object-contain hover:scale-110 transition-transform" />
              <img src="/logos/Liga 5.png" alt="FADEMAC" className="h-24 w-auto object-contain hover:scale-110 transition-transform" />
              <img src="/logos/Liga 2.png" alt="LMTI" className="h-16 w-auto object-contain hover:scale-110 transition-transform" />
              <img src="/logos/Liga 3.png" alt="LNT" className="h-24 w-auto object-contain hover:scale-110 transition-transform" />
              <img src="/logos/Liga 4.png" alt="The Best AFFEMEX" className="h-24 w-auto object-contain hover:scale-110 transition-transform" />
            </div>
          ))}
        </div>
      </section>

      {/* News/Updates Section */}
      <section className="py-24 bg-surface relative z-10 px-8">
        <div className="container mx-auto">
          <div className="flex justify-between items-end mb-16">
            <div>
              <h2 className="text-5xl md:text-7xl font-headline font-black uppercase tracking-tighter text-on-background italic">
                El Pulso <span className="text-primary block md:inline">de Kansas</span>
              </h2>
              <div className="h-2 w-24 bg-secondary-container mt-4"></div>
            </div>
            <Link href="https://instagram.com/kansasflagmx" target="_blank" className="hidden md:flex items-center gap-2 font-headline font-bold text-primary hover:underline uppercase tracking-tight">
              Síguenos en Instagram <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
          <div className="w-full min-h-[400px]">
            <Script src="https://elfsightcdn.com/platform.js" strategy="lazyOnload" />
            <div className="elfsight-app-eedcce08-a945-4cc6-94d8-3737e937e60a" data-elfsight-app-lazy></div>
          </div>
        </div>
      </section>

      {/* Programs Bento Grid */}
      <section className="py-24 bg-surface-container-low px-8">
        <div className="container mx-auto">
          <h2 className="text-5xl md:text-7xl font-headline font-black uppercase tracking-tighter text-center mb-20 italic">
            Nuestros <span className="text-primary">Programas</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-4 h-[1000px] md:h-[600px]">
            <div className="md:col-span-2 md:row-span-2 relative group overflow-hidden rounded-lg">
              <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="infantiles" src="/images/infantiles-real.jpg" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>
              <div className="absolute bottom-8 left-8">
                <h3 className="text-4xl font-headline font-black text-white uppercase italic">Infantiles</h3>
                <p className="text-zinc-300 font-bold mb-4">De 5 a 12 años</p>
                <button className="bg-primary text-white px-6 py-2 font-headline font-black uppercase italic text-sm hover:bg-secondary-container hover:text-on-secondary-container transition-all">Ver Detalles</button>
              </div>
            </div>
            <div className="md:col-span-2 relative group overflow-hidden rounded-lg">
              <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="femenil" src="/images/femenil-real.jpg" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>
              <div className="absolute bottom-6 left-6">
                <h3 className="text-3xl font-headline font-black text-white uppercase italic">Femenil</h3>
                <p className="text-zinc-300 font-bold mb-2">Todas las edades</p>
              </div>
            </div>
            <div className="relative group overflow-hidden rounded-lg">
              <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="varonil" src="/images/varonil-real.jpg" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>
              <div className="absolute bottom-4 left-4">
                <h3 className="text-2xl font-headline font-black text-white uppercase italic">Varonil</h3>
              </div>
            </div>
            <div className="relative group overflow-hidden rounded-lg">
              <img className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="mixto" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB2PfCsqknnLFt89LkHE9HhNousLE3hsYwtNCJcNsybf3vYSXVCeEfsoIoiqdcaxWrDGp52dMjjg3U3gMjwO2XmQDL__R6n5QzG4mR2_zYbtG3KKf4UFcFg6sLTeMMuosN79BGGguVYlTLoXmhJG8uu15uqg8jIKEcV7YDGYid-y6fa5PIqN5yMJGtTHbeefF_T3K7fYdUFmOLrHd6Om_D13qWyIZnGiw3z7on9f7nKoesNIV71v4e4ab0nwQbWSmo2DPlBN61KIVw" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-90"></div>
              <div className="absolute bottom-4 left-4">
                <h3 className="text-2xl font-headline font-black text-white uppercase italic">Mixto</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-32 bg-zinc-950 text-white slant-reverse-15 relative z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
          <span className="text-[20rem] font-black italic select-none leading-none absolute top-1/2 -translate-y-1/2 right-0">CHIEFS</span>
        </div>
        <div className="container mx-auto px-8 relative z-10">
          <div className="max-w-3xl mb-20">
            <h2 className="text-5xl md:text-8xl font-headline font-black uppercase tracking-tighter italic leading-none mb-6">
              El Corazón <br /> <span className="text-secondary-container">de Kansas</span>
            </h2>
            <p className="text-xl text-zinc-400 font-body">No solo formamos atletas, forjamos el carácter y el liderazgo necesario para ganar dentro y fuera del campo.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col gap-6 p-8 bg-zinc-900 border-l-4 border-primary">
              <span className="material-symbols-outlined text-5xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>workspace_premium</span>
              <h4 className="text-2xl font-headline font-black uppercase italic">Coaching Profesional</h4>
              <p className="text-zinc-400">Staff técnico certificado internacionalmente con experiencia en niveles profesionales y colegiales.</p>
            </div>
            <div className="flex flex-col gap-6 p-8 bg-zinc-900 border-l-4 border-secondary-container">
              <span className="material-symbols-outlined text-5xl text-secondary-container" style={{ fontVariationSettings: "'FILL' 1" }}>public</span>
              <h4 className="text-2xl font-headline font-black uppercase italic">Exposición Internacional</h4>
              <p className="text-zinc-400">Convenios directos con academias en USA para campamentos y oportunidades de becas deportivas.</p>
            </div>
            <div className="flex flex-col gap-6 p-8 bg-zinc-900 border-l-4 border-primary">
              <span className="material-symbols-outlined text-5xl text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>groups</span>
              <h4 className="text-2xl font-headline font-black uppercase italic">Comunidad & Familia</h4>
              <p className="text-zinc-400">Un entorno seguro y vibrante donde fomentamos la disciplina, el respeto y la lealtad competitiva.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Locations Section */}
      <InteractiveSedesSection />

      {/* YouTube Gallery Section */}
      <section className="py-24 bg-surface-container-highest px-8">
        <div className="container mx-auto">
          {/* Elfsight YouTube Gallery | KANSAS FLAG */}
          <Script src="https://elfsightcdn.com/platform.js" strategy="lazyOnload" />
          <div className="elfsight-app-a8ad9b26-24dc-4d21-9906-059c434d78cd" data-elfsight-app-lazy></div>
        </div>
      </section>
      
      <WhatsAppButton />
    </>
  );
}
