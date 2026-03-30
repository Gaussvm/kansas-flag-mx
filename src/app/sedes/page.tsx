import Link from "next/link";

export default function Sedes() {
  return (
    <>
      <section className="relative h-[716px] flex items-center overflow-hidden bg-surface-container-low -mt-20">
        <div className="absolute inset-0 z-0">
          <img alt="Football Training" className="w-full h-full object-cover opacity-40 mix-blend-multiply" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDH0izxrWeiMCS0ewUVvSXSOwlJsutxGehVcLMHQ7LxmUHnnc8FF6XMRnlLfGONJtg3VyjlqfUwBSChlGoSuaMs8n-awnoizJbKG0JpkGdVrK4wrZLtlqHFZsWBTrTwO7OOrU2spY10hFdIyRrAxPgI-0ok6f4sxa3AgYPfW7r8xvnroxBpzbt25VImaS3scI-giS4H3Re9ieLmBlVF-ltwzjPGiJuyhkD62_Qf9awFjuhLXWJb7M7RZpwdz2bZAFZzuwaWR-_d9Zo" />
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

      <section className="py-24 bg-surface" id="mapa">
        <div className="container mx-auto px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-headline font-black uppercase tracking-tighter text-on-background">
                Ubicaciones <span className="text-primary">Estratégicas</span>
              </h2>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-surface-container-highest rounded-full border border-outline-variant/20">
                <span className="w-3 h-3 bg-primary rounded-full"></span>
                <span className="text-sm font-bold uppercase tracking-wider">Activas</span>
              </div>
            </div>
          </div>
          <div className="relative w-full aspect-[21/9] rounded-xl overflow-hidden kinetic-shadow">
            <div className="absolute inset-0 bg-surface-variant flex items-center justify-center overflow-hidden">
              <img alt="Mexico Map View" className="w-full h-full object-cover grayscale opacity-30" src="https://lh3.googleusercontent.com/aida-public/AB6AXuByV5LOYOeLaGM5F6aRUJwoVH1UDeATw7GuKh3qnc1-HChRtTs9VV9Vshcmc-oqCfKmb0GWV1IXdQpZV4yOl4FBYspnmARs6nt8HL4W0HoAVhdKD1re_jexWeJAfCzBooPEAA82IZhwaCD_rH14ivAPeViWZn3eCC4EMLD0xloKDPcOauTFiSIYiSfz4ctgPvv2LgZXZom37IfDuKD21-sy4TC_7c95OIRfAEbwcV2GmrWZsj3dVdhxu4nAf6bcfq8CMlgFCPgFCwc" />
              <div className="absolute top-[60%] left-[45%] group cursor-pointer">
                <div className="bg-primary text-white p-3 rounded-full shadow-xl animate-bounce">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                </div>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-48 bg-surface-container-lowest p-4 rounded-lg shadow-2xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-50">
                  <h4 className="font-headline font-bold text-primary mb-1">Módulo Deportivo</h4>
                  <p className="text-xs text-on-surface-variant">Sede Mimosa</p>
                </div>
              </div>
              <div className="absolute top-[45%] left-[48%] group cursor-pointer">
                <div className="bg-primary text-white p-3 rounded-full shadow-xl">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                </div>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-48 bg-surface-container-lowest p-4 rounded-lg shadow-2xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-50">
                  <h4 className="font-headline font-bold text-primary mb-1">Francisco Sarabia</h4>
                  <p className="text-xs text-on-surface-variant">Sede Azcapotzalco</p>
                </div>
              </div>
              <div className="absolute top-[30%] left-[35%] group cursor-pointer">
                <div className="bg-primary text-white p-3 rounded-full shadow-xl">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                </div>
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 w-48 bg-surface-container-lowest p-4 rounded-lg shadow-2xl opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-50">
                  <h4 className="font-headline font-bold text-primary mb-1">Cancha Principal</h4>
                  <p className="text-xs text-on-surface-variant">Sede Metepec</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-surface-container-low relative overflow-hidden">
        <div className="container mx-auto px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/10 group hover:border-primary/50 transition-all">
              <div className="h-48 overflow-hidden relative bg-zinc-800">
                <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Sede Mimosa" src="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1600&auto=format&fit=crop" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-4 left-6">
                  <h3 className="text-white text-2xl font-headline font-black uppercase tracking-tight">Sede Mimosa</h3>
                </div>
              </div>
              <div className="p-8">
                <div className="space-y-6">
                  <div className="flex items-start gap-4 h-16">
                    <span className="material-symbols-outlined text-primary mt-1">pin_drop</span>
                    <p className="text-sm font-body font-medium text-on-surface-variant">Kansas Flag Mexico, Módulo Deportivo Mimosa.</p>
                  </div>
                  <div className="bg-surface p-4 rounded-lg">
                    <h4 className="text-xs font-black uppercase text-primary tracking-widest mb-3">Horarios de Entrenamiento</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm border-b border-outline-variant/10 pb-2">
                         <span className="font-bold">Por definir</span>
                         <span className="text-primary font-black">Pronto</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-bold">Días</span>
                        <span className="text-on-surface-variant">Pendientes</span>
                      </div>
                    </div>
                  </div>
                  <a href="https://maps.app.goo.gl/iStQpXvZmD2Cd2pdA" target="_blank" rel="noopener noreferrer" className="w-full bg-secondary-container text-on-secondary-container py-4 font-headline font-black uppercase tracking-widest hover:brightness-95 transition-all flex items-center justify-center gap-2 rounded-md kinetic-shadow">
                    Cómo llegar
                    <span className="material-symbols-outlined">directions</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/10 group hover:border-primary/50 transition-all">
              <div className="h-48 overflow-hidden relative bg-zinc-800">
                <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Sede Azcapotzalco" src="https://images.unsplash.com/photo-1551958219-acbc608c6377?q=80&w=1600&auto=format&fit=crop" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-4 left-6">
                  <h3 className="text-white text-2xl font-headline font-black uppercase tracking-tight">Azcapotzalco</h3>
                </div>
              </div>
              <div className="p-8">
                <div className="space-y-6">
                  <div className="flex items-start gap-4 h-16">
                    <span className="material-symbols-outlined text-primary mt-1">pin_drop</span>
                    <p className="text-sm font-body font-medium text-on-surface-variant">Kansas Flag Mexico, Francisco Sarabia, Azcapo.</p>
                  </div>
                  <div className="bg-surface p-4 rounded-lg">
                    <h4 className="text-xs font-black uppercase text-primary tracking-widest mb-3">Horarios de Entrenamiento</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm border-b border-outline-variant/10 pb-2">
                         <span className="font-bold">Por definir</span>
                         <span className="text-primary font-black">Pronto</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-bold">Días</span>
                        <span className="text-on-surface-variant">Pendientes</span>
                      </div>
                    </div>
                  </div>
                  <a href="https://maps.app.goo.gl/Lw7ZvERPuE9vm6Ly6" target="_blank" rel="noopener noreferrer" className="w-full bg-secondary-container text-on-secondary-container py-4 font-headline font-black uppercase tracking-widest hover:brightness-95 transition-all flex items-center justify-center gap-2 rounded-md kinetic-shadow">
                    Cómo llegar
                    <span className="material-symbols-outlined">directions</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-lowest rounded-xl overflow-hidden border border-outline-variant/10 group hover:border-primary/50 transition-all">
              <div className="h-48 overflow-hidden relative bg-zinc-800">
                <img className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Sede Metepec" src="https://images.unsplash.com/photo-1601601117188-751bd0a88062?q=80&w=1600&auto=format&fit=crop" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
                <div className="absolute bottom-4 left-6">
                  <h3 className="text-white text-2xl font-headline font-black uppercase tracking-tight">Metepec</h3>
                </div>
              </div>
              <div className="p-8">
                <div className="space-y-6">
                  <div className="flex items-start gap-4 h-16">
                    <span className="material-symbols-outlined text-primary mt-1">pin_drop</span>
                    <p className="text-sm font-body font-medium text-on-surface-variant">Kansas Flag Metepec, Instalaciones Principales.</p>
                  </div>
                  <div className="bg-surface p-4 rounded-lg">
                    <h4 className="text-xs font-black uppercase text-primary tracking-widest mb-3">Horarios de Entrenamiento</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-sm border-b border-outline-variant/10 pb-2">
                         <span className="font-bold">Por definir</span>
                         <span className="text-primary font-black">Pronto</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-bold">Días</span>
                        <span className="text-on-surface-variant">Pendientes</span>
                      </div>
                    </div>
                  </div>
                  <a href="https://maps.app.goo.gl/qHvc5eE2yTNoUiMc8" target="_blank" rel="noopener noreferrer" className="w-full bg-secondary-container text-on-secondary-container py-4 font-headline font-black uppercase tracking-widest hover:brightness-95 transition-all flex items-center justify-center gap-2 rounded-md kinetic-shadow">
                    Cómo llegar
                    <span className="material-symbols-outlined">directions</span>
                  </a>
                </div>
              </div>
            </div>
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
            <button className="border-2 border-white hover:bg-white hover:text-black px-12 py-5 font-headline font-black uppercase tracking-widest transition-all text-xl rounded-md">
              Descargar Folleto
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
