import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-zinc-100 dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 font-headline text-sm tracking-wide border-none">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 px-12 py-16 w-full">
        <div className="col-span-1 md:col-span-1">
          <div className="text-xl font-black text-zinc-900 dark:text-white mb-6 italic">
            KANSAS FLAG MÉXICO
          </div>
          <p className="mb-6 leading-relaxed">
            Elevando el nivel del Flag Football en México con estándares de campeonato profesional.
          </p>
          <div className="flex gap-4">
            <a className="h-10 w-10 bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center rounded-sm hover:text-white hover:bg-primary transition-all" href="#">
              <span className="material-symbols-outlined">share</span>
            </a>
            <a className="h-10 w-10 bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center rounded-sm hover:text-white hover:bg-primary transition-all" href="#">
              <span className="material-symbols-outlined">movie</span>
            </a>
          </div>
        </div>
        <div>
          <h5 className="text-zinc-900 dark:text-white font-black uppercase mb-6 italic tracking-widest">Academia</h5>
          <ul className="space-y-4">
            <li><Link className="hover:text-[#E31837] hover:underline decoration-2 underline-offset-4 transition-all" href="/sedes">Sedes</Link></li>
            <li><Link className="hover:text-[#E31837] hover:underline decoration-2 underline-offset-4 transition-all" href="/programas">Programas</Link></li>
            <li><Link className="hover:text-[#E31837] hover:underline decoration-2 underline-offset-4 transition-all" href="#">Coaches</Link></li>
            <li><a className="hover:text-[#E31837] hover:underline decoration-2 underline-offset-4 transition-all" href="#">Agenda</a></li>
          </ul>
        </div>
        <div>
          <h5 className="text-zinc-900 dark:text-white font-black uppercase mb-6 italic tracking-widest">Info</h5>
          <ul className="space-y-4">
            <li><a className="hover:text-[#E31837] hover:underline decoration-2 underline-offset-4 transition-all" href="#">Sponsors</a></li>
            <li><a className="hover:text-[#E31837] hover:underline decoration-2 underline-offset-4 transition-all" href="#">Aviso Privacidad</a></li>
            <li><a className="hover:text-[#E31837] hover:underline decoration-2 underline-offset-4 transition-all" href="#">Términos</a></li>
          </ul>
        </div>
        <div>
          <h5 className="text-zinc-900 dark:text-white font-black uppercase mb-6 italic tracking-widest">Contacto</h5>
          <p className="mb-4">info@kansasflagmx.com</p>
          <p className="mb-4">+52 55 1234 5678</p>
          <button className="w-full bg-primary text-white py-3 font-bold uppercase tracking-widest transition-all hover:bg-black active:scale-95 focus:ring-2 focus:ring-[#FFB81C]">
            Inscríbete Ahora
          </button>
        </div>
      </div>
      <div className="px-12 py-8 border-t border-zinc-200 dark:border-zinc-800 text-center text-xs opacity-60">
        © 2024 Kansas Flag México. The Kinetic Arena Performance. | Powered by ZENOX | AI-Driven Solutions
      </div>
    </footer>
  );
}
