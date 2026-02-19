
import React from 'react';
import { UI_STRINGS } from '../constants';
import { Language } from '../types';

interface EngineProps {
  activeSegment?: string | null;
  rotation?: number;
  onClick: () => void;
  lang: Language;
}

export const Engine: React.FC<EngineProps> = ({ activeSegment, rotation = 0, onClick, lang }) => {
  return (
    <div 
      className="relative w-64 h-64 md:w-96 md:h-96 flex items-center justify-center cursor-pointer group select-none"
      onClick={onClick}
    >
      {/* Outer Case (Shadow/Ambient) */}
      <div className="absolute inset-[-15px] rounded-full bg-black/60 blur-2xl opacity-90" />
      
      {/* Base Chassis Ring */}
      <div className="absolute inset-0 border-[2px] border-neutral-800/50 rounded-full shadow-[inset_0_2px_15px_rgba(255,255,255,0.03)] bg-gradient-to-b from-neutral-900 to-black" />
      
      {/* The Main Turning Knob Assembly */}
      <div 
        className="absolute inset-[15px] rounded-full shadow-2xl transition-transform duration-[900ms] cubic-bezier(0.23, 1, 0.32, 1)"
        style={{ transform: `rotate(${rotation}deg)` }}
      >
        {/* Knurled Outer Texture Ring */}
        <div className="absolute inset-0 rounded-full border-[10px] border-neutral-800 knurl-pattern shadow-[inset_0_0_20px_rgba(0,0,0,1),0_5px_15px_rgba(0,0,0,0.5)]" />
        
        {/* Brushed Steel Surface */}
        <div className="absolute inset-[8px] rounded-full bg-gradient-to-br from-neutral-200 via-neutral-500 to-neutral-900 shadow-[inset_0_3px_6px_rgba(255,255,255,0.2),inset_0_-3px_6px_rgba(0,0,0,0.6)]">
            
            {/* Glossy Black Center Hub */}
            <div className="absolute inset-[20%] rounded-full bg-gradient-to-t from-neutral-950 to-neutral-800 shadow-[0_10px_25px_rgba(0,0,0,0.8),inset_0_2px_5px_rgba(255,255,255,0.1)] flex items-center justify-center border border-neutral-800/50">
               <div className="text-center pointer-events-none">
                 <div className="text-[7px] md:text-[8px] mono text-neutral-600 uppercase tracking-[0.4em] mb-1.5 opacity-50 font-medium">PROTOCOL_V3</div>
                 <div className="text-[11px] md:text-sm font-bold text-white uppercase tracking-tighter leading-tight">BIN ROMIH<br/>SYSTEM</div>
               </div>
            </div>

            {/* Red Arrow Indicator (Precisely like image) */}
            <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[14px] border-t-red-600 red-glow" />
        </div>
      </div>
      
      {/* Status LED (Bottom Center) */}
      <div className={`absolute bottom-[10%] left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full transition-all duration-500 border border-red-500/30 ${activeSegment === 'os' ? 'bg-red-600 red-glow scale-125' : 'bg-neutral-900 opacity-40'}`} />
    </div>
  );
};
