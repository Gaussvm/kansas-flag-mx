import type { Metadata } from "next";
import { Epilogue, Inter } from "next/font/google";
import "./globals.css";
import TopNavBar from "@/components/TopNavBar";
import Footer from "@/components/Footer";
import Script from "next/script";

const epilogue = Epilogue({
  variable: "--font-epilogue",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kansas Flag México | Tochito Club",
  description: "Club y academia de flag football líder en CDMX y Edomex.",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.png?v=2",
    shortcut: "/icon.png?v=2",
    apple: "/icon.png?v=2",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${epilogue.variable} ${inter.variable} antialiased light`}>
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col bg-surface font-body text-on-surface selection:bg-secondary-container">
        <TopNavBar />
        <main className="flex-grow pt-20">
          {children}
        </main>
        
        {/* Elfsight Chatbot */}
        <div className="elfsight-app-e9c21da5-9bee-4167-91cb-d4cc0ace0d19" data-elfsight-app-lazy></div>
        <Script src="https://elfsightcdn.com/platform.js" strategy="lazyOnload" />
        
        <Footer />
      </body>
    </html>
  );
}
