import Link from "next/link";
import Image from "next/image";

export default function KingdomDrive() {
  return (
    <>
      <section className="relative min-h-[716px] flex items-center overflow-hidden bg-surface-container-low pt-12 pb-24 -mt-20">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-surface-container-low via-surface-container-low/80 to-transparent z-10"></div>
          <img className="w-full h-full object-cover object-center opacity-40 scale-110 grayscale" alt="championship stadium" src="https://images.unsplash.com/photo-1566577739112-5180d4bf9390?q=80&w=2626&auto=format&fit=crop" />
        </div>
        <div className="max-w-screen-2xl mx-auto px-8 relative z-20 w-full pt-20">
          <div className="max-w-3xl">
            <span className="inline-block bg-primary text-on-primary px-4 py-1 mb-6 font-headline font-extrabold uppercase tracking-widest slant-8">
              Editorial & Comunidad
            </span>
            <h1 className="text-7xl md:text-9xl font-headline font-black text-on-background leading-[0.9] uppercase tracking-tighter mb-8 italic mix-blend-multiply">
              KINGDOM <br/> <span className="text-primary-container">DRIVE</span>
            </h1>
            <p className="text-xl md:text-2xl text-on-surface-variant font-body max-w-xl mb-12 border-l-8 border-secondary-container pl-6">
              El pulso de nuestra dinastía. Noticias, análisis de la jornada, crónicas y lo más destacado de la élite de Kansas Flag México.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24 bg-surface px-8">
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex justify-between items-end mb-16">
            <h2 className="text-5xl font-headline font-black uppercase tracking-tighter text-on-background">Titulares</h2>
            <div className="hidden md:flex gap-4">
              <span className="text-sm font-bold uppercase tracking-widest text-primary border-b-2 border-primary pb-1">Todo</span>
              <span className="text-sm font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors cursor-pointer">Noticias</span>
              <span className="text-sm font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors cursor-pointer">Crónicas</span>
              <span className="text-sm font-bold uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors cursor-pointer">Scouting</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            <article className="md:col-span-8 bg-surface-container-highest rounded-xl overflow-hidden group hover:-translate-y-2 transition-transform duration-500 shadow-xl">
              <div className="relative h-[400px] overflow-hidden">
                <img src="https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?q=80&w=2669&auto=format&fit=crop" alt="flag football action" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 slant-15 scale-110 origin-bottom" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                <div className="absolute bottom-6 left-8 right-8">
                  <span className="text-secondary-container font-headline font-bold uppercase tracking-widest text-sm mb-3 block">Crónica de la Jornada</span>
                  <h3 className="text-4xl font-headline font-black text-white uppercase italic tracking-tighter leading-tight mb-4">
                    Dominio Absoluto: La Femenil U18 asegura pase a Playoffs
                  </h3>
                  <p className="text-white/80 font-body max-w-2xl">
                    Un partido de alta tensión que se definió en los últimos segundos con una intercepción clave defensiva.
                  </p>
                </div>
              </div>
            </article>

            <article className="md:col-span-4 bg-surface-container-low rounded-xl overflow-hidden group hover:-translate-y-2 transition-transform duration-500 shadow-lg">
              <div className="relative h-[200px] overflow-hidden">
                <img src="https://images.unsplash.com/photo-1504450758481-7338ba7524a8?q=80&w=2669&auto=format&fit=crop" alt="coach talking" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-primary/40 mix-blend-multiply"></div>
              </div>
              <div className="p-8">
                <span className="text-primary font-headline font-bold uppercase tracking-widest text-xs mb-3 block">Scouting Report</span>
                <h3 className="text-2xl font-headline font-black text-on-background uppercase tracking-tight mb-3">
                  Nuevos Talentos a Observar en la Categoría Infantil
                </h3>
                <p className="text-on-surface-variant font-body text-sm mb-6">
                  Nuestros coaches han puesto el ojo en 5 promesas que están dominando el campo esta temporada.
                </p>
                <Link href="#" className="text-primary font-headline font-bold uppercase tracking-widest text-sm slant-8 inline-block hover:text-primary-container">
                  Leer Reporte &rarr;
                </Link>
              </div>
            </article>

            <article className="md:col-span-4 bg-surface-container-lowest rounded-xl overflow-hidden p-8 shadow-sm group">
              <span className="text-primary font-headline font-bold uppercase tracking-widest text-xs mb-3 block">Noticias</span>
              <h3 className="text-2xl font-headline font-black text-on-background uppercase tracking-tight mb-3 group-hover:text-primary transition-colors">
                Clínica Internacional con Coaches Invitados
              </h3>
              <p className="text-on-surface-variant font-body text-sm mb-6">
                Este verano recibiremos a invitados especiales de USA para una clínica intensiva de 3 días en la Sede Santa Fe.
              </p>
              <div className="text-neutral-400 font-label text-xs uppercase tracking-widest">Hace 2 días</div>
            </article>
            
            <article className="md:col-span-4 bg-surface-container-lowest rounded-xl overflow-hidden p-8 shadow-sm group">
              <span className="text-secondary font-headline font-bold uppercase tracking-widest text-xs mb-3 block">Comunidad</span>
              <h3 className="text-2xl font-headline font-black text-on-background uppercase tracking-tight mb-3 group-hover:text-primary transition-colors">
                Día de Medios: Presentación de los Nuevos Uniformes
              </h3>
              <p className="text-on-surface-variant font-body text-sm mb-6">
                Conoce la nueva piel que defenderemos en la próxima temporada. Un diseño inspirado en la tradición y la velocidad.
              </p>
              <div className="text-neutral-400 font-label text-xs uppercase tracking-widest">Hace 1 semana</div>
            </article>

            <article className="md:col-span-4 bg-primary text-white rounded-xl overflow-hidden p-8 shadow-lg kinetic-shadow group">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <span className="text-white/70 font-headline font-bold uppercase tracking-widest text-xs mb-3 block">Anuncio Oficial</span>
                  <h3 className="text-3xl font-headline font-black uppercase tracking-tighter mb-4 italic">
                    Expansión: Nueva Sede en Zona Sur
                  </h3>
                  <p className="text-white/90 font-body text-sm">
                    Debido a la gran demanda, anunciamos oficialmente la apertura de nuestras nuevas instalaciones en Coyoacán. Las inscripciones abren el próximo mes.
                  </p>
                </div>
                <Link href="/sedes" className="mt-8 bg-white text-primary text-center py-3 font-headline font-bold uppercase tracking-widest text-sm rounded-sm hover:bg-secondary-container hover:text-on-secondary-container transition-all">
                  Ver Detalles
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section className="bg-surface-container-highest py-24 slant-reverse-8 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-8 relative z-10">
          <div className="text-center">
            <span className="material-symbols-outlined text-6xl text-primary mb-6">mail</span>
            <h2 className="text-5xl font-headline font-black uppercase tracking-tighter text-on-background mb-6 italic">No te pierdas ninguna <span className="text-primary">Jugada</span></h2>
            <p className="text-xl text-on-surface-variant font-body mb-10 max-w-2xl mx-auto">
              Suscríbete al boletín oficial de Kansas Flag México y recibe noticias exclusivas, preventas de mercancía y resúmenes de resultados.
            </p>
            <form className="flex flex-col md:flex-row gap-4 justify-center max-w-xl mx-auto">
              <input type="email" placeholder="CORREO ELECTRÓNICO" className="bg-surface border-b-2 border-outline-variant focus:border-primary px-6 py-4 font-headline uppercase tracking-widest text-on-background w-full md:w-2/3 outline-none transition-colors" />
              <button type="button" className="bg-gradient-to-br from-primary to-primary-container text-on-primary px-8 py-4 font-headline font-black uppercase tracking-widest md:w-1/3 hover:brightness-110 transition-all rounded-sm shadow-xl">
                Unirme
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}
