"use client";
import React, { useState } from 'react';
import Script from 'next/script';

export default function SocialFeedTabs() {
  const [activeTab, setActiveTab] = useState<'instagram' | 'facebook'>('instagram');

  return (
    <div className="w-full">
      <Script src="https://elfsightcdn.com/platform.js" strategy="lazyOnload" />
      
      {/* Mobile/Tablet Tabs (Hidden on Desktop since Desktop shows both side by side) */}
      <div className="lg:hidden flex justify-center gap-4 mb-10 w-full px-4">
        <button 
          onClick={() => setActiveTab('instagram')}
          className={`flex-1 max-w-[180px] font-headline font-black uppercase tracking-widest px-4 py-3 rounded-xl transition-all shadow-lg text-sm select-none flex items-center justify-center gap-2 ${activeTab === 'instagram' ? 'bg-gradient-to-tr from-[#FD1D1D] via-[#E1306C] to-[#833AB4] text-white shadow-pink-500/30 scale-105' : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:bg-zinc-750'}`}
        >
          Instagram
        </button>
        <button 
          onClick={() => setActiveTab('facebook')}
          className={`flex-1 max-w-[180px] font-headline font-black uppercase tracking-widest px-4 py-3 rounded-xl transition-all shadow-lg text-sm select-none flex items-center justify-center gap-2 ${activeTab === 'facebook' ? 'bg-[#1877F2] text-white shadow-blue-500/30 scale-105' : 'bg-zinc-800 text-zinc-400 border border-zinc-700 hover:bg-zinc-750'}`}
        >
          Facebook
        </button>
      </div>

      {/* Grid: Desktop side by side | Mobile conditional view based on activeTab */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full min-h-[400px]">
        
        {/* Instagram Feed */}
        <div className={`w-full flex-col gap-4 ${activeTab === 'instagram' ? 'flex' : 'hidden lg:flex'}`}>
          <div className="hidden lg:flex justify-center">
            <div className="bg-gradient-to-tr from-[#FD1D1D] via-[#E1306C] to-[#833AB4] text-white font-headline font-black uppercase tracking-widest px-8 py-2 rounded-full shadow-lg shadow-pink-500/30 select-none">
              Instagram
            </div>
          </div>
          <div className="w-full flex justify-center items-center">
            <div className="elfsight-app-3549dd1c-12f8-403a-b18b-7fe0428227cd w-full flex justify-center" data-elfsight-app-lazy></div>
          </div>
        </div>

        {/* Facebook Feed */}
        <div className={`w-full flex-col gap-4 ${activeTab === 'facebook' ? 'flex' : 'hidden lg:flex'}`}>
          <div className="hidden lg:flex justify-center">
            <div className="bg-[#1877F2] text-white font-headline font-black uppercase tracking-widest px-8 py-2 rounded-full shadow-lg shadow-blue-500/30 select-none">
              Facebook
            </div>
          </div>
          <div className="w-full">
            <div className="elfsight-app-e0551143-a907-4a6c-8092-92dfd7b96213" data-elfsight-app-lazy></div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
