"use client";

import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";

export default function CredentialCard({ profile }: { profile: any }) {
  const [isQrExpanded, setIsQrExpanded] = useState(false);

  // Generate QR payload (we will use the profile ID to scan them later)
  const qrPayload = JSON.stringify({ userId: profile.id, type: "kansas_flag_id" });

  const avatar = profile.avatar_url || "https://ui-avatars.com/api/?name=" + (profile.nickname || profile.first_name || "Jugador") + "&background=E31837&color=fff";

  return (
    <div className="relative flex flex-col items-center max-w-sm mx-auto w-full">
      {/* 
        The Credential Card (Glassmorphism & Trading Card Style)
      */}
      <div className="relative w-full aspect-[2/3] bg-zinc-950 rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 flex flex-col items-center p-6 transition-transform hover:scale-[1.02] duration-300">
        
        {/* Background Gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#E31837]/20 via-black/80 to-black z-0"></div>
        <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/5 to-transparent z-0"></div>

        {/* Content */}
        <div className="relative z-10 w-full flex flex-col items-center h-full">
          
          {/* Header: Logo and Category */}
          <div className="w-full flex justify-between items-start mb-6">
            <img src="/images/logo.png" alt="Kansas Flag" className="h-10 object-contain drop-shadow-md" />
            <div className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/10">
              <span className="text-[10px] font-headline font-black text-white uppercase tracking-widest">
                {profile.category || "SIN CATEGORÍA"}
              </span>
            </div>
          </div>

          {/* Profile Picture */}
          <div className="relative mb-4">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#E31837] shadow-[0_0_30px_rgba(227,24,55,0.4)]">
              <img src={avatar} alt="Avatar" className="w-full h-full object-cover" />
            </div>
            {/* Player Number Badge */}
            {profile.player_number && (
              <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-white text-black rounded-full flex items-center justify-center font-headline font-black text-xl border-2 border-black shadow-lg">
                {profile.player_number}
              </div>
            )}
          </div>

          {/* Player Name & Nickname */}
          <div className="text-center mb-6 w-full">
            <h2 className="text-3xl font-headline font-black text-white uppercase tracking-tight leading-none mb-1 shadow-black drop-shadow-lg">
              {profile.nickname || profile.first_name || "JUGADOR"}
            </h2>
            <p className="text-xs font-body text-zinc-400 uppercase tracking-widest">
              {profile.first_name} {profile.last_name}
            </p>
          </div>

          {/* Stats / Details */}
          <div className="w-full grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white/5 rounded-xl p-2 text-center border border-white/5">
              <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-0.5">Rol</p>
              <p className="text-xs font-headline font-black text-white uppercase">{profile.role === 'admin' ? 'Administrador' : profile.role === 'staff' ? 'Staff' : 'Jugador'}</p>
            </div>
            <div className="bg-white/5 rounded-xl p-2 text-center border border-white/5">
              <p className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider mb-0.5">Altura</p>
              <p className="text-xs font-headline font-black text-white uppercase">{profile.height || "--"}</p>
            </div>
          </div>

          {/* Quote */}
          {profile.quote && (
            <div className="w-full mt-auto mb-6 text-center italic text-sm text-zinc-300 font-body px-4 opacity-80 relative">
              <span className="absolute -top-2 left-2 text-2xl text-[#E31837] opacity-50">"</span>
              {profile.quote}
              <span className="absolute -bottom-4 right-2 text-2xl text-[#E31837] opacity-50">"</span>
            </div>
          )}

          {/* Small Interactive QR Code at the bottom */}
          <div 
            className="mt-auto bg-white p-2 rounded-xl cursor-pointer hover:scale-105 transition-transform shadow-lg border-2 border-transparent hover:border-[#E31837]"
            onClick={() => setIsQrExpanded(true)}
          >
            <QRCodeSVG value={qrPayload} size={64} level="H" />
            <p className="text-[8px] font-bold text-center text-zinc-500 uppercase mt-1">Toca para ampliar</p>
          </div>

        </div>
      </div>

      {/* 
        Expanded QR Modal 
      */}
      {isQrExpanded && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-6"
          onClick={() => setIsQrExpanded(false)}
        >
          <div className="bg-white p-8 rounded-3xl flex flex-col items-center animate-in zoom-in duration-300">
            <h3 className="font-headline font-black uppercase text-xl mb-6 text-black tracking-widest text-center">
              Pase de Lista
            </h3>
            
            {/* The giant QR */}
            <QRCodeSVG value={qrPayload} size={250} level="H" includeMargin={true} />
            
            <p className="mt-6 text-sm text-zinc-500 text-center max-w-[250px]">
              Muestra este código al staff para registrar tu asistencia. Toca cualquier parte para cerrar.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
