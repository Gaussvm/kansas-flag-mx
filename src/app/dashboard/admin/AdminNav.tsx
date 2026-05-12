"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminNav() {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard/admin", label: "Inicio", icon: "home" },
    { href: "/dashboard/admin/directorio", label: "Directorio", icon: "group" },
    { href: "/dashboard/admin/catalogos", label: "Catálogos", icon: "category" },
    { href: "/dashboard/admin/finanzas", label: "Finanzas", icon: "payments" },
  ];

  return (
    <div className="w-full md:w-64 flex-shrink-0 bg-black border-r border-white/10 p-4 md:p-6 flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible">
      {links.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl font-headline font-bold uppercase tracking-wider text-sm transition-all whitespace-nowrap ${
              isActive
                ? "bg-[#E31837] text-white shadow-[0_4px_14px_0_rgba(227,24,55,0.39)]"
                : "text-zinc-400 hover:text-white hover:bg-white/10"
            }`}
          >
            <span className="material-symbols-outlined text-xl">{link.icon}</span>
            <span className="hidden md:inline">{link.label}</span>
            <span className="inline md:hidden ml-1">{link.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
