import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 font-headline text-sm tracking-wide border-none">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 px-12 py-16 w-full max-w-5xl mx-auto">
        <div className="col-span-1 md:col-span-1">
          <div className="text-xl font-black text-zinc-900 dark:text-white mb-6 italic">
            KANSAS FLAG MÉXICO CDMX A.C.&reg;
          </div>
          <p className="mb-6 leading-relaxed">
            Elevando el nivel del Flag Football en México con estándares de campeonato profesional.
          </p>

        </div>
        <div>
          <h5 className="text-zinc-900 dark:text-white font-black uppercase mb-6 italic tracking-widest">Contacto</h5>
          <a href="mailto:kansasflagmx@gmail.com" className="mb-4 block hover:text-primary transition-colors">kansasflagmx@gmail.com</a>
          <p className="mb-4">+52 55 3997 1470</p>
          <button className="w-full bg-primary text-white py-3 font-bold uppercase tracking-widest transition-all hover:bg-black active:scale-95 focus:ring-2 focus:ring-[#FFB81C]">
            Inscríbete Ahora
          </button>
        </div>
      </div>
      <div className="px-12 py-8 border-t border-zinc-200 dark:border-zinc-800 text-center text-xs opacity-60 space-y-2">
        <p>© 2023 Kansas Flag México CDMX A.C.&reg;. | Powered by ZENOX | AI-Driven Solutions</p>
        <p>
          <a href="/Aviso-de-Privacidad-Kansas-Flag.docx" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors hover:underline">
            Aviso de Privacidad
          </a>
        </p>
      </div>
    </footer>
  );
}
