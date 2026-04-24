
interface ExpandableValueCardProps {
  icon: string;
  title: string;
  text: string;
  colorClass: string;
  borderColorClass: string;
}

export default function ExpandableValueCard({ icon, title, text, colorClass, borderColorClass }: ExpandableValueCardProps) {
  return (
    <div 
      className={`flex flex-col p-6 md:p-8 bg-white border-l-4 ${borderColorClass} cursor-pointer transition-all duration-300 hover:bg-zinc-50 shadow-[0_10px_30px_rgba(0,0,0,0.3)] select-none group rounded-r-xl`}
    >
      <div className="flex items-center gap-4">
        <span className={`material-symbols-outlined text-4xl lg:text-5xl ${colorClass}`} style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
        <h4 className="text-xl md:text-2xl font-headline font-black uppercase italic text-zinc-900 m-0 leading-tight">{title}</h4>
      </div>
      <div 
        className="overflow-hidden transition-all duration-500 ease-in-out max-h-0 opacity-0 mt-0 group-hover:max-h-48 group-hover:opacity-100 group-hover:mt-4"
      >
        <p className="text-zinc-600 text-sm md:text-base leading-relaxed">{text}</p>
      </div>
    </div>
  );
}
