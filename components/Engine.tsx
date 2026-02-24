// components/Engine.tsx - Enhanced version with tactile realism, refined audio, and mobile optimization
import { useTheme } from "@/context/ThemeContext";
import { useEffect, useRef, useState, useMemo, useCallback } from "react";

interface EngineProps {
  activeSegment?: string | null;
  rotation?: number;
  onClick?: (e: any) => void;
  lang?: string;
  isActive?: boolean;
  telemetry?: {
    oilTemp: number;
    fuelLevel: number;
    gForce: { x: number; y: number };
    driveMode: 'comfort' | 'sport' | 'race';
  };
}

export const Engine = ({ 
  activeSegment, 
  rotation = 0, 
  onClick, 
  lang = 'en', 
  isActive = false,
  telemetry = {
    oilTemp: 104,
    fuelLevel: 85,
    gForce: { x: 0, y: 0 },
    driveMode: 'comfort'
  }
}: EngineProps) => {
  const isRevving = activeSegment && activeSegment !== 'os';
  const { theme } = useTheme();
  const engineRef = useRef<HTMLDivElement>(null);
  const [isTouching, setIsTouching] = useState(false);
  const [audioInitialized, setAudioInitialized] = useState(false);
  const audioRef = useRef<{
    context: AudioContext;
    source: AudioBufferSourceNode;
    gainNode: GainNode;
    filterNode: BiquadFilterNode;
  } | null>(null);

  // Pre-calculated values for performance
  const vibrationIntensity = useMemo(() => {
    if (!isRevving) return 0;
    return Math.min(0.5 + (rotation / 360) * 2, 2);
  }, [isRevving, rotation]);

  // Initialize premium car engine sound
  const initAudio = useCallback(async () => {
    if (audioRef.current || !window.AudioContext) return;
    
    try {
      const context = new (window.AudioContext)();
      
      // Create filter for more realistic engine tone
      const filterNode = context.createBiquadFilter();
      filterNode.type = 'lowpass';
      filterNode.frequency.value = 120;
      filterNode.Q.value = 0.5;
      
      const gainNode = context.createGain();
      gainNode.gain.value = 0;
      
      // Create a more complex sound using oscillator bank
      const osc1 = context.createOscillator();
      const osc2 = context.createOscillator();
      const osc3 = context.createOscillator();
      
      osc1.type = 'sawtooth';
      osc2.type = 'triangle';
      osc3.type = 'sine';
      
      // Car-like engine frequencies
      osc1.frequency.value = 40; // Base rumble
      osc2.frequency.value = 80; // Harmonic
      osc3.frequency.value = 120; // Higher harmonic
      
      // Mix oscillators
      const gain1 = context.createGain();
      const gain2 = context.createGain();
      const gain3 = context.createGain();
      
      gain1.gain.value = 0.01;
      gain2.gain.value = 0.005;
      gain3.gain.value = 0.002;
      
      osc1.connect(gain1);
      osc2.connect(gain2);
      osc3.connect(gain3);
      
      gain1.connect(filterNode);
      gain2.connect(filterNode);
      gain3.connect(filterNode);
      
      filterNode.connect(gainNode);
      gainNode.connect(context.destination);
      
      osc1.start();
      osc2.start();
      osc3.start();
      
      audioRef.current = { 
        context, 
        source: osc1 as any, // Store reference to first oscillator
        gainNode,
        filterNode 
      };
      
      setAudioInitialized(true);
      
      // Start with very subtle idle
      gainNode.gain.linearRampToValueAtTime(0.008, context.currentTime + 0.5);
      
    } catch (error) {
      console.warn('Web Audio API not supported or blocked:', error);
    }
  }, []);

  // Subtle haptic feedback on rotation
  useEffect(() => {
    if (!engineRef.current || !isRevving) return;
    
    const intensity = vibrationIntensity;
    const element = engineRef.current;
    
    // Micro-vibrations for tactile feel
    element.style.transform = `translate3d(${Math.sin(Date.now() * 0.02) * intensity * 0.2}px, ${Math.cos(Date.now() * 0.015) * intensity * 0.2}px, 0)`;
    
    return () => {
      if (element) element.style.transform = 'translate3d(0, 0, 0)';
    };
  }, [isRevving, vibrationIntensity]);

  // Enhanced audio response - more car-like
  useEffect(() => {
    if (!audioRef.current || !audioInitialized) return;
    
    const { gainNode, filterNode, context } = audioRef.current;
    const now = context.currentTime;
    
    if (isRevving) {
      // Car engine sound characteristics
      // As RPM increases, filter opens up and gain increases
      const targetFilterFreq = 80 + (rotation * 1.5); // Max ~620Hz
      const targetGain = 0.008 + (rotation * 0.00015); // Max ~0.062
      
      // Smooth transitions for realistic engine response
      filterNode.frequency.linearRampToValueAtTime(targetFilterFreq, now + 0.1);
      gainNode.gain.linearRampToValueAtTime(targetGain, now + 0.1);
      
      // Add subtle modulation for cylinder firing effect
      if (Math.random() > 0.95) {
        gainNode.gain.setValueAtTime(targetGain * 1.1, now);
        gainNode.gain.linearRampToValueAtTime(targetGain, now + 0.05);
      }
    } else {
      // Return to idle
      filterNode.frequency.linearRampToValueAtTime(120, now + 0.3);
      gainNode.gain.linearRampToValueAtTime(0.008, now + 0.3);
    }
  }, [isRevving, rotation, audioInitialized]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        try {
          audioRef.current.gainNode.gain.linearRampToValueAtTime(0, audioRef.current.context.currentTime + 0.1);
          setTimeout(() => {
            audioRef.current?.context.close();
          }, 200);
        } catch (e) {
          // Ignore cleanup errors
        }
      }
    };
  }, []);

  const handleClick = useCallback((e: any) => {
    initAudio();
    onClick?.(e);
  }, [initAudio, onClick]);

  const handleTouchStart = useCallback(() => {
    setIsTouching(true);
    initAudio();
    
    // Add subtle haptic feedback if supported
    if (window.navigator?.vibrate) {
      window.navigator.vibrate(10);
    }
  }, [initAudio]);

  const handleTouchEnd = useCallback(() => {
    setIsTouching(false);
  }, []);

  // Main render with enhanced tactile elements
  return (
    <div 
      ref={engineRef}
      className={`relative w-80 h-80 md:w-[540px] md:h-[540px] flex items-center justify-center cursor-pointer group select-none transition-transform duration-75 ${isTouching ? 'scale-[0.998]' : ''}`}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={() => setIsTouching(false)}
      onKeyDown={(e) => e.key === 'Enter' && handleClick(e)}
      role="button"
      tabIndex={0}
      aria-label={`Engine control ${isActive ? 'active' : 'inactive'}`}
      aria-pressed={isActive}
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      {/* Screen reader descriptions */}
      <span className="sr-only">
        RPM: {Math.round(rotation * 10)}. Drive mode: {telemetry.driveMode}.
        Oil temperature: {telemetry.oilTemp}°C. Fuel: {telemetry.fuelLevel}%.
      </span>

      {/* Premium metallic backdrop with machined finish */}
      <div className="absolute inset-[-40px] rounded-full bg-gradient-to-br from-[#c9965a]/5 via-transparent to-[#3a210d]/5 blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-700" />
      
      {/* Micro-texture for tactile grip impression */}
      <div className="absolute inset-0 rounded-full opacity-[0.02] mix-blend-multiply pointer-events-none"
           style={{ 
             backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.8\' numOctaves=\'2\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'60\' height=\'60\' filter=\'url(%23noise)\' opacity=\'0.15\'/%3E%3C/svg%3E")',
             backgroundSize: '120px 120px'
           }} />

      {/* Touch feedback overlay */}
      {isTouching && (
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 to-transparent animate-pulse pointer-events-none z-10" />
      )}

      {/* Machined outer ring with knurling pattern */}
      <div className="absolute w-[280px] h-[280px] md:w-[460px] md:h-[460px] rounded-full">
        {/* Primary ring with brushed metal effect */}
        <div className="absolute inset-0 rounded-full border-2 border-[#3a210d]/20 dark:border-[#c9965a]/20" />
        
        {/* Secondary ring with engraved look */}
        <div className="absolute inset-3 rounded-full border border-[#3a210d]/10 dark:border-[#c9965a]/30" />
        
        {/* Knurling pattern - tactile grip simulation */}
        <div className="absolute inset-[-4px] rounded-full opacity-20">
          {[...Array(32)].map((_, i) => (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 w-6 h-px bg-[#3a210d] dark:bg-[#c9965a]"
              style={{ 
                transform: `rotate(${i * 11.25}deg) translateY(-160px)`,
                opacity: i % 2 === 0 ? 0.3 : 0.15
              }}
            />
          ))}
        </div>
      </div>

      {/* Main engine housing - tactile, weighty appearance */}
      <div className="absolute w-[220px] h-[220px] md:w-[340px] md:h-[340px] rounded-full shadow-[0_30px_50px_-15px_rgba(0,0,0,0.4)] bg-gradient-to-br from-[#ecece8] via-[#d6d7d2] to-[#c0c1bb] dark:from-[#3d3d3d] dark:via-[#2d2d2d] dark:to-[#1d1d1d] border border-[#3a210d]/15 dark:border-[#c9965a]/20 flex items-center justify-center overflow-hidden">
        
        {/* Radial brush strokes for machined look */}
        <div className="absolute inset-0 opacity-10 dark:opacity-20">
          {[...Array(48)].map((_, i) => (
            <div
              key={i}
              className="absolute top-1/2 left-1/2 w-full h-px bg-gradient-to-r from-transparent via-[#3a210d] to-transparent"
              style={{ transform: `rotate(${i * 7.5}deg)` }}
            />
          ))}
        </div>

        {/* Concentric rings for depth */}
        <div className="absolute inset-4 rounded-full border border-[#3a210d]/10 dark:border-[#c9965a]/20" />
        <div className="absolute inset-8 rounded-full border border-[#3a210d]/15 dark:border-[#c9965a]/25" />
        <div className="absolute inset-12 rounded-full border border-[#3a210d]/20 dark:border-[#c9965a]/30" />

        {/* Rotating core - the heart of the engine */}
        <div 
          className="absolute w-[160px] h-[160px] md:w-[240px] md:h-[240px] rounded-full transition-transform duration-700 ease-out will-change-transform"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          {/* Inner machined ring */}
          <div className="absolute inset-0 rounded-full border-[8px] border-[#b5b6b0] dark:border-[#3d3d3d] shadow-inner">
            {/* Micro-knurling on inner ring */}
            <div className="absolute inset-[-4px] rounded-full opacity-30">
              {[...Array(24)].map((_, i) => (
                <div
                  key={i}
                  className="absolute top-1/2 left-1/2 w-4 h-px bg-[#3a210d] dark:bg-[#c9965a]"
                  style={{ transform: `rotate(${i * 15}deg) translateY(-90px)` }}
                />
              ))}
            </div>
          </div>

          {/* Premium center piece - tactile focus point */}
          <div className="absolute inset-[15px] rounded-full bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] dark:from-[#c9965a] dark:to-[#b37b44] shadow-2xl flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
            {/* Embossed logo area */}
            <div className="w-3/4 h-3/4 rounded-full bg-gradient-to-br from-[#3a3a3a] to-[#1a1a1a] dark:from-[#e3e4df] dark:to-[#c0c1bb] flex flex-col items-center justify-center shadow-inner">
              <div className="text-[8px] md:text-xs font-black text-[#c9965a] dark:text-[#3a210d] tracking-widest">V8</div>
              <div className="text-[6px] md:text-[8px] text-[#9f7952] dark:text-[#2a1a0d] mt-1">TWIN TURBO</div>
            </div>

            {/* Minute markers for precision feel */}
            <div className="absolute top-0 left-1/2 w-0.5 h-3 bg-[#c9965a] -translate-x-1/2 -translate-y-1/2" />
          </div>

          {/* Index marker - gives sense of rotation */}
          <div className="absolute top-0 left-1/2 w-0.5 h-6 bg-[#3a210d] dark:bg-[#c9965a] -translate-x-1/2 -translate-y-1/2" />
        </div>

        {/* Fixed reference points for tactile orientation */}
        {['N', 'S', 'E', 'W'].map((dir, i) => (
          <div
            key={dir}
            className="absolute w-1 h-1 bg-[#3a210d]/40 dark:bg-[#c9965a]/40 rounded-full"
            style={{
              top: i === 0 ? '10%' : i === 1 ? '90%' : '50%',
              left: i === 2 ? '90%' : i === 3 ? '10%' : '50%',
              transform: 'translate(-50%, -50%)'
            }}
          />
        ))}
      </div>

      {/* Telemetry elements - machined and tactile */}
      
      {/* Oil temperature - with mechanical gauge appearance */}
      <div className="absolute top-4 left-4 md:top-8 md:left-8 flex flex-col items-start opacity-40 group-hover:opacity-100 transition-all duration-500">
        <div className="flex items-center gap-1 mb-1">
          <div className={`w-1.5 h-1.5 rounded-full ${telemetry.oilTemp > 110 ? 'bg-red-500 animate-pulse' : 'bg-[#c9965a]'}`} />
          <span className="text-[6px] md:text-[8px] font-mono text-[#3a210d] dark:text-[#c9965a] tracking-widest">OIL</span>
        </div>
        <div className="relative w-12 md:w-16 h-12 md:h-16">
          <svg viewBox="0 0 40 40" className="w-full h-full">
            <circle cx="20" cy="20" r="16" fill="none" stroke="currentColor" strokeWidth="1" className="text-[#3a210d]/20 dark:text-[#c9965a]/20" />
            <circle 
              cx="20" cy="20" r="16" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round"
              strokeDasharray={`${(telemetry.oilTemp - 80) * 2.5} 100`}
              className="text-[#3a210d] dark:text-[#c9965a] transition-all duration-500"
              style={{ transform: 'rotate(-90deg)', transformOrigin: 'center' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[8px] md:text-xs font-mono text-[#3a210d] dark:text-[#c9965a]">{telemetry.oilTemp}°</span>
          </div>
        </div>
      </div>

      {/* Fuel level - with mechanical precision */}
      <div className="absolute top-4 right-4 md:top-8 md:right-8 flex flex-col items-end opacity-40 group-hover:opacity-100 transition-all duration-500">
        <div className="flex items-center gap-1 mb-1">
          <span className="text-[6px] md:text-[8px] font-mono text-[#3a210d] dark:text-[#c9965a] tracking-widest">FUEL</span>
          <div className="w-1.5 h-1.5 rounded-full bg-[#c9965a]" />
        </div>
        <div className="relative w-12 md:w-16 h-12 md:h-16">
          <svg viewBox="0 0 40 40" className="w-full h-full">
            <circle cx="20" cy="20" r="16" fill="none" stroke="currentColor" strokeWidth="1" className="text-[#3a210d]/20 dark:text-[#c9965a]/20" />
            <circle 
              cx="20" cy="20" r="16" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round"
              strokeDasharray={`${telemetry.fuelLevel * 1.6} 160`}
              className="text-[#3a210d] dark:text-[#c9965a] transition-all duration-500"
              style={{ transform: 'rotate(270deg)', transformOrigin: 'center' }}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[8px] md:text-xs font-mono text-[#3a210d] dark:text-[#c9965a]">{telemetry.fuelLevel}%</span>
          </div>
        </div>
      </div>

      {/* G-Force indicator - precision ball in machined race */}
      <div className="absolute bottom-4 left-4 md:bottom-8 md:left-8 opacity-40 group-hover:opacity-100 transition-all duration-500">
        <div className="text-[6px] md:text-[8px] font-mono text-[#3a210d] dark:text-[#c9965a] tracking-widest mb-1">G-FORCE</div>
        <div className="relative w-16 h-16 md:w-20 md:h-20">
          {/* Machined ring */}
          <div className="absolute inset-0 rounded-full border border-[#3a210d]/30 dark:border-[#c9965a]/30" />
          <div className="absolute inset-2 rounded-full border border-dashed border-[#3a210d]/20 dark:border-[#c9965a]/20" />
          
          {/* Movement ball */}
          <div 
            className="absolute w-3 h-3 md:w-4 md:h-4 bg-gradient-to-br from-[#3a210d] to-[#c9965a] dark:from-[#c9965a] dark:to-[#e3e4df] rounded-full shadow-lg transition-all duration-300"
            style={{ 
              top: '50%', 
              left: '50%',
              transform: `translate(calc(-50% + ${telemetry.gForce.x * 12}px), calc(-50% + ${telemetry.gForce.y * 12}px))`
            }}
          />
          
          {/* Center reference */}
          <div className="absolute top-1/2 left-1/2 w-0.5 h-0.5 bg-[#3a210d]/50 dark:bg-[#c9965a]/50 rounded-full -translate-x-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Drive mode selector - tactile indicator */}
      <div className="absolute bottom-4 right-4 md:bottom-8 md:right-8 flex flex-col items-end opacity-40 group-hover:opacity-100 transition-all duration-500">
        <span className="text-[6px] md:text-[8px] font-mono text-[#3a210d] dark:text-[#c9965a] tracking-widest mb-1">MODE</span>
        <div className="relative w-12 h-12 md:w-16 md:h-16">
          <svg viewBox="0 0 40 40" className="w-full h-full">
            <circle cx="20" cy="20" r="16" fill="none" stroke="currentColor" strokeWidth="1" className="text-[#3a210d]/20 dark:text-[#c9965a]/20" />
            {['comfort', 'sport', 'race'].map((mode, i) => {
              const angle = (i * 120) - 90;
              const isActive = telemetry.driveMode === mode;
              return (
                <g key={mode}>
                  <circle 
                    cx={20 + 14 * Math.cos(angle * Math.PI / 180)} 
                    cy={20 + 14 * Math.sin(angle * Math.PI / 180)} 
                    r="2"
                    fill={isActive ? '#c9965a' : 'transparent'}
                    stroke="currentColor"
                    strokeWidth="1"
                    className="text-[#3a210d] dark:text-[#c9965a] transition-all duration-300"
                  />
                  {isActive && (
                    <circle 
                      cx={20 + 14 * Math.cos(angle * Math.PI / 180)} 
                      cy={20 + 14 * Math.sin(angle * Math.PI / 180)} 
                      r="4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      className="text-[#c9965a] animate-ping"
                      style={{ animationDuration: '2s' }}
                    />
                  )}
                </g>
              );
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[6px] md:text-[8px] font-mono text-[#3a210d] dark:text-[#c9965a] uppercase">
              {telemetry.driveMode}
            </span>
          </div>
        </div>
      </div>

      {/* Status indicator - subtle and mechanical */}
      <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
        <div className={`w-1 h-1 rounded-full ${isActive ? 'bg-[#c9965a]' : 'bg-[#3a210d]/30 dark:bg-[#c9965a]/30'}`} />
        <span className="text-[6px] md:text-[8px] font-mono text-[#3a210d]/50 dark:text-[#c9965a]/50 tracking-widest">
          {isActive ? 'ENGINE ACTIVE' : 'STANDBY'}
        </span>
      </div>

      {/* Subtle engine vibration simulation */}
      {isRevving && (
        <>
          <div className="absolute inset-0 rounded-full border border-[#c9965a]/10 animate-pulse" style={{ animationDuration: '1.5s' }} />
          <div className="absolute inset-4 rounded-full border border-[#c9965a]/5 animate-pulse" style={{ animationDuration: '1s' }} />
        </>
      )}
    </div>
  );
};