"use client";

import { usePathname } from "next/navigation";
import TopNavBar from "@/components/TopNavBar";
import Footer from "@/components/Footer";
import React from "react";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Si estamos en el dashboard o login, no mostramos el nav ni footer público
  const isPortal = pathname?.startsWith("/dashboard") || pathname?.startsWith("/login") || pathname?.startsWith("/auth");

  return (
    <>
      {!isPortal && <TopNavBar />}
      <main className={`flex-grow w-full overflow-x-hidden ${!isPortal ? 'pt-20' : ''}`}>
        {children}
      </main>
      {!isPortal && (
        <>
          <div className="elfsight-app-e9c21da5-9bee-4167-91cb-d4cc0ace0d19" data-elfsight-app-lazy></div>
          <Footer />
        </>
      )}
    </>
  );
}
