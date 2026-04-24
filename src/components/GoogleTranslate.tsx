"use client";

import { useEffect, useState } from "react";

export default function GoogleTranslate() {
  const [currentLang, setCurrentLang] = useState("es");

  useEffect(() => {
    // 0. Forzar inicio en Español siempre: Purgar cookies previas de google al entrar o recargar (F5)
    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = `googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; domain=.${window.location.hostname}; path=/;`;

    // 1. Definimos la función global para Google
    (window as any).googleTranslateElementInit = function () {
      if ((window as any).google && (window as any).google.translate) {
        new (window as any).google.translate.TranslateElement(
          {
            pageLanguage: "es",
            includedLanguages: "en,es",
            autoDisplay: false,
          },
          "google_translate_element"
        );
      }
    };

    // Añadimos el script de google si no existe
    if (!document.getElementById("google-translate-script")) {
      const addScript = document.createElement("script");
      addScript.id = "google-translate-script";
      addScript.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      addScript.async = true;
      document.body.appendChild(addScript);
    }
  }, []);

  const handleLanguageChange = (lang: string) => {
    setCurrentLang(lang);
    
    // 1. Buscamos el verdadero selector oculto de Google (ahora garantizado por no tener restriccion de layout)
    const googleSelect = document.querySelector(".goog-te-combo") as HTMLSelectElement;
    
    if (googleSelect) {
      // Para volver al español a veces google usa string vacío en vez de "es" si detecta que es el root.
      const hasSpanishOption = Array.from(googleSelect.options).some(opt => opt.value === 'es');
      googleSelect.value = (lang === 'es' && !hasSpanishOption) ? '' : lang;
      
      // Google requiere que el evento burbujee
      googleSelect.dispatchEvent(new Event("change", { bubbles: true, cancelable: true })); 
    } 
    
    // 2. Método Fallback Invencible (Porcelana): Sobrescribir la cookie raíz de Google y refrescar.
    // Esto garantiza 100% de fiabilidad en todos los navegadores si DOM element es purgado o retrasado.
    setTimeout(() => {
      // Si la capa visible no se ha traducido (Google inyecta font tags), aplicamos el plan de fuerza bruta
      if (!document.querySelector('html')?.classList.contains('translated-ltr') && lang === 'en') {
        const translateCookieStr = `/es/${lang}`;
        document.cookie = `googtrans=${translateCookieStr}; path=/`;
        document.cookie = `googtrans=${translateCookieStr}; domain=.${window.location.hostname}; path=/`;
        window.location.reload();
      } else if (lang === 'es' && document.querySelector('html')?.classList.contains('translated-ltr')) {
         document.cookie = `googtrans=/es/es; path=/`;
         document.cookie = `googtrans=/es/es; domain=.${window.location.hostname}; path=/`;
         window.location.reload();
      }
    }, 300);
  };

  return (
    <div className="relative group flex items-center gap-2">
      {/* Contenedor presente en el DOM pero dimensiones zero para que Google lo inyecte sin romperlo visualmente */}
      <div className="absolute opacity-0 w-0 h-0 overflow-hidden pointer-events-none">
        <div id="google_translate_element"></div>
      </div>
      
      {/* UI Custom Premium - Toggle Switch */}
      <div 
        translate="no"
        onClick={() => handleLanguageChange(currentLang === 'es' ? 'en' : 'es')}
        className="notranslate relative flex items-center bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-1 rounded-full cursor-pointer select-none shadow-inner w-[86px] h-[36px] hover:border-[#E31837] dark:hover:border-[#E31837] transition-colors"
      >
        {/* Thumb deslizante */}
        <div className={`absolute w-[38px] h-[28px] left-[3px] bg-white dark:bg-zinc-800 shadow-[0_2px_8px_rgba(0,0,0,0.12)] rounded-full transition-transform duration-300 ease-out ${currentLang === 'en' ? 'translate-x-[40px]' : 'translate-x-0'}`}></div>
        
        {/* Textos con icono estático central imaginario y labels */}
        <div className="relative z-10 flex w-full">
          <span className={`w-1/2 flex items-center justify-center text-[11px] font-headline font-black tracking-widest transition-colors duration-300 ${currentLang === 'es' ? 'text-[#E31837]' : 'text-zinc-400 dark:text-zinc-600'}`}>
            ES
          </span>
          <span className={`w-1/2 flex items-center justify-center text-[11px] font-headline font-black tracking-widest transition-colors duration-300 ${currentLang === 'en' ? 'text-[#E31837]' : 'text-zinc-400 dark:text-zinc-600'}`}>
            EN
          </span>
        </div>
      </div>
    </div>
  );
}
