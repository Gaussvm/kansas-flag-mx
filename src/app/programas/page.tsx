import Image from "next/image";
import Link from "next/link";

export default function Programas() {
  return (
    <>
      <section className="relative min-h-[716px] flex items-center overflow-hidden bg-surface-container-low -mt-20">
        <div className="absolute inset-0 z-0">
          <img className="w-full h-full object-cover opacity-20 slant-8" alt="high-intensity close-up" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHnJJr4j4kQ7szTSefyt61GTayK_h-VqHfXcAHj-mJLmKIlkkeoIKTjGlMMZTfos9deXWMnhpWKpXIcqyxOkynP5EZmiZYu7OrAyov_fx-6g1YkiqsV_8pbP0WQrYGNSOJ0UPLb5fIApJqTo-JrS1zQab-H-jfVC65swiL8M01EbClszI9YVLWuhvwXbIUilzaBflNUiKcYQTFwwDf27dceG4KPvoDDDNsxmMnw7ZtGEz-tPrXDW8brnY6QqqJ6pFQ5cAKleTs2Qs" />
          <div className="absolute inset-0 bg-gradient-to-r from-surface via-surface/80 to-transparent"></div>
        </div>
        <div className="container mx-auto px-8 relative z-10 pt-24 pb-24">
          <div className="max-w-4xl">
            <span className="inline-block bg-primary text-on-primary font-headline font-bold px-4 py-1 mb-6 text-sm tracking-widest uppercase italic">Elite Performance</span>
            <h1 className="text-6xl md:text-8xl font-black font-headline text-primary-container leading-none uppercase tracking-tighter mb-8 italic">
              Programas de <br /> <span className="text-on-background">Alto Rendimiento</span>
            </h1>
            <p className="text-xl md:text-2xl text-on-surface-variant font-body max-w-2xl leading-relaxed mb-10 border-l-4 border-secondary-container pl-6">
              No solo entrenamos atletas; forjamos el carácter de la próxima generación de campeones. Una metodología basada en los estándares de la élite profesional de Kansas City.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-gradient-to-br from-primary to-primary-container text-on-primary px-10 py-4 font-headline font-black uppercase tracking-tighter text-lg rounded-md hover:scale-105 transition-transform shadow-xl">
                Explorar Categorías
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-8 max-w-7xl mx-auto">
        <div className="mb-16">
          <h2 className="text-4xl font-black font-headline text-on-background uppercase tracking-tighter kinetic-border">Categorías de Formación</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-7 group relative overflow-hidden bg-surface-container-highest min-h-[400px]">
            <img className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" alt="child" src="/images/infantiles-real.jpg" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary-container/90 via-transparent to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8">
              <h3 className="text-3xl font-black font-headline text-white uppercase italic mb-2">Infantiles</h3>
              <p className="text-white/90 font-body mb-4 max-w-md">Fundamentos técnicos y trabajo en equipo para los futuros QB del país. <br /><span className="font-bold text-secondary-container">Edades: 5 a 12 años.</span></p>
              <Link href="/sedes" className="inline-block bg-white text-primary px-6 py-2 font-headline font-bold uppercase text-sm rounded-md hover:bg-secondary-container hover:text-on-secondary-container transition-colors">Ver horarios</Link>
            </div>
          </div>

          <div className="md:col-span-5 group relative overflow-hidden bg-surface-container-highest min-h-[400px]">
            <img className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" alt="female" src="/images/femenil-real.jpg" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8">
              <h3 className="text-3xl font-black font-headline text-white uppercase italic mb-2">Femenil</h3>
              <p className="text-white/90 font-body mb-4">Empoderamiento y destreza atlética en la liga de mayor crecimiento.<br /><span className="font-bold text-secondary-container">Edades: 13+ años.</span></p>
              <Link href="/sedes" className="inline-block bg-white text-primary px-6 py-2 font-headline font-bold uppercase text-sm rounded-md hover:bg-secondary-container hover:text-on-secondary-container transition-colors">Ver horarios</Link>
            </div>
          </div>

          <div className="md:col-span-5 group relative overflow-hidden bg-surface-container-highest min-h-[400px]">
            <img className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" alt="varonil" src="/images/varonil-real.jpg" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8">
              <h3 className="text-3xl font-black font-headline text-white uppercase italic mb-2">Varonil</h3>
              <p className="text-white/90 font-body mb-4">Competencia de alto nivel y perfeccionamiento estratégico.<br /><span className="font-bold text-secondary-container">Edades: 15+ años.</span></p>
              <Link href="/sedes" className="inline-block bg-white text-primary px-6 py-2 font-headline font-bold uppercase text-sm rounded-md hover:bg-secondary-container hover:text-on-secondary-container transition-colors">Ver horarios</Link>
            </div>
          </div>

          <div className="md:col-span-7 group relative overflow-hidden bg-surface-container-highest min-h-[400px]">
            <img className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700" alt="mixto" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB3LK0sETn-tz6t9iS01aT983lJm8535cXlHa6H4HRcv9A7-spehrQFBTbNclVIwWMpds6QHo14FAXXdaKoDLdUtZjUzH_CPXUp7QEG590J0p_qd4GPj1Yju8hf_bsj6xQ1hKf14sWGQ1SWEo0Jhzqk-qaq1OEe6GNPDV1J7u_lhKA5FZYpVeHqN1sEfZ29Xl5V41JzpakedlXUCbSeMqQJrw19gKJ0e614ctL5PcFQjQakvlMYYq9BLSMjEReYt4Rrh9ed3H4WnTU" />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-8">
              <h3 className="text-3xl font-black font-headline text-white uppercase italic mb-2">Mixto</h3>
              <p className="text-white/90 font-body mb-4">La integración perfecta de habilidades en un ambiente recreativo y competitivo.<br /><span className="font-bold text-secondary-container">Todas las edades.</span></p>
              <Link href="/sedes" className="inline-block bg-white text-primary px-6 py-2 font-headline font-bold uppercase text-sm rounded-md hover:bg-secondary-container hover:text-on-secondary-container transition-colors">Ver horarios</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-surface-container-low py-24 slant-8-rev">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black font-headline text-primary-container uppercase tracking-tighter italic">Nuestra Metodología</h2>
            <p className="text-on-surface-variant font-body mt-4 max-w-xl mx-auto">Basada en el éxito de los campeones, adaptada para el desarrollo integral del jugador.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center p-8 bg-surface rounded-xl shadow-sm hover:translate-y-[-8px] transition-transform duration-300">
              <div className="w-20 h-20 bg-primary-container text-white rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-4xl">sports</span>
              </div>
              <h4 className="text-2xl font-black font-headline uppercase mb-4 text-on-background">Disciplina de Élite</h4>
              <p className="text-on-surface-variant font-body">Entrenadores certificados que exigen el máximo rendimiento físico y mental en cada sesión.</p>
            </div>
            <div className="text-center p-8 bg-surface rounded-xl shadow-sm hover:translate-y-[-8px] transition-transform duration-300">
              <div className="w-20 h-20 bg-secondary-container text-on-secondary-container rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-4xl">timer</span>
              </div>
              <h4 className="text-2xl font-black font-headline uppercase mb-4 text-on-background">Velocidad y Agilidad</h4>
              <p className="text-on-surface-variant font-body">Sistemas de entrenamiento enfocados en la explosividad y el cambio de dirección dinámico.</p>
            </div>
            <div className="text-center p-8 bg-surface rounded-xl shadow-sm hover:translate-y-[-8px] transition-transform duration-300">
              <div className="w-20 h-20 bg-tertiary-container text-on-tertiary-container rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="material-symbols-outlined text-4xl">edit_note</span>
              </div>
              <h4 className="text-2xl font-black font-headline uppercase mb-4 text-on-background">IQ de Juego</h4>
              <p className="text-on-surface-variant font-body">Análisis táctico profundo para entender el juego más allá de la ejecución física.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 px-8 overflow-hidden relative">
        <div className="max-w-5xl mx-auto bg-primary text-on-primary p-12 md:p-20 relative z-10 rounded-lg shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-[#FFB81C]/10 slant-8 translate-x-12"></div>
          <div className="md:flex items-center justify-between gap-12">
            <div className="mb-8 md:mb-0">
              <h2 className="text-4xl md:text-6xl font-black font-headline uppercase italic leading-none mb-6">¿Listo para el <br /> siguiente nivel?</h2>
              <p className="text-xl font-body text-white/80 max-w-md">Únete a la academia más prestigiosa de Flag Football en México. Tu lugar en el equipo te espera.</p>
            </div>
            <div className="flex flex-col gap-4">
              <Link href="/inscripciones" className="text-center bg-secondary-container text-on-secondary-container px-12 py-5 font-headline font-black uppercase text-xl rounded-md hover:bg-white hover:text-primary transition-all shadow-xl scale-100 hover:scale-105 active:scale-95">
                Inscríbete hoy
              </Link>
              <p className="text-sm font-label uppercase tracking-widest text-center opacity-70 italic">Cupos limitados por temporada</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
