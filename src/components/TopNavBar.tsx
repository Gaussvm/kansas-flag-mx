"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function TopNavBar() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const getLinkClasses = (path: string) => {
    const isActive = pathname === path;
    const baseClasses = "font-headline uppercase font-black tracking-tighter transition-all border-b-4";
    if (isActive) {
      return `${baseClasses} text-[#E31837] border-[#E31837] pb-1 -skew-x-6`;
    }
    return `${baseClasses} text-zinc-800 dark:text-zinc-200 border-transparent hover:text-[#E31837] hover:border-[#E31837]/30 pb-1`;
  };

  return (
    <nav className="fixed top-0 z-50 w-full bg-white dark:bg-zinc-950 transition-colors border-none shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)]">
      <div className="max-w-screen-2xl mx-auto flex justify-between items-center px-4 md:px-8 h-20">
        <div className="flex items-center gap-8">
          <div className="text-2xl font-black italic text-[#E31837] font-headline uppercase tracking-tighter">
            <Link href="/" onClick={() => setIsMenuOpen(false)}>
              KANSAS FLAG
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex gap-6 items-center">
            <Link className={getLinkClasses("/")} href="/">Inicio</Link>
            <Link className={getLinkClasses("/programas")} href="/programas">Programas</Link>
            <Link className={getLinkClasses("/inscripciones")} href="/inscripciones">Inscripciones</Link>
            <Link className={getLinkClasses("/sedes")} href="/sedes">Sedes</Link>
          </div>
        </div>

        {/* Desktop Button */}
        <div className="hidden lg:flex items-center gap-4">
          <Link href="/inscripciones" className="bg-[#E31837] text-white px-6 py-3 font-headline uppercase font-black tracking-tighter hover:bg-black active:scale-95 transform transition-all duration-300">
            Agendar Prueba
          </Link>
        </div>

        {/* Mobile Toggle Button */}
        <button 
          className="lg:hidden flex items-center justify-center p-2 text-zinc-900 dark:text-white focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle mobile menu"
        >
          <span className="material-symbols-outlined text-3xl">
            {isMenuOpen ? "close" : "menu"}
          </span>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="lg:hidden absolute top-20 left-0 w-full bg-white dark:bg-zinc-950 border-t border-zinc-100 dark:border-zinc-900 shadow-2xl flex flex-col px-6 py-8 gap-6 max-h-[calc(100vh-80px)] overflow-y-auto">
          <Link onClick={() => setIsMenuOpen(false)} className={getLinkClasses("/")} href="/">Inicio</Link>
          <Link onClick={() => setIsMenuOpen(false)} className={getLinkClasses("/programas")} href="/programas">Programas</Link>
          <Link onClick={() => setIsMenuOpen(false)} className={getLinkClasses("/sedes")} href="/sedes">Sedes</Link>
          <Link onClick={() => setIsMenuOpen(false)} className={getLinkClasses("/inscripciones")} href="/inscripciones">Inscripciones</Link>
          
          <div className="pt-4 mt-2 border-t border-zinc-100 dark:border-zinc-900">
            <Link 
              onClick={() => setIsMenuOpen(false)} 
              href="/inscripciones" 
              className="block w-full text-center bg-[#E31837] text-white px-6 py-4 font-headline uppercase font-black tracking-widest active:scale-95 transform transition-all"
            >
              Agendar Prueba
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
