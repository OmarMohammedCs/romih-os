import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { AppView, Section, Language, Theme } from './types';
import { getSections, UI_STRINGS } from './constants';
import { Engine } from './components/Engine';
import { SectionPage } from './components/SectionPage';
import { ThemeProvider, useTheme } from './context/ThemeContext';

const playClickSound = () => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
    
    gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.05);
  } catch (e) {
    //ignore errors
  }
};

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('intro');
  const [lang, setLang] = useState<Language>('en');
  const [currentSectionId, setCurrentSectionId] = useState<string | null>(null);
  const [hoveredSectionId, setHoveredSectionId] = useState<string | null>(null);
  const [introVisible, setIntroVisible] = useState(true);
  const [hubActive, setHubActive] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [engineClicked, setEngineClicked] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const sections = useMemo(() => getSections(lang), [lang]);
  const currentSection = sections.find(s => s.id === currentSectionId);
  const trans = UI_STRINGS[lang];

 
  const engineRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  useEffect(() => {
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(theme);
  }, [theme]);

  useEffect(() => {
    if (view === 'intro') {
      const timer = setTimeout(() => {
        setIsTransitioning(true);
        setIntroVisible(false);
        setHubActive(true);
        
        setTimeout(() => {
          setView('hub');
          setTimeout(() => setIsTransitioning(false), 400);
        }, 800); 
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [view]);

  const handleSectionClick = (sectionId: string) => {
    playClickSound();
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSectionId(sectionId);
      setView('section');
      setTimeout(() => setIsTransitioning(false), 400);
    }, 200);
  };

  const handleBackToHub = () => {
    playClickSound();
    setIsTransitioning(true);
    setTimeout(() => {
      setView('hub');
      setEngineClicked(false);
      setTimeout(() => setIsTransitioning(false), 400);
    }, 200);
  };

  const handleEngineClick = () => {
    playClickSound();
    if (!engineClicked) {
      setEngineClicked(true);
    }
  };

 
  const getSectionPosition = (index: number) => {
    const totalSections = sections.length - 1;
    const angles = [
      -45,  
      0,     
      45,    
      90, 
      135, 
      180,    
      225   
    ];
    
  
    let angle = angles[index];
    if (lang === 'ar') {
      angle = -angle;
    }
    
    
    const radian = (angle * Math.PI) / 180;
    
   
    const baseRadius = window.innerWidth < 640 ? 160 : 220;
    const radius = baseRadius * (window.innerWidth < 1024 ? 0.9 : 1);
    
    const x = Math.sin(radian) * radius;
    const y = -Math.cos(radian) * radius;  
    
    return { x, y, angle };
  };

  const currentRotation = useMemo(() => {
    if (!hoveredSectionId) return 0;
    if (hoveredSectionId === 'os') return 0;
    const index = sections.slice(1).findIndex(s => s.id === hoveredSectionId);
    const baseRotation = 30 + (index * 15);
    return lang === 'ar' ? -baseRotation : baseRotation;
  }, [hoveredSectionId, sections, lang]);

  const renderIntro = () => (
    <div className={`fixed inset-0 bg-[#e3e4df] dark:bg-[#1a1a1a] flex flex-col items-center justify-center z-[100] transition-opacity duration-[800ms] ease-in-out ${introVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="absolute inset-0 leather-texture dark:opacity-10 z-0" />
      <div className="relative z-10 flex flex-col items-center px-4">
        <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-48 md:h-48 mb-8 sm:mb-12 opacity-60">
           <div className="absolute inset-0 border border-[#3a210d]/10 dark:border-[#c9965a]/20 rounded-full scale-125" />
           <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 bg-[#3a210d] dark:bg-[#c9965a] rounded-full animate-pulse shadow-[0_0_20px_rgba(58,33,13,0.3)] dark:shadow-[0_0_20px_rgba(201,150,90,0.3)]" />
           </div>
        </div>
        <h1 className="text-[#3a210d] dark:text-[#c9965a] mono text-[10px] sm:text-[11px] md:text-[13px] tracking-[0.6em] sm:tracking-[0.8em] font-black animate-pulse uppercase italic text-center">BIN ROMIH OFFICE</h1>
      </div>
    </div>
  );

  const LoadingOverlay = () => (
    <div className={`fixed inset-0 z-[200] pointer-events-none transition-opacity duration-500 ${isTransitioning ? 'opacity-100' : 'opacity-0'}`}>
       <div className="absolute top-0 left-0 w-full h-[2px] bg-[#3a210d] dark:bg-[#c9965a] shadow-[0_0_15px_rgba(58,33,13,0.3)] dark:shadow-[0_0_15px_rgba(201,150,90,0.3)]" />
       <div className={`absolute bottom-4 sm:bottom-6 end-4 sm:end-6 md:bottom-12 md:end-12 mono text-[8px] sm:text-[10px] text-[#3a210d] dark:text-[#c9965a] font-black tracking-[0.4em] sm:tracking-[0.5em] uppercase transition-transform duration-500 ${isTransitioning ? 'translate-y-0' : 'translate-y-4'}`}>
         {lang === 'en' ? 'LOADING...' : 'تحميل...'}
       </div>
    </div>
  );

  return (
    <div 
      ref={containerRef}
      className={`min-h-screen bg-[#e3e4df] dark:bg-[#1a1a1a] flex items-center justify-center relative overflow-hidden transition-colors duration-500 ${hubActive || view === 'section' ? 'opacity-100' : 'opacity-0'}`} 
      dir={lang === 'ar' ? 'rtl' : 'ltr'}
    >
      <div className="absolute inset-0 leather-texture dark:opacity-5 z-0 opacity-20" />
      <div className="absolute inset-0 vignette dark:opacity-30 z-0" />
      <LoadingOverlay />
      
      {introVisible && renderIntro()}
      
      {view === 'section' && currentSection ? (
        <div className="relative min-h-screen w-full bg-[#e3e4df] dark:bg-[#1a1a1a] text-[#3a210d] dark:text-[#c9965a] overflow-y-auto">
          <div className="fixed inset-0 leather-texture dark:opacity-5 pointer-events-none" />
          <SectionPage 
            section={currentSection} 
            onBack={handleBackToHub} 
            lang={lang} 
            engineRef={engineRef}
          />
          
          <div className="fixed bottom-2 end-2 sm:bottom-4 sm:end-4 md:bottom-10 md:end-10 z-50 flex gap-2 sm:gap-4 md:gap-6 items-center flex-row-reverse bg-white/40 dark:bg-[#2a2a2a]/60 backdrop-blur-md p-1 sm:p-2 px-2 sm:px-4 rounded-full md:bg-transparent border border-[#3a210d]/5 dark:border-[#c9965a]/10">
             <LangControl lang={lang} onToggle={() => setLang(l => l === 'en' ? 'ar' : 'en')} />
             <ThemeControl theme={theme} onToggle={toggleTheme} />
          </div>
        </div>
      ) : (
        hubActive && (
          <>
            <div className="fixed bottom-2 end-2 sm:bottom-4 sm:end-4 md:bottom-10 md:end-10 z-50 flex gap-2 sm:gap-4 md:gap-6 items-center flex-row-reverse">
               <LangControl lang={lang} onToggle={() => setLang(l => l === 'en' ? 'ar' : 'en')} />
               <ThemeControl theme={theme} onToggle={toggleTheme} />
            </div>
            
            <div className="relative w-full h-screen flex items-center justify-center">
               
              <div 
                ref={engineRef}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer"
                onClick={handleEngineClick}
              >
                <div className="scale-[0.7] xs:scale-[0.8] sm:scale-[0.9] md:scale-100 transition-transform duration-500 hover:scale-[0.72] xs:hover:scale-[0.82] sm:hover:scale-[0.92] md:hover:scale-105">
                  <Engine  
                    activeSegment={engineClicked ? hoveredSectionId : null}
                    rotation={engineClicked ? currentRotation : 0}
                    lang={lang} 
                    isActive={engineClicked}
                  />
                </div>
              </div>

            
              {engineClicked && sections.slice(1).map((section, index) => {
                const pos = getSectionPosition(index);
                const isHovered = hoveredSectionId === section.id;
                
                return (
                  <div
                    key={section.id}
                    className="absolute z-30"
                    style={{
                      left: `calc(50% + ${pos.x}px)`,
                      top: `calc(50% + ${pos.y}px)`,
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                   
                    <div 
                      className={`
                        relative group cursor-pointer transition-all duration-500
                        ${isHovered ? 'scale-110' : 'scale-100'}
                      `}
                      onMouseEnter={() => setHoveredSectionId(section.id)}
                      onMouseLeave={() => setHoveredSectionId(null)}
                      onClick={() => handleSectionClick(section.id)}
                    >
                  
                      <div className={`
                        w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 
                        rounded-full 
                        bg-gradient-to-br from-[#e3e4df] to-[#d4d5cf] 
                        dark:from-[#3a3a3a] dark:to-[#2a2a2a]
                        border-2 
                        ${isHovered 
                          ? 'border-[#c9965a] shadow-[0_0_25px_rgba(201,150,90,0.5)]' 
                          : 'border-[#3a210d]/30 dark:border-[#c9965a]/30'
                        }
                        flex items-center justify-center
                        transition-all duration-300
                        shadow-xl
                      `}>
                     
                        <div className="text-center">
                          <div className={`
                            mono text-[8px] sm:text-[9px] md:text-[10px]
                            ${isHovered ? 'text-[#c9965a]' : 'text-[#3a210d]/50 dark:text-[#c9965a]/50'}
                            transition-colors duration-300
                            font-black tracking-wider
                          `}>
                            UNIT_{index + 1}
                          </div>
                          <div className={`
                            text-[10px] sm:text-xs md:text-sm
                            font-black italic uppercase
                            ${isHovered ? 'text-[#3a210d] dark:text-[#c9965a]' : 'text-[#9f7952] dark:text-[#c9965a]/70'}
                            transition-colors duration-300
                            leading-tight
                          `}>
                            {section.title.split(' ').map((word, i) => (
                              <div key={i}>{word}</div>
                            ))}
                          </div>
                        </div>
                      </div>

                   
                      {isHovered && (
                        <svg 
                          className="absolute pointer-events-none"
                          style={{
                            left: '50%',
                            top: '50%',
                            width: `${Math.abs(pos.x) * 2 + 50}px`,
                            height: `${Math.abs(pos.y) * 2 + 50}px`,
                            transform: 'translate(-50%, -50%)',
                            zIndex: -1
                          }}
                        >
                          <line
                            x1="50%"
                            y1="50%"
                            x2={pos.x > 0 ? '0%' : '100%'}
                            y2={pos.y > 0 ? '0%' : '100%'}
                            stroke="#c9965a"
                            strokeWidth="2"
                            strokeDasharray="5,5"
                            className="opacity-50"
                          />
                        </svg>
                      )}

                  
                      {isHovered && (
                        <div className="absolute inset-0 rounded-full animate-ping border-2 border-[#c9965a]/30" />
                      )}
                    </div>
                  </div>
                );
              })}

        
              {!engineClicked && (
                <div className="absolute left-1/2 top-[60%] -translate-x-1/2 z-30">
                  <div className="mono text-[10px] sm:text-xs text-[#9f7952] dark:text-[#c9965a]/70 animate-pulse tracking-[0.3em] font-black bg-[#e3e4df]/80 dark:bg-[#1a1a1a]/80 px-4 py-2 rounded-full backdrop-blur-sm border border-[#3a210d]/10 dark:border-[#c9965a]/10">
                    {lang === 'ar' ? 'اضغط على المحرك للتحكم' : 'CLICK ENGINE TO CONTROL'}
                  </div>
                </div>
              )}

             
              {engineClicked && (
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] sm:w-[500px] sm:h-[500px] md:w-[600px] md:h-[600px] rounded-full border border-[#3a210d]/10 dark:border-[#c9965a]/10 pointer-events-none">
                  <div className="absolute inset-8 rounded-full border border-[#3a210d]/5 dark:border-[#c9965a]/5 border-dashed" />
                  
               
                  {[...Array(36)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-1 bg-[#3a210d]/20 dark:bg-[#c9965a]/20 rounded-full"
                      style={{
                        left: `${50 + 45 * Math.cos(i * 10 * Math.PI / 180)}%`,
                        top: `${50 + 45 * Math.sin(i * 10 * Math.PI / 180)}%`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

        
            <div className="fixed bottom-2 start-2 3xs:bottom-2 3xs:start-2 2xs:bottom-3 2xs:start-3 xs:bottom-3 xs:start-3 sm:bottom-4 sm:start-4 md:bottom-6 md:start-6 lg:bottom-8 lg:start-8 xl:bottom-12 xl:start-12 mono text-[6px] 3xs:text-[7px] 2xs:text-[7px] xs:text-[8px] sm:text-[9px] md:text-[10px] lg:text-[11px] xl:text-[12px] text-[#3a210d]/50 dark:text-[#c9965a]/50 tracking-[0.2em] sm:tracking-[0.25em] md:tracking-[0.3em] lg:tracking-[0.35em] xl:tracking-[0.4em] leading-loose select-none italic font-bold z-40">
              <span className="hidden xs:inline">{trans.version}: OFFICE_3.2</span>
              <span className="xs:hidden">v3.2</span>
              <br className="hidden xs:block" />
              <span className="hidden xs:inline">{trans.status}: {trans.operational}</span>
            </div>
            
            <div className="fixed top-2 end-2 3xs:top-2 3xs:end-2 2xs:top-3 2xs:end-3 xs:top-3 xs:end-3 sm:top-4 sm:end-4 md:top-6 md:end-6 lg:top-8 lg:end-8 xl:top-12 xl:end-12 mono text-[6px] 3xs:text-[7px] 2xs:text-[7px] xs:text-[8px] sm:text-[9px] md:text-[10px] lg:text-[11px] xl:text-[12px] text-[#3a210d]/50 dark:text-[#c9965a]/50 tracking-[0.2em] sm:tracking-[0.25em] md:tracking-[0.3em] lg:tracking-[0.35em] xl:tracking-[0.4em] text-end select-none font-bold z-40">
              <span className="hidden sm:inline">bin romih office</span>
              <span className="sm:hidden">BROS</span>
              <br className="hidden sm:block" />
              <span className="hidden sm:inline">riyadh | 0558812250</span>
            </div>
          </>
        )
      )}
    </div>
  );
};

const ThemeControl: React.FC<{theme: Theme, onToggle: () => void}> = ({ theme, onToggle }) => {
  const handleClick = () => {
    playClickSound();
    onToggle();
  };

  return (
    <button onClick={handleClick} className="mono text-[8px] 3xs:text-[8px] 2xs:text-[9px] xs:text-[9px] sm:text-[10px] text-[#9f7952] hover:text-[#3a210d] dark:hover:text-[#e3e4df] transition-colors tracking-[0.2em] sm:tracking-[0.25em] md:tracking-[0.3em] font-black border-e border-[#3a210d]/10 dark:border-[#c9965a]/10 pe-2 3xs:pe-2.5 2xs:pe-3 sm:pe-4 md:pe-6 me-2 3xs:me-2.5 2xs:me-3 sm:me-4 md:me-6 flex items-center gap-1 sm:gap-2">
      {theme === 'light' ? (
        <>
          <svg className="w-3 h-3 3xs:w-3 3xs:h-3 2xs:w-3.5 2xs:h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z"/>
          </svg>
          <span className="hidden xs:inline">DARK</span>
          <span className="xs:hidden">🌙</span>
        </>
      ) : (
        <>
          <svg className="w-3 h-3 3xs:w-3 3xs:h-3 2xs:w-3.5 2xs:h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z"/>
          </svg>
          <span className="hidden xs:inline">LIGHT</span>
          <span className="xs:hidden">☀️</span>
        </>
      )}
    </button>
  );
};

const LangControl: React.FC<{lang: Language, onToggle: () => void}> = ({ lang, onToggle }) => {
  const handleClick = () => {
    playClickSound();
    onToggle();
  };

  return (
    <button onClick={handleClick} className="mono text-[8px] 3xs:text-[8px] 2xs:text-[9px] xs:text-[9px] sm:text-[10px] text-[#9f7952] hover:text-[#3a210d] dark:hover:text-[#e3e4df] transition-colors tracking-[0.2em] sm:tracking-[0.25em] md:tracking-[0.3em] font-black border-e border-[#3a210d]/10 dark:border-[#c9965a]/10 pe-2 3xs:pe-2.5 2xs:pe-3 sm:pe-4 md:pe-6 me-2 3xs:me-2.5 2xs:me-3 sm:me-4 md:me-6">
      <span className="hidden xs:inline">{lang === 'en' ? 'AR' : 'EN'}</span>
      <span className="xs:hidden">{lang === 'en' ? 'ع' : 'E'}</span>
    </button>
  );
};

const AppWithTheme: React.FC = () => (
  <ThemeProvider>
    <App />
  </ThemeProvider>
);

export default AppWithTheme;