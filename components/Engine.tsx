import { useTheme } from "@/context/ThemeContext";
import { useEffect, useState, useRef } from "react";

export const Engine = ({ activeSegment, rotation = 0, onClick, lang, isActive }) => {
  const isRevving = activeSegment && activeSegment !== 'os';
  const { theme } = useTheme();
  const isRTL = lang === 'ar';
  const [pulse, setPulse] = useState(0);
  const [touchEffect, setTouchEffect] = useState(false);
  const [ripplePosition, setRipplePosition] = useState({ x: 0, y: 0 });
  const [shimmerPosition, setShimmerPosition] = useState({ x: 0, y: 0 });
  const engineRef = useRef<HTMLDivElement>(null);

 
  useEffect(() => {
    if (isActive) {
      const interval = setInterval(() => {
        setPulse(prev => (prev + 1) % 3);
      }, 800);
      return () => clearInterval(interval);
    }
  }, [isActive]);


  const handleClick = (e: any) => {
    if (engineRef.current) {
      const rect = engineRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setRipplePosition({ x, y });
      setTouchEffect(true);
      setTimeout(() => setTouchEffect(false), 500);
    }
    onClick?.(e);
  };

 
  const handleTouch = (e: any) => {
    if (engineRef.current && e.touches[0]) {
      const rect = engineRef.current.getBoundingClientRect();
      const x = ((e.touches[0].clientX - rect.left) / rect.width) * 100;
      const y = ((e.touches[0].clientY - rect.top) / rect.height) * 100;
      setRipplePosition({ x, y });
      setTouchEffect(true);
      setTimeout(() => setTouchEffect(false), 500);
    }
  };


  const handleMouseMove = (e: any) => {
    if (engineRef.current) {
      const rect = engineRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setShimmerPosition({ x, y });
    }
  };

  return (
    <div 
      ref={engineRef}
      className={`relative w-80 h-80 md:w-[540px] md:h-[540px] flex items-center justify-center cursor-pointer group select-none transition-all duration-500`}
      onClick={handleClick}
      onTouchStart={handleTouch}
      onMouseMove={handleMouseMove}
      dir={isRTL ? 'rtl' : 'ltr'}
    >

      <div className="absolute inset-[-80px] rounded-full bg-[#c9965a]/10 dark:bg-[#c9965a]/20 blur-[100px] opacity-30 group-hover:opacity-60 transition-opacity duration-700" />
      <div className="absolute inset-[-40px] rounded-full bg-[#3a210d]/5 dark:bg-[#e3e4df]/5 blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity duration-700" />
      

      <div className="absolute top-0 left-0 -translate-x-4 -translate-y-4 md:-translate-x-12 md:-translate-y-12 flex flex-col items-start opacity-30 group-hover:opacity-100 transition-all duration-700 group-hover:translate-x-0 group-hover:translate-y-0">
        <div className="mono text-[7px] md:text-[9px] text-[#3a210d] dark:text-[#c9965a] font-black tracking-[0.3em] mb-1.5 flex items-center gap-1">
          <span className="w-1 h-1 bg-[#c9965a] rounded-full animate-pulse" />
          OIL_TEMP
        </div>
        <div className="flex gap-0.5">
          {[...Array(8)].map((_, i) => (
            <div 
              key={i} 
              className={`w-3 h-1 md:w-5 md:h-1.5 transition-all duration-300 ${i < 6 ? 'bg-[#3a210d] dark:bg-[#c9965a]' : 'bg-[#d4d5cf] dark:bg-[#2a2a2a]'} ${isRevving && i < 7 ? 'bg-[#c9965a]' : ''}`} 
            />
          ))}
        </div>
        <div className="mono text-[8px] md:text-[10px] text-[#c9965a] mt-1.5 font-bold tracking-wider">104°C</div>
      </div>
 
      <div className="absolute top-0 right-0 translate-x-4 -translate-y-4 md:translate-x-12 md:-translate-y-12 flex flex-col items-end opacity-30 group-hover:opacity-100 transition-all duration-700 group-hover:translate-x-0 group-hover:translate-y-0">
        <div className="mono text-[7px] md:text-[9px] text-[#3a210d] dark:text-[#c9965a] font-black tracking-[0.3em] mb-1.5 flex items-center gap-1">
          FUEL
          <span className="w-1 h-1 bg-[#c9965a] rounded-full animate-pulse" />
        </div>
        <div className="w-24 md:w-32 h-1.5 md:h-2 bg-[#d4d5cf] dark:bg-[#2a2a2a] relative overflow-hidden rounded-full">
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#3a210d] to-[#c9965a] dark:from-[#c9965a] dark:to-[#e3e4df] transition-all duration-500"
            style={{ width: isRevving ? '95%' : '85%' }}
          />
        </div>
        <div className="mono text-[8px] md:text-[10px] text-[#c9965a] mt-1.5 font-bold tracking-wider">{isRevving ? '95%' : '85%'}</div>
      </div>

 
      <div className="absolute bottom-0 left-0 -translate-x-4 translate-y-4 md:-translate-x-12 md:translate-y-12 flex flex-col items-start opacity-30 group-hover:opacity-100 transition-all duration-700 group-hover:translate-x-0 group-hover:translate-y-0">
        <div className="relative w-12 h-12 md:w-16 md:h-16">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="28" fill="none" stroke="#3a210d10" strokeWidth="1" className="dark:stroke-[#c9965a20]" />
            <circle cx="32" cy="32" r="28" fill="none" stroke="#3a210d20" strokeWidth="0.5" className="dark:stroke-[#c9965a30]" strokeDasharray="4 4" />
          </svg>
          <div 
            className={`absolute w-1.5 h-1.5 md:w-2.5 md:h-2.5 bg-[#3a210d] dark:bg-[#c9965a] rounded-full transition-all duration-500 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${
              isRevving ? 'translate-x-3 -translate-y-3 md:translate-x-4 md:-translate-y-4' : ''
            }`} 
          />
        </div>
        <div className="mono text-[7px] md:text-[9px] text-[#3a210d] dark:text-[#c9965a] font-black mt-2 tracking-[0.2em] uppercase italic">G_FORCE</div>
      </div>

  
      <div className="absolute bottom-0 right-0 translate-x-4 translate-y-4 md:translate-x-12 md:translate-y-12 flex flex-col items-end opacity-30 group-hover:opacity-100 transition-all duration-700 group-hover:translate-x-0 group-hover:translate-y-0">
        <svg className="w-16 h-16 md:w-24 md:h-24" viewBox="0 0 100 100">
          <circle 
            cx="50" cy="50" r="40" 
            fill="transparent" 
            stroke="#d4d5cf" 
            strokeWidth="3" 
            className="dark:stroke-[#2a2a2a]"
          />
          <circle 
            cx="50" cy="50" r="40" 
            fill="transparent" 
            stroke="url(#gradient)" 
            strokeWidth="4" 
            strokeLinecap="round"
            strokeDasharray="251.2" 
            strokeDashoffset={isRevving ? "60" : "180"} 
            className="transition-all duration-1000"
            style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3a210d" />
              <stop offset="100%" stopColor="#c9965a" />
            </linearGradient>
          </defs>
        </svg>
        <div className="mono text-[8px] md:text-[10px] text-[#3a210d] dark:text-[#c9965a] font-black mt-1 tracking-[0.2em] italic">
          {isRevving ? 'SPORT' : 'COMFORT'}
        </div>
      </div>

 
      <div className="absolute w-72 h-72 md:w-[420px] md:h-[420px] rounded-full">
        <div className="absolute inset-0 rounded-full border border-[#3a210d]/10 dark:border-[#c9965a]/20" />
        <div className="absolute inset-2 rounded-full border border-[#9f7952]/20 dark:border-[#c9965a]/30 border-t-[#3a210d]/40 dark:border-t-[#c9965a]/40 rotate-45" />
        
       
        {[...Array(12)].map((_, i) => (
          <div 
            key={i}
            className={`absolute w-1.5 h-1.5 md:w-2 md:h-2 rounded-full transition-all duration-500 ${
              isActive && pulse === i % 4 
                ? 'bg-[#c9965a] dark:bg-[#c9965a] scale-150 shadow-[0_0_10px_rgba(201,150,90,0.5)]' 
                : 'bg-[#3a210d]/20 dark:bg-[#c9965a]/30'
            }`}
            style={{
              top: `${50 + 46 * Math.sin(i * Math.PI / 6)}%`,
              left: `${50 + 46 * Math.cos(i * Math.PI / 6)}%`,
              transform: 'translate(-50%, -50%)',
              transition: 'all 0.3s ease'
            }}
          />
        ))}
      </div>

 
      <div 
        className={`absolute w-[240px] h-[240px] md:w-[370px] md:h-[370px] rounded-full shadow-[0_20px_40px_rgba(58,33,13,0.25)] dark:shadow-[0_20px_40px_rgba(0,0,0,0.5)] bg-gradient-to-br from-[#f8f9f5] via-[#e3e4df] to-[#d4d5cf] dark:from-[#3a3a3a] dark:via-[#2a2a2a] dark:to-[#1a1a1a] border border-[#3a210d]/10 dark:border-[#c9965a]/15 flex items-center justify-center transition-all duration-300 ${
          isActive ? 'scale-105 shadow-[0_0_40px_rgba(201,150,90,0.6)]' : ''
        } ${touchEffect ? 'scale-[1.02] shadow-[0_0_50px_rgba(201,150,90,0.8)]' : ''}`}
        style={{
          transform: touchEffect ? 'scale(1.02)' : '',
          transition: 'all 0.2s cubic-bezier(0.18, 0.89, 0.32, 1.28)'
        }}
      >
   
        {touchEffect && (
          <div 
            className="absolute rounded-full bg-[#c9965a]/20 pointer-events-none animate-ripple"
            style={{
              left: `${ripplePosition.x}%`,
              top: `${ripplePosition.y}%`,
              transform: 'translate(-50%, -50%)',
              width: '10px',
              height: '10px',
            }}
          />
        )}
        
 
        <div className="absolute inset-4 rounded-full opacity-40 dark:opacity-30 group-hover:opacity-70 transition-opacity duration-500">
          {[...Array(32)].map((_, i) => {
            const isMainMark = i % 4 === 0;
            return (
              <div 
                key={i} 
                className={`absolute top-1/2 left-1/2 origin-bottom -translate-x-1/2 transition-all duration-300 ${
                  isMainMark 
                    ? 'w-[2px] h-5 md:h-6 bg-[#3a210d] dark:bg-[#c9965a]' 
                    : 'w-[1px] h-3 md:h-4 bg-[#3a210d]/50 dark:bg-[#c9965a]/40'
                } ${isActive && i % 8 === 0 ? 'h-6 md:h-7 bg-[#c9965a] shadow-[0_0_8px_rgba(201,150,90,0.8)]' : ''}`}
                style={{ transform: `rotate(${i * 11.25}deg) translateY(-${isMainMark ? 175 : 170}px)` }}
              />
            );
          })}
        </div>

       
        <div className="absolute inset-[30px] rounded-full border border-[#3a210d]/5 dark:border-[#c9965a]/10" />
        <div className="absolute inset-[50px] rounded-full border border-[#3a210d]/5 dark:border-[#c9965a]/10 border-dashed" />
        <div className="absolute inset-[70px] rounded-full border border-[#3a210d]/5 dark:border-[#c9965a]/10" />

        
        <div 
          className="absolute w-[180px] h-[180px] md:w-[260px] md:h-[260px] rounded-full shadow-2xl transition-all duration-[800ms] cubic-bezier(0.34, 1.56, 0.64, 1)"
          style={{ 
            transform: `rotate(${rotation}deg) ${isActive ? 'scale(1.02)' : ''}`,
          }}
        >
           
          <div className="absolute inset-0 rounded-full border-[12px] border-[#d4d5cf] dark:border-[#2a2a2a] shadow-[inset_0_0_20px_rgba(58,33,13,0.2)] dark:shadow-[inset_0_0_20px_rgba(201,150,90,0.15)]">
            <div className="absolute inset-0 rounded-full knurl-pattern" />
          </div>
          
       
          <div 
            className={`absolute inset-[10px] rounded-full bg-gradient-to-br from-[#e8e9e4] via-[#ffffff] to-[#d0d1cb] dark:from-[#353535] dark:via-[#454545] dark:to-[#252525] shadow-[inset_0_2px_8px_rgba(255,255,255,0.9),0_10px_25px_rgba(58,33,13,0.2)] dark:shadow-[inset_0_2px_8px_rgba(255,255,255,0.1),0_10px_25px_rgba(0,0,0,0.5)] flex items-center justify-center transition-all duration-700 overflow-hidden ${
              isActive ? 'bg-gradient-to-tr from-[#ffffff] via-[#e8e9e4] to-[#d0d1cb] dark:from-[#454545] dark:via-[#353535] dark:to-[#2a2a2a]' : ''
            }`}
          >
  
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{
                background: `radial-gradient(circle at ${shimmerPosition.x}% ${shimmerPosition.y}%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 50%)`,
                mixBlendMode: 'overlay'
              }}
            />
            
         
            <div 
              className="absolute inset-0 opacity-0 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none animate-shimmer-rotate"
              style={{
                background: `conic-gradient(from 0deg, transparent, rgba(255,255,255,0.4), transparent)`,
                filter: 'blur(10px)'
              }}
            />
            
          
            <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300" style={{
              backgroundImage: `radial-gradient(circle at 30% 40%, rgba(201,150,90,0.3) 0px, transparent 30px)`,
              backgroundSize: '60px 60px'
            }} />
            
         
            <div className="absolute inset-[15px] rounded-full border border-[#3a210d]/10 dark:border-[#c9965a]/20" />
            
       
            <div 
              className={`w-[62%] h-[62%] rounded-full bg-gradient-to-br from-[#4a2e1a] to-[#2a1a0d] dark:from-[#d9a96e] dark:to-[#b98346] border border-[#9f7952]/50 dark:border-[#e3e4df]/40 flex flex-col items-center justify-center shadow-2xl transform transition-all duration-300 ${
                isActive ? 'scale-110 shadow-[0_0_30px_rgba(201,150,90,0.9)]' : 'group-hover:scale-105'
              }`}
              style={{
                transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
              }}
            >
              <div className="text-[6px] md:text-[8px] mono text-[#c9965a] dark:text-[#2a1a0d] font-black tracking-[0.3em] mb-1 opacity-80">CORE</div>
              <div className="text-[10px] md:text-xs font-black text-[#e3e4df] dark:text-[#1a1a1a] italic tracking-tighter text-center uppercase leading-none">
                BIN ROMIH
              </div>
              <div className="text-[6px] md:text-[8px] text-[#9f7952] dark:text-[#3a210d] font-medium tracking-[0.2em] mt-1">OFFICE</div>
            </div>

        
            <div className="absolute top-[8%] left-1/2 -translate-x-1/2">
              <div className={`w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[18px] transition-all duration-500 ${
                isActive ? 'border-t-[#c9965a] drop-shadow-[0_0_15px_rgba(201,150,90,0.9)]' : 'border-t-[#3a210d] dark:border-t-[#c9965a]'
              }`} />
              <div className={`absolute top-4 left-1/2 -translate-x-1/2 w-0.5 transition-all duration-500 ${
                isActive ? 'bg-[#c9965a] h-6' : 'bg-[#3a210d] dark:bg-[#c9965a] h-4 opacity-30'
              }`} />
            </div>
          </div>
        </div>
      </div>
      
 
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center">
        <div className={`h-1 rounded-full mb-2 transition-all duration-500 ${
          isActive 
            ? 'w-16 bg-gradient-to-r from-[#3a210d] to-[#c9965a] animate-pulse' 
            : 'w-10 bg-[#3a210d]/20 dark:bg-[#c9965a]/20'
        }`} />
        <div className={`mono text-[8px] md:text-[10px] tracking-[0.3em] font-bold transition-all duration-500 ${
          isActive ? 'text-[#c9965a]' : 'text-[#3a210d]/40 dark:text-[#c9965a]/40'
        }`}>
          {isActive ? 'ACTIVE' : 'STANDBY'}
        </div>
      </div>

    
      {isActive && (
        <div className="absolute inset-0 rounded-full pointer-events-none">
          <div className="absolute inset-0 rounded-full border-2 border-[#c9965a]/20 animate-ping" style={{ animationDuration: '2s' }} />
          <div className="absolute inset-4 rounded-full border border-[#c9965a]/15 animate-pulse" style={{ animationDuration: '3s' }} />
        </div>
      )}

 
      <div className="absolute inset-0 rounded-full pointer-events-none">
        <div className={`absolute inset-0 rounded-full bg-[#c9965a]/0 transition-all duration-300 ${
          touchEffect ? 'bg-[#c9965a]/10 scale-110' : ''
        }`} />
      </div>
 
      <style jsx>{`
        @keyframes ripple {
          0% {
            width: 0px;
            height: 0px;
            opacity: 0.5;
          }
          100% {
            width: 200px;
            height: 200px;
            opacity: 0;
          }
        }
        
        @keyframes shimmerRotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
        
        .animate-ripple {
          animation: ripple 0.6s ease-out forwards;
        }
        
        .animate-shimmer-rotate {
          animation: shimmerRotate 3s linear infinite;
        }
        
        .knurl-pattern {
          background-image: repeating-linear-gradient(
            45deg,
            rgba(58,33,13,0.1) 0px,
            rgba(58,33,13,0.1) 2px,
            transparent 2px,
            transparent 6px
          );
        }
        
        .dark .knurl-pattern {
          background-image: repeating-linear-gradient(
            45deg,
            rgba(201,150,90,0.15) 0px,
            rgba(201,150,90,0.15) 2px,
            transparent 2px,
            transparent 6px
          );
        }
      `}</style>
    </div>
  );
};