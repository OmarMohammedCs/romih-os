import React, { useEffect, useRef, useState } from 'react';
import { Section, Language } from '../types';
import { TopicPanel } from './TopicPanel';
import { UI_STRINGS } from '../constants';
import { playClickSound, playBackSound } from '../utils/sound'; // إضافة الأصوات

interface SectionPageProps {
  section: Section;
  onBack: () => void;
  lang: Language;
}

export const SectionPage: React.FC<SectionPageProps> = ({ section, onBack, lang }) => {
  const [expandedTopicId, setExpandedTopicId] = useState<string | null>(null);
  const [pageEntered, setPageEntered] = useState(false);
  const [headerGlow, setHeaderGlow] = useState(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const mainRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);
  const backButtonRef = useRef<HTMLButtonElement>(null);

  const isAr = lang === 'ar';
  const trans = UI_STRINGS[lang];

  // Entrance animations
  useEffect(() => {
    setPageEntered(true);
    
    setTimeout(() => setHeaderGlow(true), 500);
    setTimeout(() => setHeaderGlow(false), 1500);

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
    playClickSound(); // صوت عند فتح/غلق الموضوع
    setExpandedTopicId(prev => prev === id ? null : id);
  };

  // دالة التعامل مع الضغط على زر الرجوع
  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // تأثير بصري فوري
    if (backButtonRef.current) {
      backButtonRef.current.style.transform = 'scale(0.95)';
      setTimeout(() => {
        if (backButtonRef.current) {
          backButtonRef.current.style.transform = '';
        }
      }, 200);
    }
    
    playBackSound(); // صوت الرجوع
    
    console.log('🔙 Back button clicked in SectionPage');
    console.log('Section:', section.title);
    console.log('onBack exists:', !!onBack);
    
    // استدعاء الدالة مع تأخير بسيط للتأثير
    setTimeout(() => {
      if (onBack) {
        console.log('✅ Calling onBack function');
        onBack();
      } else {
        console.error('❌ onBack function is not provided!');
        window.history.back();
      }
    }, 100);
  };

  return (
    <div 
      className={`
        min-h-screen text-stone-800 dark:text-stone-200 flex flex-col relative z-10
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
            className="absolute w-1 h-1 bg-amber-500/20 rounded-full animate-float"
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
      <div className="fixed top-0 left-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulseSoft" />
      <div className="fixed bottom-0 right-0 w-96 h-96 bg-stone-500/10 rounded-full blur-3xl animate-pulseSoft" style={{ animationDelay: '2s' }} />



      {/* Main content */}
      <main 
        ref={mainRef}
        className="max-w-5xl w-full mx-auto flex-grow py-12 md:py-20 px-4 md:px-8"
      >
        <div className={`
          border border-amber-500/10 bg-white/30 dark:bg-stone-900/30 
          backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden 
          transition-all duration-1000
          hover:shadow-2xl hover:border-amber-500/20
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
                lang={lang}
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
                w-1 h-1 bg-amber-500/30 rounded-full
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

        {/* Connection indicator */}
        <div className="flex justify-center items-center gap-3 mt-4">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-xs text-stone-400 dark:text-stone-500 font-mono">
            {isAr ? 'متصل بالشاشة الرئيسية' : 'CONNECTED TO MAIN SCREEN'}
          </span>
        </div>
      </main>

      {/* Footer */}
      <footer 
        ref={footerRef}
        className="
          p-12 border-t border-amber-500/10 text-center 
          bg-gradient-to-b from-transparent to-white/20 
          dark:to-black/20 relative overflow-hidden
        "
      >
        {/* Animated background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(245,158,11,0.1)_1px,_transparent_1px)] bg-[length:20px_20px] animate-slide" />
        </div>

        <p className="
          mono text-[9px] md:text-[11px] tracking-[0.6em] 
          text-stone-400 font-light uppercase
          relative z-10 animate-fadeIn
        ">
          {isAr ? 'مكتب بن رميح — جميع الحقوق محفوظة' : 'BIN ROMIH OFFICE — ALL RIGHTS RESERVED'}
        </p>

        {/* Animated year */}
        <div className="absolute bottom-4 right-4 text-[8px] text-stone-400/30 mono">
          <span className="animate-pulseSoft">© 2024</span>
        </div>

      </footer>

      <style>{`
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
            text-shadow: 0 0 10px rgba(245, 158, 11, 0.3),
                         0 0 20px rgba(245, 158, 11, 0.2);
          }
          50% {
            text-shadow: 0 0 20px rgba(245, 158, 11, 0.5),
                         0 0 40px rgba(245, 158, 11, 0.3);
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