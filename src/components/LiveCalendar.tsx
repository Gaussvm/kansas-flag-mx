"use client";

import { useMemo, useState } from "react";

interface Match {
  equipo: string;
  fecha: string;
  fechaExacta: string;
  ligaStr?: string;
  linkEnvivo?: string;
}

export default function LiveCalendar({ matches }: { matches: Match[] }) {
  // Encontramos el mes actual
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null);

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  
  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
    setSelectedDateKey(null);
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
    setSelectedDateKey(null);
  };
  
  // Procesamos qué días tienen partido (asumiendo formato YYYY-MM-DD)
  const matchMap = useMemo(() => {
    const map = new Map<string, Match[]>();
    matches.forEach(m => {
       if (m.fechaExacta) {
         let dateKey = "";
         const parts = m.fechaExacta.split('-');
         if (parts.length === 3) {
           dateKey = `${parts[0]}-${parts[1]}-${parts[2]}`;
         } else if (m.fechaExacta.includes('/')) {
           const slashParts = m.fechaExacta.split('/');
           if (slashParts.length === 3) {
             dateKey = `${slashParts[2]}-${slashParts[1]}-${slashParts[0]}`; // convert to YYYY-MM-DD
           }
         }
         
         if (dateKey) {
            const existing = map.get(dateKey) || [];
            map.set(dateKey, [...existing, m]);
         }
       }
    });
    return map;
  }, [matches]);

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // 0 es Domingo
  
  const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

  return (
    <div className="bg-white/60 backdrop-blur-3xl border border-white/60 rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all flex flex-col relative group w-full max-w-md mx-auto lg:max-w-none">
      {/* Wrapper para el resplandor para no cortar tooltips externos */}
      <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-tr from-[#E31837]/20 to-[#FFB81C]/20 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
      </div>

      <div className="flex justify-between items-center px-1 mb-6 z-10 w-full select-none">
        <div className="flex items-center gap-2 md:gap-3">
          <button onClick={handlePrevMonth} className="hover:text-primary transition-colors material-symbols-outlined text-zinc-500 hover:scale-110 w-8 h-8 flex items-center justify-center cursor-pointer rounded-full bg-white shadow-sm border border-zinc-100">chevron_left</button>
          <h4 className="font-headline font-black text-xl md:text-2xl text-zinc-900 uppercase tracking-wider min-w-[150px] text-center">
            {monthNames[currentMonth]} <span className="text-zinc-400 font-bold">{currentYear}</span>
          </h4>
          <button onClick={handleNextMonth} className="hover:text-primary transition-colors material-symbols-outlined text-zinc-500 hover:scale-110 w-8 h-8 flex items-center justify-center cursor-pointer rounded-full bg-white shadow-sm border border-zinc-100">chevron_right</button>
        </div>
        <div 
          onClick={() => {
            setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
            setSelectedDateKey(null);
          }} 
          className="bg-white w-10 h-10 rounded-xl flex items-center justify-center shadow-sm border border-zinc-100 cursor-pointer hover:bg-zinc-50 transition-colors"
          title="Ir al mes actual"
        >
          <span className="material-symbols-outlined text-primary">calendar_month</span>
        </div>
      </div>

      {/* Grid Calendario */}
      <div className="grid grid-cols-7 gap-1 md:gap-1.5 text-center z-10 w-full pb-2 relative">
        {/* Días de la semana */}
        {["Do", "Lu", "Ma", "Mi", "Ju", "Vi", "Sa"].map(day => (
          <div key={day} className="text-[10px] md:text-xs font-bold text-zinc-400 uppercase tracking-widest pb-1 md:pb-2 border-b border-zinc-100">{day}</div>
        ))}
        
        {/* Espacios vacíos de inicio de mes */}
        {Array.from({ length: firstDayIndex }).map((_, i) => (
          <div key={`empty-${i}`} className="p-1 md:p-2"></div>
        ))}
        
        {/* Días del mes */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const colIndex = (firstDayIndex + i) % 7;
          const day = i + 1;
          const monthStr = String(currentMonth + 1).padStart(2, '0');
          const dayStr = String(day).padStart(2, '0');
          const dateString = `${currentYear}-${monthStr}-${dayStr}`;
          
          const dayMatches = matchMap.get(dateString);
          const hasMatch = !!dayMatches;
          const isToday = today.getDate() === day && today.getMonth() === currentMonth && today.getFullYear() === currentYear;
          const isSelected = selectedDateKey === dateString;

          // Lógica de alineación para tooltips en Desktop
          const tooltipAlignClass = colIndex < 2 ? "left-0" : colIndex > 4 ? "right-0" : "left-1/2 -translate-x-1/2";
          const arrowAlignClass = colIndex < 2 ? "left-4" : colIndex > 4 ? "right-4" : "left-1/2 -translate-x-1/2";

          return (
            <div 
              key={day} 
              onClick={() => hasMatch && setSelectedDateKey(isSelected ? null : dateString)}
              className="relative flex items-center justify-center h-10 md:h-12 w-full flex-col mt-1 group/day cursor-pointer"
            >
              <span className={`text-sm font-body z-10 ${hasMatch ? 'text-primary font-bold' : isToday ? 'text-zinc-900 font-bold' : 'text-zinc-500'}`}>
                {day}
              </span>
              
              {/* Highlight Partido */}
              {hasMatch && (
                <div className={`absolute inset-0 border ${isSelected ? 'bg-primary/10 border-primary shadow-[0_4px_15px_rgba(227,24,55,0.3)] scale-110' : isToday ? 'bg-[#FFB81C]/20 border-primary shadow-[0_2px_10px_rgba(227,24,55,0.15)]' : 'bg-white border-primary shadow-[0_2px_10px_rgba(227,24,55,0.15)]'} rounded-xl flex items-end justify-center pb-1 transition-all`}>
                   <div className="w-1.5 h-1.5 rounded-full bg-primary mt-auto"></div>
                </div>
              )}

              {/* Tooltip Hover Flotante (Solo Desktop) */}
              {hasMatch && dayMatches && dayMatches.length > 0 && (
                <div className={`hidden md:block absolute bottom-full mb-3 min-w-[220px] w-max max-w-[280px] ${tooltipAlignClass} bg-white/95 backdrop-blur-xl border border-zinc-200 text-zinc-900 text-xs rounded-2xl p-4 opacity-0 invisible group-hover/day:opacity-100 group-hover/day:visible transition-all duration-200 z-[100] shadow-[0_20px_40px_rgba(0,0,0,0.1)] pointer-events-none`}>
                  {dayMatches.map((dm, idx) => (
                    <div key={idx} className={idx > 0 ? "mt-3 pt-3 border-t border-zinc-100 flex flex-col items-start text-left" : "flex flex-col items-start text-left"}>
                      {(dm.fecha || dm.ligaStr) && (
                        <div className="flex gap-2 items-center flex-wrap mb-1">
                          {dm.fecha && (
                            <span className="text-primary font-bold text-[11px] uppercase tracking-widest">{dm.fecha.replace(/^(lunes|martes|miércoles|miercoles|jueves|viernes|sábado|sabado|domingo)\s*/i, '')}</span>
                          )}
                          {dm.ligaStr && (
                            <span className="text-[9px] font-black uppercase tracking-widest border border-primary/60 bg-primary/5 px-1.5 py-0.5 rounded leading-none text-primary shadow-[0_0_10px_rgba(227,24,55,0.4)]" style={{ textShadow: "0 0 6px rgba(227,24,55,0.3)" }}>{dm.ligaStr}</span>
                          )}
                        </div>
                      )}
                      <p className="font-black text-zinc-900 text-[13px] leading-tight uppercase relative z-[101]">{dm.equipo}</p>
                    </div>
                  ))}
                  <div className={`absolute top-[98%] ${arrowAlignClass} border-[8px] border-transparent border-t-white pointer-events-none z-[100] drop-shadow-sm`}></div>
                </div>
              )}

              {/* Highlight Hoy (Si no hay partido) */}
              {isToday && !hasMatch && (
                <div className="absolute inset-0 border border-[#FFB81C] rounded-xl bg-[#FFB81C] shadow-[0_2px_10px_rgba(255,184,28,0.3)]"></div>
              )}
            </div>
          );
        })}
      </div>

      {/* Panel Inferior Móvil (Partidos Del Día Seleccionado) */}
      {selectedDateKey && matchMap.get(selectedDateKey) && (
        <div className="md:hidden z-20 mt-2 mb-4 bg-white/95 backdrop-blur-xl border border-zinc-200 text-zinc-900 rounded-2xl p-5 shadow-[0_20px_40px_rgba(0,0,0,0.1)] animate-in slide-in-from-bottom-2 fade-in relative">
           <button onClick={() => setSelectedDateKey(null)} className="absolute top-2 right-2 w-8 h-8 flex items-center justify-center bg-zinc-100 rounded-full text-zinc-500 material-symbols-outlined text-sm hover:bg-zinc-200">close</button>
           <p className="text-xs font-bold text-zinc-500 mb-3 border-b border-zinc-100 pb-2 flex items-center gap-2">
             <span className="material-symbols-outlined text-primary text-sm">event_available</span>
             PARTIDOS DEL {selectedDateKey.split('-').reverse().join('/')}
           </p>
           <div className="space-y-4 text-left">
             {matchMap.get(selectedDateKey)?.map((dm, idx) => (
               <div key={idx} className="flex flex-col">
                 {(dm.fecha || dm.ligaStr) && (
                   <div className="flex gap-2 items-center flex-wrap mb-1">
                     {dm.fecha && (
                       <span className="text-primary font-bold text-[12px] uppercase tracking-widest">{dm.fecha.replace(/^(lunes|martes|miércoles|miercoles|jueves|viernes|sábado|sabado|domingo)\s*/i, '')}</span>
                     )}
                     {dm.ligaStr && (
                       <span className="text-[10px] font-black uppercase tracking-widest border border-primary/60 bg-primary/5 px-1.5 py-0.5 rounded leading-none text-primary shadow-[0_0_10px_rgba(227,24,55,0.4)]" style={{ textShadow: "0 0 6px rgba(227,24,55,0.3)" }}>{dm.ligaStr}</span>
                     )}
                   </div>
                 )}
                 <p className="font-black text-zinc-900 text-base leading-tight uppercase">{dm.equipo}</p>
               </div>
             ))}
           </div>
        </div>
      )}
      
      {/* Leyenda Footer */}
      <div className="mt-auto pt-5 border-t border-zinc-100 flex items-center gap-3 text-xs text-zinc-500 z-10 w-full relative">
        <div className="w-4 h-4 bg-white border border-primary flex items-center justify-center rounded flex-shrink-0 shadow-[0_2px_5px_rgba(227,24,55,0.2)]">
           <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
        </div>
        <p className="leading-tight">Días marcados indican partido programado.</p>
      </div>
    </div>
  );
}
