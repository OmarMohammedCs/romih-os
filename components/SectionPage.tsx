import React, { useEffect, useRef, useState } from 'react';
import { Section, Language } from '../types';
import { TopicPanel } from './TopicPanel';
import { UI_STRINGS } from '../constants';

interface SectionPageProps {
  section: Section;
  onBack: () => void;
  lang: Language;
}

export const SectionPage: React.FC<SectionPageProps> = ({ section, onBack, lang }) => {
  const [expandedTopicId, setExpandedTopicId] = React.useState<string | null>(null);
  const [pageEntered, setPageEntered] = useState(false);
  const [headerGlow, setHeaderGlow] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  const isAr = lang === 'ar';
  const trans = UI_STRINGS[lang];

  // Entrance animations
  useEffect(() => {
    setPageEntered(true);
    
    // Sequential glow effect
    setTimeout(() => setHeaderGlow(true), 500);
    setTimeout(() => setHeaderGlow(false), 1500);

    // Parallax effect on scroll
    const handleScroll = () => {
      if (headerRef.current && mainRef.current && footerRef.current) {
        const scrolled = window.scrollY;
        headerRef.current.style.transform = `translateY(${scrolled * 0.1}px)`;
        mainRef.current.style.transform = `translateY(${scrolled * -0.05}px)`;
        footerRef.current.style.opacity = `${0.6 + (scrolled * 0.001)}`;
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleTopicToggle = (id: string) => {
    setExpandedTopicId(prev => prev === id ? null : id);
  };

  return (
    <div 
      className={`
        min-h-screen text-[#3a210d] flex flex-col relative z-10
        transition-all duration-1000
        ${pageEntered ? 'opacity-100' : 'opacity-0'}
      `} 
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* Animated background particles */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-[#c9965a]/10 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${i * 0.2}s`,
              animationDuration: `${10 + i * 2}s`,
              transform: `scale(${0.5 + Math.random()})`
            }}
          />
        ))}
      </div>

      {/* Animated gradient orbs */}
      <div className="fixed top-0 left-0 w-96 h-96 bg-[#c9965a]/5 rounded-full blur-3xl animate-pulseSoft" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-[#3a210d]/5 rounded-full blur-3xl animate-pulseSoft" style={{ animationDelay: '2s' }} />

      {/* Header with glass morphism and animations */}
      <header 
        ref={headerRef}
        className={`
          p-6 md:p-10 border-b border-[#3a210d]/10 flex justify-between items-center 
          sticky top-0 bg-white/70 dark:bg-[#1a1a1a]/70 backdrop-blur-2xl z-20 
          shadow-lg transition-all duration-700
          ${pageEntered ? 'translate-y-0' : '-translate-y-full'}
        `}
      >
        <button 
          onClick={onBack}
          className="
            mono text-[10px] md:text-xs text-[#9f7952] hover:text-[#3a210d] 
            transition-all duration-500 tracking-[0.4em] flex items-center gap-3 
            font-black italic group relative overflow-hidden
            hover:scale-105
          "
        >
          {/* Animated background on hover */}
          <span className="absolute inset-0 bg-gradient-to-r from-[#3a210d]/0 via-[#3a210d]/5 to-[#3a210d]/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          
          <span className="relative z-10 flex items-center gap-3">
            <span className={`
              transition-transform duration-500 group-hover:-translate-x-2
              ${isAr ? 'rotate-180' : ''}
            `}>
              {isAr ? '→' : '←'}
            </span>
            <span className="relative">
              {isAr ? trans.system : 'BACK_TO_HUB'}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#3a210d] group-hover:w-full transition-all duration-500" />
            </span>
          </span>
        </button>

        <div className="flex flex-col items-end">
          {/* Animated status lights */}
          <div className="flex gap-2 mb-2 relative">
            <div className="relative">
              <div className="w-1.5 h-1.5 bg-[#3a210d] rounded-full animate-pulseSoft" />
              <span className="absolute -inset-1 border border-[#3a210d]/30 rounded-full animate-ping" />
            </div>
            <div className="relative">
              <div className="w-1.5 h-1.5 bg-[#c9965a] rounded-full animate-pulseSoft" style={{ animationDelay: '0.5s' }} />
              <span className="absolute -inset-1 border border-[#c9965a]/30 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
            </div>
            <div className="relative">
              <div className="w-1.5 h-1.5 bg-[#d4d5cf] rounded-full animate-pulseSoft" style={{ animationDelay: '1s' }} />
              <span className="absolute -inset-1 border border-[#d4d5cf]/30 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
            </div>
          </div>

          {/* Title with glow effect */}
          <div className="relative">
            <h1 className={`
              text-sm md:text-4xl font-black tracking-tighter uppercase 
              text-[#3a210d] truncate max-w-[200px] md:max-w-none 
              italic drop-shadow-lg transition-all duration-700
              ${headerGlow ? 'animate-glow' : ''}
            `}>
              {section.title}
            </h1>
            
            {/* Animated underline */}
            <span className={`
              absolute -bottom-2 left-0 h-[2px] bg-gradient-to-r from-[#3a210d] to-[#c9965a]
              transition-all duration-1000
              ${pageEntered ? 'w-full' : 'w-0'}
            `} />
          </div>

          {/* Section number with typing effect */}
          <span className="
            mono text-[8px] md:text-[10px] text-[#9f7952] tracking-widest 
            font-black italic mt-1 uppercase relative overflow-hidden
          ">
            <span className="inline-block animate-slideInRight">
              BIN ROMIH OFFICE // UNIT_{section.number}
            </span>
          </span>
        </div>
      </header>

      {/* Main content with staggered animation */}
      <main 
        ref={mainRef}
        className="max-w-5xl w-full mx-auto flex-grow py-12 md:py-20 px-4 md:px-8"
      >
        <div className={`
          border border-[#3a210d]/10 bg-white/30 dark:bg-[#1a1a1a]/30 
          backdrop-blur-xl rounded-sm shadow-[0_40px_100px_rgba(58,33,13,0.12)] 
          overflow-hidden transition-all duration-1000
          hover:shadow-[0_40px_120px_rgba(58,33,13,0.15)]
          ${pageEntered ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
        `}>
          {section.topics.map((topic, index) => (
            <div
              key={topic.id}
              className="animate-slideInUp"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <TopicPanel 
                topic={topic} 
                isOpen={expandedTopicId === topic.id}
                onToggle={() => handleTopicToggle(topic.id)}
              />
            </div>
          ))}
        </div>

        {/* Decorative elements */}
        <div className="flex justify-center mt-8 gap-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`
                w-1 h-1 bg-[#3a210d]/20 rounded-full
                transition-all duration-500
                ${pageEntered ? 'opacity-100' : 'opacity-0'}
              `}
              style={{ 
                transitionDelay: `${i * 0.1}s`,
                animation: `pulseSoft 2s ease-in-out ${i * 0.2}s infinite`
              }}
            />
          ))}
        </div>
      </main>

      {/* Footer with parallax */}
      <footer 
        ref={footerRef}
        className="
          p-12 border-t border-[#3a210d]/10 text-center 
          bg-gradient-to-b from-transparent to-white/20 
          dark:to-black/20 relative overflow-hidden
        "
      >
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml,...')] animate-slide" />
        </div>

        <p className="
          mono text-[9px] md:text-[11px] tracking-[0.6em] 
          text-[#3a210d]/60 font-black italic uppercase
          relative z-10 animate-fadeIn
        ">
          {isAr ? 'مكتب بن رميح الاستراتيجي — جميع الحقوق محفوظة' : 'BIN ROMIH STRATEGIC OFFICE — ALL RIGHTS RESERVED'}
        </p>

        {/* Animated year */}
        <div className="absolute bottom-4 right-4 text-[8px] text-[#3a210d]/30 mono">
          <span className="animate-pulseSoft">© 2024</span>
        </div>
      </footer>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes pulseSoft {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.1);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(-10px) translateX(-10px);
          }
          75% {
            transform: translateY(10px) translateX(10px);
          }
        }

        @keyframes glow {
          0%, 100% {
            text-shadow: 0 0 10px rgba(58, 33, 13, 0.3),
                         0 0 20px rgba(201, 150, 90, 0.2);
          }
          50% {
            text-shadow: 0 0 20px rgba(58, 33, 13, 0.5),
                         0 0 40px rgba(201, 150, 90, 0.3);
          }
        }

        @keyframes slide {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(100%);
          }
        }

        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-slideInUp {
          animation: slideInUp 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }

        .animate-slideInRight {
          animation: slideInRight 0.5s ease-out forwards;
        }

        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }

        .animate-pulseSoft {
          animation: pulseSoft 3s ease-in-out infinite;
        }

        .animate-float {
          animation: float 15s ease-in-out infinite;
        }

        .animate-glow {
          animation: glow 2s ease-in-out;
        }

        .animate-slide {
          animation: slide 8s linear infinite;
        }
      `}</style>
    </div>
  );
};