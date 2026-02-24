import React, { useEffect, useRef } from 'react';
import { Topic, Option } from '../types';

interface TopicPanelProps {
  topic: Topic;
  isOpen: boolean;
  onToggle: () => void;
  lang?: string;
}

export const TopicPanel: React.FC<TopicPanelProps> = ({ topic, isOpen, onToggle, lang = 'en' }) => {
  const [openOptionId, setOpenOptionId] = React.useState<string | null>(null);
  const [isHovered, setIsHovered] = React.useState(false);
  const [pulseEffect, setPulseEffect] = React.useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const isAr = lang === 'ar';

  const handleTopicClick = () => {
    if (topic.isLocked) {
      setPulseEffect(true);
      setTimeout(() => setPulseEffect(false), 500);
      return;
    }
    onToggle();
  };

  const handleOptionClick = (option: Option) => {
    if (option.isLocked) return;
    setOpenOptionId(openOptionId === option.id ? null : option.id);
  };

  useEffect(() => {
    if (panelRef.current) {
      panelRef.current.style.animation = 'slideInRight 0.5s ease-out forwards';
    }
  }, []);

  return (
    <div 
      ref={panelRef}
      className={`
        relative overflow-hidden transition-all duration-700 border-b border-amber-500/10
        ${isOpen ? 'bg-gradient-to-r from-amber-500/5 via-transparent to-transparent' : ''}
        ${topic.isLocked ? 'opacity-70' : ''}
        ${pulseEffect ? 'animate-shake' : ''}
        hover:border-amber-500/20
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* Animated background particles for open state */}
      {isOpen && !topic.isLocked && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-amber-500/20 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.5}s`,
                animationDuration: `${3 + i}s`
              }}
            />
          ))}
        </div>
      )}

      {/* Locked pattern animation */}
      {topic.isLocked && (
        <>
          <div className="absolute inset-0 locked-pattern opacity-10 animate-slide" />
          <div className="absolute inset-0 scanline" />
        </>
      )}

      {/* Decorative corner accents with animation */}
      <div className={`
        absolute top-0 left-0 w-12 h-12 border-l-2 border-t-2 
        transition-all duration-700 ease-out
        ${isOpen ? 'border-amber-500 animate-cornerPulse' : 'border-amber-500/20'}
        ${isHovered && !topic.isLocked ? 'scale-110' : ''}
      `} />
      <div className={`
        absolute bottom-0 right-0 w-12 h-12 border-r-2 border-b-2 
        transition-all duration-700 ease-out
        ${isOpen ? 'border-amber-500 animate-cornerPulse' : 'border-amber-500/20'}
        ${isHovered && !topic.isLocked ? 'scale-110' : ''}
      `} />
      
      <button
        onClick={handleTopicClick}
        className={`
          w-full flex items-center justify-between py-8 px-6 md:px-8 
          transition-all duration-500 relative z-10 group
          ${topic.isLocked 
            ? 'cursor-not-allowed' 
            : 'hover:bg-gradient-to-r hover:from-amber-500/5 hover:via-transparent hover:to-transparent cursor-pointer'
          }
        `}
        disabled={topic.isLocked}
      >
        <div className="flex items-center gap-4 md:gap-6">
          {/* Animated status indicator */}
          <div className="relative">
            <div className={`
              w-3 h-8 transition-all duration-500 rounded-sm
              ${isOpen 
                ? 'bg-gradient-to-b from-amber-500 to-stone-500 scale-y-125 animate-pulseSoft' 
                : topic.isLocked 
                  ? 'bg-stone-300/20 border border-stone-400/30' 
                  : 'bg-gradient-to-b from-stone-400 to-stone-500 group-hover:from-amber-500 group-hover:to-stone-500'
              }
            `} />
            
            {/* Animated ping effect for open state */}
            {isOpen && (
              <>
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75" />
                  <span className="relative inline-flex rounded-full w-2 h-2 bg-amber-500" />
                </span>
                <span className="absolute inset-0 animate-ripple rounded-sm border border-amber-500/30" />
              </>
            )}
          </div>
          
          <div className="flex flex-col items-start gap-1">
            <span className={`
              mono text-sm md:text-base tracking-[0.15em] uppercase 
              transition-all duration-300 font-light relative
              ${isOpen 
                ? 'text-stone-800 dark:text-stone-200 animate-glow' 
                : topic.isLocked 
                  ? 'text-stone-400 line-through decoration-1' 
                  : 'text-stone-600 group-hover:text-stone-800 dark:text-stone-400 dark:group-hover:text-stone-200'
              }
            `}>
              {topic.title}
              
              {/* Animated underline for open state */}
              {isOpen && !topic.isLocked && (
                <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-amber-500 to-transparent animate-slideIn" />
              )}
            </span>
            
            {/* Animated subtitle */}
            {isOpen && !topic.isLocked && (
              <span className="text-[8px] mono text-amber-500/60 tracking-[0.3em] uppercase animate-fadeIn">
                {isAr ? 'قسم نشط' : 'ACTIVE_SECTION'}
              </span>
            )}
          </div>
        </div>
        
        {topic.isLocked ? (
          <div className="flex items-center gap-3 animate-slideInRight">
            <span className="text-[8px] md:text-[10px] mono text-stone-500 tracking-[0.25em] font-light uppercase italic bg-stone-500/5 px-3 py-1.5 rounded-sm backdrop-blur-sm border border-stone-500/10">
              🔒 {isAr ? 'مقفل' : 'LOCKED'}
            </span>
            <span className="text-[10px] md:text-xs mono text-white bg-gradient-to-r from-stone-700 to-stone-900 px-4 py-2 rounded-sm tracking-[0.15em] font-light shadow-lg border border-amber-500/20">
              {isAr ? 'مؤمن' : 'SECURED'}
            </span>
          </div>
        ) : (
          /* Animated arrow */
          <div className={`
            relative w-6 h-6 transition-all duration-700
            ${isOpen ? 'rotate-180' : 'rotate-0'}
          `}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className={`
                w-3 h-3 border-r-2 border-b-2 border-stone-600 dark:border-stone-400
                transition-all duration-500 transform
                ${isOpen ? 'rotate-45 translate-y-1' : '-rotate-45 group-hover:translate-x-1 group-hover:translate-y-1'}
              `} />
            </div>
            {/* Arrow glow effect on hover */}
            {isHovered && !topic.isLocked && (
              <div className="absolute inset-0 animate-ping bg-amber-500/20 rounded-full" />
            )}
          </div>
        )}
      </button>

      {isOpen && !topic.isLocked && topic.options && (
        <div className="px-8 md:px-12 pb-10 space-y-5">
          {/* Animated connector line */}
          <div className="relative">
            <div className={`absolute ${isAr ? 'right-[23px]' : 'left-[23px]'} top-0 bottom-0 w-[2px]`}>
              <div className="absolute inset-0 bg-gradient-to-b from-amber-500/30 via-amber-500/20 to-transparent animate-pulseSoft" />
              {/* Flowing light effect */}
              <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-amber-500/40 to-transparent animate-flow" />
            </div>
            
            <div className={`pt-4 flex flex-col gap-5 ${isAr ? 'me-10 pe-6' : 'ms-10 ps-6'}`}>
              {topic.options.map((option, index) => (
                <div 
                  key={option.id} 
                  className="flex flex-col relative"
                  style={{ 
                    animation: `slideInRight 0.5s ease-out ${index * 0.1}s both`
                  }}
                >
                  <button
                    onClick={() => handleOptionClick(option)}
                    className={`
                      flex items-center ${isAr ? 'flex-row-reverse' : ''} gap-5 text-[11px] md:text-sm mono tracking-[0.2em] py-3 
                      text-start uppercase transition-all duration-500 relative group/option
                      hover:translate-x-2
                      ${option.isLocked 
                        ? 'cursor-not-allowed opacity-60' 
                        : 'text-stone-500 hover:text-stone-800 dark:text-stone-400 dark:hover:text-stone-200 cursor-pointer'
                      }
                    `}
                    disabled={option.isLocked}
                  >
                    {/* Animated status dot */}
                    <div className="relative">
                      <div className={`
                        w-3 h-3 rotate-45 transition-all duration-500
                        ${openOptionId === option.id 
                          ? 'bg-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.7)] animate-pulseSoft' 
                          : 'bg-stone-300 group-hover/option:bg-stone-400 group-hover/option:shadow-md'
                        }
                        ${option.isLocked ? 'bg-stone-300/30' : ''}
                      `} />
                      
                      {/* Ripple effect on click */}
                      {openOptionId === option.id && (
                        <>
                          <span className="absolute -inset-1 border border-amber-500/30 rotate-45 animate-ping" />
                          <span className="absolute -inset-2 border border-amber-500/10 rotate-45 animate-pulse" />
                        </>
                      )}
                    </div>
                    
                    <span className={`
                      transition-all duration-500 relative
                      ${openOptionId === option.id ? (isAr ? '-translate-x-3' : 'translate-x-3') : ''}
                      ${option.isLocked ? 'text-stone-400 italic line-through decoration-1' : ''}
                    `}>
                      {option.title}
                      
                      {/* Animated underline on hover */}
                      {!option.isLocked && (
                        <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-amber-500 transition-all duration-500 group-hover/option:w-full" />
                      )}
                    </span>

                    {option.isLocked && (
                      <span className={`text-[7px] md:text-[9px] text-stone-400 border border-stone-400/20 px-3 py-1 ${isAr ? 'mr-auto' : 'ms-auto'} font-light italic rounded-sm bg-white/30 backdrop-blur-sm animate-pulseSoft`}>
                        ⚡ {isAr ? 'مقفل' : 'LOCKED'}
                      </span>
                    )}
                  </button>
                  
                  {/* Deep info with dramatic reveal animation */}
                  {openOptionId === option.id && option.deepInfo && (
                    <div className={`mt-5 mb-3 ${isAr ? 'me-12' : 'ms-12'} p-6 bg-gradient-to-br from-white/50 to-white/30 dark:from-stone-800/50 dark:to-stone-900/30 border-l-4 border-amber-500 rounded-r-xl relative overflow-hidden shadow-lg backdrop-blur-sm`}>
                      {/* Animated background elements */}
                      <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute -inset-[100%] animate-rotate bg-gradient-to-r from-transparent via-amber-500/10 to-transparent" />
                      </div>
                      
                      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-3xl animate-pulseSoft" />
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-stone-500/10 rounded-full blur-2xl animate-pulseSoft" style={{ animationDelay: '1s' }} />
                      
                      {/* Content with fade-in animation */}
                      <div className={`relative z-10 flex gap-4 animate-slideInLeft ${isAr ? 'flex-row-reverse' : ''}`}>
                        <span className="text-amber-500 text-lg md:text-xl font-mono opacity-50 animate-bounce">#</span>
                        <div className="flex-1">
                          <p className="text-[11px] md:text-[14px] mono text-stone-700 dark:text-stone-300 leading-relaxed uppercase tracking-widest font-light">
                            {option.deepInfo.content}
                          </p>
                          
                          {/* Typewriter effect for metadata if available */}
                          {option.deepInfo.metadata && (
                            <div className="mt-4 text-[8px] md:text-[10px] text-stone-400 border-t border-stone-400/20 pt-3 animate-fadeIn">
                              {option.deepInfo.metadata}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Animated corner */}
                      <div className={`absolute bottom-2 ${isAr ? 'left-2' : 'right-2'} w-6 h-6 ${isAr ? 'border-l-2' : 'border-r-2'} border-b-2 border-amber-500/20 animate-pulseSoft`} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(${isAr ? '-30px' : '30px'});
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(${isAr ? '20px' : '-20px'});
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
          }
          50% {
            opacity: 0.7;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-10px) translateX(5px);
          }
          50% {
            transform: translateY(-5px) translateX(-5px);
          }
          75% {
            transform: translateY(5px) translateX(5px);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }

        @keyframes flow {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }

        @keyframes cornerPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.1); }
        }

        @keyframes glow {
          0%, 100% { text-shadow: 0 0 5px rgba(245, 158, 11, 0.3); }
          50% { text-shadow: 0 0 15px rgba(245, 158, 11, 0.5); }
        }

        @keyframes ripple {
          0% { transform: scale(0.8); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }

        @keyframes rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .animate-slideInRight {
          animation: slideInRight 0.5s ease-out forwards;
        }

        .animate-slideInLeft {
          animation: slideInLeft 0.5s ease-out forwards;
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }

        .animate-pulseSoft {
          animation: pulseSoft 2s ease-in-out infinite;
        }

        .animate-float {
          animation: float 4s ease-in-out infinite;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        .animate-flow {
          animation: flow 3s linear infinite;
        }

        .animate-cornerPulse {
          animation: cornerPulse 2s ease-in-out infinite;
        }

        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }

        .animate-ripple {
          animation: ripple 2s ease-out infinite;
        }

        .locked-pattern {
          background-image: repeating-linear-gradient(
            45deg,
            transparent,
            transparent 10px,
            rgba(245, 158, 11, 0.05) 10px,
            rgba(245, 158, 11, 0.05) 20px
          );
        }

        .scanline {
          background: linear-gradient(
            to bottom,
            transparent,
            rgba(245, 158, 11, 0.1),
            transparent
          );
          animation: flow 6s linear infinite;
        }
      `}</style>
    </div>
  );
};