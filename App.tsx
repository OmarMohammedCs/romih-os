
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AppView, Section, Language } from './types';
import { getSections, UI_STRINGS } from './constants';
import { Engine } from './components/Engine';
import { SectionPage } from './components/SectionPage';
import { soundManager } from './utils/soundManager';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('intro');
  const [lang, setLang] = useState<Language>('en');
  const [currentSectionId, setCurrentSectionId] = useState<string | null>(null);
  const [hoveredSectionId, setHoveredSectionId] = useState<string | null>(null);
  const [hubVisible, setHubVisible] = useState(false);
  const [engineEntryPulse, setEngineEntryPulse] = useState(false);
  const [isMuted] = useState(false); // Audio is now always 'Live' (unmuted) by default
  const [introVisible, setIntroVisible] = useState(true);
  const [hubActive, setHubActive] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const sections = useMemo(() => getSections(lang), [lang]);
  const currentSection = sections.find(s => s.id === currentSectionId);
  const trans = UI_STRINGS[lang];

  useEffect(() => {
    soundManager.setMuted(isMuted);
  }, [isMuted]);

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  const triggerHubEntrySequence = useCallback(() => {
    // Engine entry pulse (mechanical feel)
    setEngineEntryPulse(true);
    // After a quick pulse, start revealing the labels sequentially
    setTimeout(() => {
      setEngineEntryPulse(false);
      setHubVisible(true);
    }, 120);
  }, []);

  useEffect(() => {
    if (view === 'intro') {
      // 3s delay for intro before starting crossfade
      const timer = setTimeout(() => {
        setIsTransitioning(true);
        setIntroVisible(false); // Fades out over 800ms
        setHubActive(true);      // Fades in over 800ms
        
        // At the 600ms mark of the 800ms crossfade, start the engine reveal 
        // to blend the motion with the tail end of the fade.
        setTimeout(() => {
          setView('hub');
          triggerHubEntrySequence();
          // Clear transition state shortly after
          setTimeout(() => setIsTransitioning(false), 400);
        }, 800); 
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [view, triggerHubEntrySequence]);

  const handleSectionClick = (sectionId: string) => {
    soundManager.playClick();
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSectionId(sectionId);
      setView('section');
      setTimeout(() => setIsTransitioning(false), 400);
    }, 200);
  };

  const handleBackToHub = () => {
    soundManager.playClick();
    setIsTransitioning(true);
    setTimeout(() => {
      setView('hub');
      setHubVisible(false);
      triggerHubEntrySequence();
      setTimeout(() => setIsTransitioning(false), 400);
    }, 200);
  };

  const currentRotation = useMemo(() => {
    if (!hoveredSectionId) return 0;
    if (hoveredSectionId === 'os') return 0;
    const index = sections.slice(1).findIndex(s => s.id === hoveredSectionId);
    const baseRotation = 35 + (index * 16);
    return lang === 'ar' ? -baseRotation : baseRotation;
  }, [hoveredSectionId, sections, lang]);

  const renderIntro = () => (
    <div className={`fixed inset-0 bg-[#080808] flex flex-col items-center justify-center z-[100] transition-opacity duration-[800ms] ease-in-out ${introVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="relative w-32 h-32 md:w-48 md:h-48 mb-12 opacity-40">
         <div className="absolute inset-0 border border-neutral-900 rounded-full scale-125" />
         <div className="absolute inset-4 border border-neutral-900 rounded-full" />
         <div className="absolute inset-0 flex items-center justify-center">
           <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse red-glow" />
         </div>
      </div>
      <h1 className="text-neutral-600 mono text-[9px] md:text-[11px] tracking-[0.8em] font-light animate-pulse uppercase">Bin Romih OS</h1>
    </div>
  );

  const LoadingOverlay = () => (
    <div className={`fixed inset-0 z-[200] pointer-events-none transition-opacity duration-500 ${isTransitioning ? 'opacity-100' : 'opacity-0'}`}>
       <div className="absolute top-0 left-0 w-full h-[1px] bg-red-600 shadow-[0_0_10px_rgba(255,0,0,0.5)]" />
       <div className={`absolute bottom-6 end-6 md:bottom-12 md:end-12 mono text-[8px] text-red-600/60 tracking-[0.4em] uppercase transition-transform duration-500 ${isTransitioning ? 'translate-y-0' : 'translate-y-4'}`}>
         {lang === 'en' ? 'EXECUTING_PROTOCOL...' : 'تنفيذ_البروتوكول...'}
       </div>
    </div>
  );

  if (view === 'section' && currentSection) {
    return (
      <div className="relative min-h-screen bg-[#080808] text-neutral-300">
        <LoadingOverlay />
        <SectionPage section={currentSection} onBack={handleBackToHub} lang={lang} />
        <div className="fixed bottom-4 end-4 md:bottom-10 md:end-10 z-50 flex gap-4 md:gap-6 items-center flex-row-reverse bg-black/40 backdrop-blur-md p-2 rounded-full md:bg-transparent">
           <LangControl lang={lang} onToggle={() => setLang(l => l === 'en' ? 'ar' : 'en')} />
           <AudioStatus lang={lang} />
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-[#080808] flex items-center justify-center relative overflow-hidden transition-opacity duration-[800ms] ease-in-out ${hubActive ? 'opacity-100' : 'opacity-0'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      <div className="absolute inset-0 vignette z-0" />
      <LoadingOverlay />
      
      {introVisible && renderIntro()}
      
      {(view === 'hub' || hubActive) && (
        <>
          <div className="fixed bottom-4 end-4 md:bottom-10 md:end-10 z-50 flex gap-4 md:gap-6 items-center flex-row-reverse">
             <LangControl lang={lang} onToggle={() => setLang(l => l === 'en' ? 'ar' : 'en')} />
             <AudioStatus lang={lang} />
          </div>
          
          <div className="relative w-full max-w-7xl h-full flex flex-col md:flex-row items-center justify-center py-20 px-8 z-10">
            
            <div 
              className={`relative transition-all duration-700 md:-translate-x-24 rtl:md:translate-x-24 ${engineEntryPulse ? 'engine-entry-pulse' : ''}`}
              onMouseEnter={() => setHoveredSectionId('os')}
              onMouseLeave={() => setHoveredSectionId(null)}
            >
              <Engine 
                onClick={() => handleSectionClick(sections[0].id)}
                activeSegment={hoveredSectionId}
                rotation={currentRotation}
                lang={lang}
              />
            </div>

            <div className="mt-16 md:mt-0 flex flex-col gap-5 md:gap-8 md:translate-x-12 rtl:md:-translate-x-12">
              {sections.slice(1).map((section, index) => {
                const isHovered = hoveredSectionId === section.id;
                // Faster stagger to fit tightly within the sequence (approx 450ms total reveal time)
                const delay = index * 55; 
                return (
                  <div 
                    key={section.id} 
                    className={`flex items-center group transition-all duration-300 ease-out ${hubVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8 rtl:translate-x-8'}`}
                    style={{ transitionDelay: `${delay}ms` }}
                    onMouseEnter={() => setHoveredSectionId(section.id)}
                    onMouseLeave={() => setHoveredSectionId(null)}
                    onClick={() => handleSectionClick(section.id)}
                  >
                    <div className="flex items-center me-8 pointer-events-none">
                       <div className={`w-3.5 h-3.5 rounded-full border border-neutral-700 transition-all duration-500 flex items-center justify-center ${isHovered ? 'bg-red-600 border-red-400 red-glow' : 'bg-neutral-950 shadow-[inset_0_1px_3px_rgba(255,255,255,0.05)]'}`}>
                          {isHovered && <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />}
                       </div>
                       <div className={`h-[1px] bg-neutral-800 transition-all duration-500 origin-inline-start ${isHovered ? 'w-24 md:w-32 bg-neutral-500 scale-x-110 red-glow' : 'w-10 md:w-16'}`} />
                    </div>

                    <button className="flex flex-col items-start cursor-pointer text-start group">
                      <span className={`mono text-[8px] md:text-[10px] mb-1 tracking-[0.3em] font-medium transition-all duration-500 ${isHovered ? 'text-red-500 scale-105 red-glow' : 'text-neutral-700'}`}>
                        REF_0{index + 1}
                      </span>
                      <span className={`text-sm md:text-2xl font-bold uppercase tracking-[0.2em] transition-all duration-500 ${isHovered ? 'text-white translate-x-3 rtl:-translate-x-3 scale-[1.05] drop-shadow-[0_0_5px_rgba(255,255,255,0.3)]' : 'text-neutral-500'}`}>
                        {section.title}
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="fixed bottom-6 start-6 md:bottom-12 md:start-12 mono text-[8px] md:text-[10px] text-neutral-800 tracking-[0.5em] leading-loose select-none">
            {trans.version}: 3.2.0_STEEL<br/>
            {trans.status}: {trans.operational}
          </div>
          
          <div className="fixed top-6 end-6 md:top-12 md:end-12 mono text-[8px] md:text-[10px] text-neutral-800 tracking-[0.5em] text-end select-none">
            {trans.coordX}: 34.02<br/>
            {trans.coordY}: 118.24
          </div>
        </>
      )}
    </div>
  );
};

const AudioStatus: React.FC<{lang: Language}> = ({ lang }) => (
  <div className="mono text-[10px] text-white/80 transition-colors tracking-[0.2em] flex items-center gap-2 select-none">
    <span>{lang === 'ar' ? 'صوت_مباشر' : 'AUDIO_LIVE'}</span>
    <span className="w-2 h-2 rounded-full border border-red-400 bg-red-600 red-glow animate-pulse" />
  </div>
);

const LangControl: React.FC<{lang: Language, onToggle: () => void}> = ({ lang, onToggle }) => (
  <button onClick={onToggle} className="mono text-[10px] text-neutral-600 hover:text-white transition-colors tracking-[0.2em] border-e border-neutral-900 pe-6 me-6">
    {lang === 'en' ? 'AR_PROTOCOL' : 'EN_PROTOCOL'}
  </button>
);

export default App;
