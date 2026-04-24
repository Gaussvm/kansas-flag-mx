import Link from "next/link";

const sedesData = [
  {
    title: "Mimosa",
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

export default function Sedes() {
  return (
    <>
      <section className="relative h-[716px] flex items-center overflow-hidden bg-surface-container-low -mt-20">
        <div className="absolute inset-0 z-0">
          <img alt="Sedes Training" className="w-full h-full object-cover opacity-40 mix-blend-multiply" src="/images/sedes-hero.png" />
          <div className="absolute inset-0 bg-gradient-to-r from-surface via-transparent to-transparent"></div>
        </div>
        <div className="container mx-auto px-8 relative z-10 pt-20">
          <div className="max-w-3xl">
            <span className="inline-block bg-secondary-container text-on-secondary-container px-4 py-1 font-headline font-black uppercase tracking-widest mb-6 slant-reverse-15">
              The Championship Tier
            </span>
            <h1 className="text-6xl md:text-8xl font-headline font-black uppercase tracking-tighter leading-[0.9] text-on-background mb-8">
              Entrena en el <span className="text-primary">Corazón</span> de la Acción
            </h1>
            <p className="text-xl text-on-surface-variant max-w-xl mb-10 font-medium">
              Formamos atletas de élite en las mejores instalaciones de México. Encuentra tu sede y únete a la dinastía.
            </p>
            <div className="flex gap-4">
              <a className="bg-primary hover:bg-primary-container text-white px-10 py-4 font-headline font-black uppercase tracking-widest transition-all rounded-md flex items-center gap-2" href="#mapa">
                Explorar Sedes
                <span className="material-symbols-outlined">map</span>
              </a>
            </div>
          </div>
        </div>
        <div className="absolute right-[-5%] top-[10%] w-1/2 h-full slant-15 bg-primary opacity-5 -z-10"></div>
      </section>



      <section className="py-24 bg-surface-container-low relative overflow-hidden" id="mapa">
        <div className="container mx-auto px-4 md:px-8 relative z-10 max-w-7xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {sedesData.map((sede, idx) => (
              <div key={idx} className="bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/10 group hover:border-primary/50 transition-all flex flex-col shadow-md hover:shadow-2xl hover:-translate-y-1">
                <div className="h-32 md:h-40 overflow-hidden relative bg-zinc-800">
                  <img src={sede.img} alt={sede.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent/20"></div>
                  <div className="absolute bottom-3 left-4">
                    <h3 className="text-white text-lg md:text-xl font-headline font-black uppercase tracking-tight drop-shadow-md">{sede.title}</h3>
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-grow justify-between bg-zinc-900 border-t border-zinc-800">
                  <div className="flex items-start gap-3 h-14 mb-4">
                    <span className="material-symbols-outlined text-primary text-lg shrink-0 mt-0.5">pin_drop</span>
                    <p className="text-xs md:text-sm font-body font-medium text-zinc-400 line-clamp-2 leading-snug">{sede.address}</p>
                  </div>
                  <a href={sede.link} target="_blank" rel="noopener noreferrer" className="w-full bg-secondary-container text-on-secondary-container py-3 text-xs md:text-sm font-headline font-black uppercase tracking-widest hover:brightness-110 transition-all flex items-center justify-center gap-2 rounded-lg kinetic-shadow group-hover:bg-primary group-hover:text-white">
                    Cómo llegar
                    <span className="material-symbols-outlined text-base">directions</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-primary"></div>
      </section>

      <section className="py-20 bg-neutral-950 text-white relative flex justify-center shadow-[inset_0_20px_20px_rgba(0,0,0,0.5)]">
        <div className="container mx-auto px-8 text-center relative z-10 pt-20">
          <h2 className="text-4xl md:text-6xl font-headline font-black uppercase tracking-tighter mb-8">
            ¿Listo para el <span className="text-secondary-container">Siguiente Nivel</span>?
          </h2>
          <p className="text-xl text-neutral-400 mb-12 max-w-2xl mx-auto">
            No importa tu nivel actual, en Kansas Flag México tenemos un lugar para ti. Inscríbete hoy mismo y comienza tu camino a la gloria.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-6 pb-20">
            <Link href="/inscripciones" className="bg-primary hover:bg-primary-container px-12 py-5 font-headline font-black uppercase tracking-widest transition-all text-xl rounded-md cursor-pointer">
              Agenda una clase muestra
            </Link>
            <a href="https://wa.me/525539971470?text=Hola,%20me%20gustaría%20recibir%20más%20información%20sobre%20Kansas%20Flag%20México." target="_blank" rel="noopener noreferrer" className="border-2 border-white hover:bg-white hover:text-black px-12 py-5 font-headline font-black uppercase tracking-widest transition-all text-xl rounded-md flex items-center justify-center gap-3">
              Escríbenos por WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
