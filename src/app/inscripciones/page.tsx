"use client";

import Link from "next/link";
import { useState } from "react";

export default function Inscripciones() {
  const [formStatus, setFormStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus("loading");
    
    const formData = new FormData(e.currentTarget);
    formData.append("access_key", "4042bedd-c1d9-4e2a-9be4-4b2a8edb5a4b");
    formData.append("subject", "🔥 Nueva Inscripción de Prueba - Kansas Flag");
    formData.append("from_name", "Kansas Flag Website");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      
      if (data.success) {
        setFormStatus("success");
        e.currentTarget.reset();
      } else {
        setFormStatus("error");
      }
    } catch (error) {
      console.error(error);
      setFormStatus("error");
    }
  };

  return (
    <>
      <section className="relative min-h-[716px] flex items-center overflow-hidden bg-surface-container-low pt-12 pb-24 -mt-20">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-surface-container-low via-surface-container-low/80 to-transparent z-10"></div>
          <img className="w-full h-full object-cover object-right opacity-40 scale-110" alt="team huddle" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBn-XhKbUFUEbQ3AqVKEuFwMprr9NaVurWOr6Kyn707gUBRfLE6jET_uMBY9DyfD7f7BoFK7ZhYQY0J-imMmVOnTvZudG0FqMPMSBT2ilOABerS3AbWFBymfQZdFuP3kiIzuu4mTYyJ2elQIehswQAS1PuPY_lRl4mse7GdgVvyMPpWODw1fOgpFGfMr0fT0pNM72eSH7V4aQL6pXRDassT2cPtnFsg28hoGWWcQsQJmrfzb4I7zqE0Oy-0NOFoMmLoV4JBj9MN-Sg" />
        </div>
        <div className="max-w-screen-2xl mx-auto px-8 relative z-20 w-full pt-20">
          <div className="max-w-3xl">
            <span className="inline-block bg-secondary-container text-on-secondary-container px-4 py-1 mb-6 font-headline font-extrabold uppercase tracking-widest slant-15">
              The Dynasty Starts Here
            </span>
            <h1 className="text-7xl md:text-9xl font-headline font-black text-primary leading-[0.9] uppercase tracking-tighter mb-8 italic">
              Únete a la <span className="text-on-surface">Dinastía</span>
            </h1>
            <p className="text-xl md:text-2xl text-on-surface-variant font-body max-w-xl mb-12 border-l-8 border-primary pl-6">
              Proceso de Inscripción: Forjando el futuro del Flag Football en México con estándares de élite.
            </p>
            <div className="flex flex-wrap gap-4">
              <a className="bg-gradient-to-br from-primary to-primary-container text-on-primary px-10 py-4 font-headline font-black uppercase tracking-widest rounded-lg shadow-xl hover:shadow-primary/20 transition-all flex items-center gap-2" href="#form">
                Comenzar Registro <span className="material-symbols-outlined">arrow_forward</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-surface px-8" id="form">
        <div className="max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 space-y-8">
            <h2 className="text-4xl font-headline font-black uppercase tracking-tighter mb-12">Ruta al <span className="text-primary">Éxito</span></h2>
            <div className="space-y-6">
              <div className="flex items-start gap-6 p-6 bg-surface-container-highest rounded-xl border-l-4 border-secondary transition-all hover:translate-x-2">
                <span className="text-4xl font-headline font-black text-secondary/30">01</span>
                <div>
                  <h3 className="text-xl font-headline font-black uppercase tracking-tight">Agendar clase</h3>
                  <p className="text-on-surface-variant mt-2">Vive la experiencia Kansas Flag en una sesión de prueba personalizada.</p>
                </div>
              </div>
              <div className="flex items-start gap-6 p-6 bg-surface-container-highest rounded-xl border-l-4 border-primary transition-all hover:translate-x-2">
                <span className="text-4xl font-headline font-black text-primary/30">02</span>
                <div>
                  <h3 className="text-xl font-headline font-black uppercase tracking-tight">Entrega de documentos</h3>
                  <p className="text-on-surface-variant mt-2">Validación de identidad y aptitud física para garantizar la seguridad.</p>
                </div>
              </div>
              <div className="flex items-start gap-6 p-6 bg-surface-container-highest rounded-xl border-l-4 border-secondary transition-all hover:translate-x-2">
                <span className="text-4xl font-headline font-black text-secondary/30">03</span>
                <div>
                  <h3 className="text-xl font-headline font-black uppercase tracking-tight">Pago de kit</h3>
                  <p className="text-on-surface-variant mt-2">Recibe tu armadura oficial y forma parte activa de la legión.</p>
                </div>
              </div>
            </div>

            <div className="mt-12 p-8 bg-neutral-950 text-white rounded-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-3xl transition-all group-hover:scale-150"></div>
              <div className="relative z-10">
                <h4 className="text-3xl font-headline font-black uppercase tracking-tighter text-secondary-container">Oferta Exclusiva</h4>
                <p className="text-5xl font-headline font-black mt-4 mb-2 tracking-tighter uppercase italic">Primer mes con kit de regalo</p>
                <p className="text-neutral-400 font-body">Válido para inscripciones nuevas antes de fin de mes. Aplican restricciones.</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-surface-container-low p-12 rounded-xl border-r-4 border-b-4 border-secondary-container relative">
            <div className="mb-10">
              <h2 className="text-4xl font-headline font-black uppercase tracking-tighter mb-2">Formulario de <span className="text-primary">Captura</span></h2>
              <p className="text-on-surface-variant">Completa los datos para iniciar tu proceso de reclutamiento.</p>
            </div>
            
            {formStatus === "success" ? (
              <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-8 text-center animate-in fade-in slide-in-from-bottom-4">
                <span className="material-symbols-outlined text-6xl text-green-500 mb-4">check_circle</span>
                <h3 className="text-2xl font-headline font-black uppercase tracking-tighter text-green-600 dark:text-green-400 mb-2">¡Solicitud Enviada!</h3>
                <p className="text-on-surface-variant font-body mb-6">Hemos recibido tus datos correctamente. Nuestros coaches se pondrán en contacto contigo muy pronto para agendar tu clase de prueba.</p>
                <button 
                  onClick={() => setFormStatus("idle")}
                  className="bg-surface-container-highest text-on-surface px-6 py-2 rounded-md hover:bg-surface-container transition-all font-bold"
                >
                  Enviar otra solicitud
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8 relative">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="relative border-b-2 border-outline-variant hover:border-primary focus-within:border-primary pb-2 transition-all">
                    <label className="block text-xs font-headline font-bold uppercase tracking-widest text-primary mb-2">Nombre del Jugador</label>
                    <input name="Nombre" required className="w-full bg-transparent border-0 focus:ring-0 transition-all font-body text-lg py-2 outline-none" placeholder="Nombre completo" type="text" />
                  </div>
                  <div className="relative border-b-2 border-outline-variant hover:border-primary focus-within:border-primary pb-2 transition-all">
                    <label className="block text-xs font-headline font-bold uppercase tracking-widest text-primary mb-2">Edad</label>
                    <input name="Edad" required min="5" max="60" className="w-full bg-transparent border-0 focus:ring-0 transition-all font-body text-lg py-2 outline-none" placeholder="Ej: 14" type="number" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="relative border-b-2 border-outline-variant hover:border-primary focus-within:border-primary pb-2 transition-all">
                    <label className="block text-xs font-headline font-bold uppercase tracking-widest text-primary mb-2">Sede de Interés</label>
                    <select name="Sede" required className="w-full bg-transparent border-0 focus:ring-0 transition-all font-body text-lg py-2 appearance-none outline-none dark:bg-zinc-950">
                      <option value="">Seleccionar sede</option>
                      <option value="Sede Mimosa">Sede Mimosa</option>
                      <option value="Sede Azcapotzalco">Sede Azcapotzalco</option>
                      <option value="Sede Metepec">Sede Metepec</option>
                    </select>
                  </div>
                  <div className="relative border-b-2 border-outline-variant hover:border-primary focus-within:border-primary pb-2 transition-all">
                    <label className="block text-xs font-headline font-bold uppercase tracking-widest text-primary mb-2">Teléfono del Tutor (o personal)</label>
                    <input name="Telefono" required className="w-full bg-transparent border-0 focus:ring-0 transition-all font-body text-lg py-2 outline-none" placeholder="55 1234 5678" type="tel" />
                  </div>
                </div>
                
                {formStatus === "error" && (
                  <p className="text-red-500 font-bold text-sm bg-red-500/10 p-3 rounded-md border border-red-500/20">
                    Hubo un problema al enviar tu solicitud. Intenta de nuevo.
                  </p>
                )}

                <div className="pt-8">
                  <button 
                    disabled={formStatus === "loading"}
                    className="w-full bg-primary text-on-primary py-5 font-headline font-black uppercase tracking-widest rounded-lg transition-all hover:bg-on-primary-fixed-variant shadow-lg hover:shadow-primary/40 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2" 
                    type="submit"
                  >
                    {formStatus === "loading" ? (
                      <>
                        <span className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></span>
                        Enviando...
                      </>
                    ) : (
                      "Enviar Solicitud de Inscripción"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      <section className="py-24 bg-surface-container-highest px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl font-headline font-black text-center uppercase tracking-tighter mb-16 italic">Preguntas <span className="text-primary">Frecuentes</span></h2>
          <div className="space-y-4">
            <details className="group bg-surface rounded-xl p-6 transition-all border-b-2 border-transparent open:border-primary cursor-pointer">
              <summary className="flex justify-between items-center list-none outline-none">
                <h3 className="text-xl font-headline font-bold uppercase tracking-tight">¿Qué incluye el kit de regalo?</h3>
                <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
              </summary>
              <div className="mt-4 text-on-surface-variant font-body leading-relaxed border-t border-outline-variant/30 pt-4">
                El kit oficial incluye el jersey de juego sublimado con tecnología de alto rendimiento, shorts deportivos coordinados y calcetas oficiales de la liga.
              </div>
            </details>
            <details className="group bg-surface rounded-xl p-6 transition-all border-b-2 border-transparent open:border-primary cursor-pointer">
              <summary className="flex justify-between items-center list-none outline-none">
                <h3 className="text-xl font-headline font-bold uppercase tracking-tight">¿Necesito experiencia previa?</h3>
                <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
              </summary>
              <div className="mt-4 text-on-surface-variant font-body leading-relaxed border-t border-outline-variant/30 pt-4">
                No, contamos con programas desde nivel básico hasta alto rendimiento. Nuestros coaches están certificados para enseñar técnica desde cero.
              </div>
            </details>
            <details className="group bg-surface rounded-xl p-6 transition-all border-b-2 border-transparent open:border-primary cursor-pointer">
              <summary className="flex justify-between items-center list-none outline-none">
                <h3 className="text-xl font-headline font-bold uppercase tracking-tight">¿Cuáles son los horarios de entrenamiento?</h3>
                <span className="material-symbols-outlined transition-transform group-open:rotate-180">expand_more</span>
              </summary>
              <div className="mt-4 text-on-surface-variant font-body leading-relaxed border-t border-outline-variant/30 pt-4">
                Dependen de la sede y categoría, pero generalmente entrenamos de Lunes a Jueves entre 4:00 PM y 8:00 PM, con juegos los fines de semana.
              </div>
            </details>
          </div>
        </div>
      </section>

      <section className="h-96 relative w-full overflow-hidden">
        <img className="w-full h-full object-cover" alt="sports field" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCUPzQvXNFq3tfPc7XKArd98Jx2EYbN9jWwob5La_XFB_3On3GPcR8nY-Be3LtjHNbfAliozuXvhnEcJ7zLdwuto7BpcD7Fzowteo_ILj7zbCKNqxCXN3bbp8rnyMeaBua5oke3LqoK-HEDhR_E-6WyFAZJYQlhYr-WZy7FTZAdEvcSGkL_DA_r8BrcGlNAqPOVgqcfo0RS9W_IRVwHbzSZpEXHgB7t5ig6JwXwfhUscAfxoLtiqUVREpQUdRJPbVjQxGISMynqOBI" />
        <div className="absolute inset-0 bg-primary/60 mix-blend-multiply"></div>
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <div className="px-8">
            <h2 className="text-white text-4xl md:text-6xl font-headline font-black uppercase italic tracking-tighter mb-4">Visita Nuestras Sedes</h2>
            <Link href="/sedes" className="block mt-4">
              <button className="bg-secondary-container text-on-secondary-container px-10 py-4 font-headline font-bold uppercase text-xl rounded-md hover:bg-white hover:text-primary transition-all shadow-xl">Ver Sedes</button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
