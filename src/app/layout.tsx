import type { Metadata } from "next";
import { Epilogue, Inter } from "next/font/google";
import "./globals.css";
import TopNavBar from "@/components/TopNavBar";
import Footer from "@/components/Footer";

const epilogue = Epilogue({
  variable: "--font-epilogue",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Kansas Flag México | The Kinetic Arena",
  description: "Club y academia de flag football líder en CDMX y Edomex.",
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
        <Footer />
      </body>
    </html>
  );
}
