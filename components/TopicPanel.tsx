import React, { useEffect, useRef } from 'react';
import { Topic, Option } from '../types';
import { soundManager } from '../utils/soundManager';

interface TopicPanelProps {
  topic: Topic;
  isOpen: boolean;
  onToggle: () => void;
}

export const TopicPanel: React.FC<TopicPanelProps> = ({ topic, isOpen, onToggle }) => {
  const [openOptionId, setOpenOptionId] = React.useState<string | null>(null);
  const [isHovered, setIsHovered] = React.useState(false);
  const [pulseEffect, setPulseEffect] = React.useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const handleTopicClick = () => {
    if (topic.isLocked) {
      // Play lock sound and shake animation
      soundManager.playClick();
      setPulseEffect(true);
      setTimeout(() => setPulseEffect(false), 500);
      return;
    }
    soundManager.playExpand();
    onToggle();
  };

  const handleOptionClick = (option: Option) => {
    if (option.isLocked) {
      soundManager.playClick();
      return;
    }
    soundManager.playClick();
    setOpenOptionId(openOptionId === option.id ? null : option.id);
  };

  // Entrance animation on mount
  useEffect(() => {
    if (panelRef.current) {
      panelRef.current.style.animation = 'slideInRight 0.5s ease-out forwards';
    }
  }, []);

  return (
    <div 
      ref={panelRef}
      className={`
        relative overflow-hidden transition-all duration-700 border-b border-[#3a210d]/10
        ${isOpen ? 'bg-gradient-to-r from-[#c9965a]/10 via-transparent to-transparent' : ''}
        ${topic.isLocked ? 'opacity-70' : ''}
        ${pulseEffect ? 'animate-shake' : ''}
        hover:border-[#3a210d]/20
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background particles for open state */}
      {isOpen && !topic.isLocked && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-[#c9965a]/20 rounded-full animate-float"
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
        ${isOpen ? 'border-[#3a210d] animate-cornerPulse' : 'border-[#3a210d]/20'}
        ${isHovered && !topic.isLocked ? 'scale-110' : ''}
      `} />
      <div className={`
        absolute bottom-0 right-0 w-12 h-12 border-r-2 border-b-2 
        transition-all duration-700 ease-out
        ${isOpen ? 'border-[#3a210d] animate-cornerPulse' : 'border-[#3a210d]/20'}
        ${isHovered && !topic.isLocked ? 'scale-110' : ''}
      `} />
      
      <button
        onClick={handleTopicClick}
        className={`
          w-full flex items-center justify-between py-8 px-6 md:px-8 
          transition-all duration-500 relative z-10 group
          ${topic.isLocked 
            ? 'cursor-not-allowed' 
            : 'hover:bg-gradient-to-r hover:from-[#3a210d]/10 hover:via-transparent hover:to-transparent cursor-pointer'
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
                ? 'bg-gradient-to-b from-[#3a210d] to-[#c9965a] scale-y-125 animate-pulseSoft' 
                : topic.isLocked 
                  ? 'bg-[#3a210d]/20 border border-[#3a210d]/30' 
                  : 'bg-gradient-to-b from-[#9f7952] to-[#3a210d]/70 group-hover:from-[#3a210d] group-hover:to-[#c9965a]'
              }
            `} />
            
            {/* Animated ping effect for open state */}
            {isOpen && (
              <>
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3a210d] opacity-75" />
                  <span className="relative inline-flex rounded-full w-2 h-2 bg-[#3a210d]" />
                </span>
                {/* Ripple effect */}
                <span className="absolute inset-0 animate-ripple rounded-sm border border-[#3a210d]/30" />
              </>
            )}
          </div>
          
          <div className="flex flex-col items-start gap-1">
            <span className={`
              mono text-sm md:text-base tracking-[0.15em] uppercase 
              transition-all duration-300 italic font-black relative
              ${isOpen 
                ? 'text-[#3a210d] animate-glow' 
                : topic.isLocked 
                  ? 'text-[#3a210d]/40 line-through decoration-1' 
                  : 'text-[#3a210d]/70 group-hover:text-[#3a210d]'
              }
            `}>
              {topic.title}
              
              {/* Animated underline for open state */}
              {isOpen && !topic.isLocked && (
                <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-[#3a210d] to-transparent animate-slideIn" />
              )}
            </span>
            
            {/* Animated subtitle */}
            {isOpen && !topic.isLocked && (
              <span className="text-[8px] mono text-[#c9965a]/60 tracking-[0.3em] uppercase animate-fadeIn">
                ACTIVE_SECTION
              </span>
            )}
          </div>
        </div>
        
        {topic.isLocked ? (
          <div className="flex items-center gap-3 animate-slideInRight">
            <span className="text-[8px] md:text-[10px] mono text-[#3a210d]/50 tracking-[0.25em] font-black uppercase italic bg-[#3a210d]/5 px-3 py-1.5 rounded-sm backdrop-blur-sm border border-[#3a210d]/10">
              🔒 Access_Limited
            </span>
            <span className="text-[10px] md:text-xs mono text-[#e3e4df] bg-gradient-to-r from-[#3a210d] to-[#1a0f07] px-4 py-2 rounded-sm tracking-[0.15em] font-black italic shadow-lg border border-[#c9965a]/20">
              SECURED
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
                w-3 h-3 border-r-2 border-b-2 border-[#3a210d] 
                transition-all duration-500 transform
                ${isOpen ? 'rotate-45 translate-y-1' : '-rotate-45 group-hover:translate-x-1 group-hover:translate-y-1'}
              `} />
            </div>
            {/* Arrow glow effect on hover */}
            {isHovered && !topic.isLocked && (
              <div className="absolute inset-0 animate-ping bg-[#3a210d]/20 rounded-full" />
            )}
          </div>
        )}
      </button>

      {isOpen && !topic.isLocked && topic.options && (
        <div className="px-8 md:px-12 pb-10 space-y-5">
          {/* Animated connector line */}
          <div className="relative">
            <div className="absolute left-[23px] top-0 bottom-0 w-[2px]">
              <div className="absolute inset-0 bg-gradient-to-b from-[#c9965a]/30 via-[#c9965a]/20 to-transparent animate-pulseSoft" />
              {/* Flowing light effect */}
              <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-[#c9965a]/40 to-transparent animate-flow" />
            </div>
            
            <div className="pt-4 flex flex-col gap-5 ms-10 ps-6">
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
                      flex items-center gap-5 text-[11px] md:text-sm mono tracking-[0.2em] py-3 
                      text-start uppercase transition-all duration-500 relative group/option
                      hover:translate-x-2
                      ${option.isLocked 
                        ? 'cursor-not-allowed opacity-60' 
                        : 'text-[#9f7952] hover:text-[#3a210d] cursor-pointer'
                      }
                    `}
                    disabled={option.isLocked}
                  >
                    {/* Animated status dot */}
                    <div className="relative">
                      <div className={`
                        w-3 h-3 rotate-45 transition-all duration-500
                        ${openOptionId === option.id 
                          ? 'bg-[#3a210d] shadow-[0_0_15px_rgba(58,33,13,0.7)] animate-pulseSoft' 
                          : 'bg-[#d4d5cf] group-hover/option:bg-[#9f7952] group-hover/option:shadow-md'
                        }
                        ${option.isLocked ? 'bg-[#d4d5cf]/30' : ''}
                      `} />
                      
                      {/* Ripple effect on click */}
                      {openOptionId === option.id && (
                        <>
                          <span className="absolute -inset-1 border border-[#3a210d]/30 rotate-45 animate-ping" />
                          <span className="absolute -inset-2 border border-[#3a210d]/10 rotate-45 animate-pulse" />
                        </>
                      )}
                    </div>
                    
                    <span className={`
                      transition-all duration-500 relative
                      ${openOptionId === option.id ? 'translate-x-3' : ''}
                      ${option.isLocked ? 'text-[#3a210d]/30 italic line-through decoration-1' : ''}
                    `}>
                      {option.title}
                      
                      {/* Animated underline on hover */}
                      {!option.isLocked && (
                        <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#3a210d] transition-all duration-500 group-hover/option:w-full" />
                      )}
                    </span>

                    {option.isLocked && (
                      <span className="text-[7px] md:text-[9px] text-[#3a210d]/40 border border-[#3a210d]/10 px-3 py-1 ms-auto font-black italic rounded-sm bg-white/30 backdrop-blur-sm animate-pulseSoft">
                        ⚡ SYSTEM_PROTECT
                      </span>
                    )}
                  </button>
                  
                  {/* Deep info with dramatic reveal animation */}
                  {openOptionId === option.id && option.deepInfo && (
                    <div className="mt-5 mb-3 ms-12 p-6 bg-gradient-to-br from-white/50 to-white/30 dark:from-[#2a2a2a]/50 dark:to-[#1a1a1a]/30 border-l-4 border-[#3a210d] rounded-r-xl relative overflow-hidden shadow-lg backdrop-blur-sm">
                      {/* Animated background elements */}
                      <div className="absolute inset-0 overflow-hidden">
                        <div className="absolute -inset-[100%] animate-rotate bg-gradient-to-r from-transparent via-[#c9965a]/10 to-transparent" />
                      </div>
                      
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#c9965a]/10 rounded-full blur-3xl animate-pulseSoft" />
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#3a210d]/10 rounded-full blur-2xl animate-pulseSoft" style={{ animationDelay: '1s' }} />
                      
                      {/* Content with fade-in animation */}
                      <div className="relative z-10 flex gap-4 animate-slideInLeft">
                        <span className="text-[#c9965a] text-lg md:text-xl font-mono opacity-50 animate-bounce">#</span>
                        <div className="flex-1">
                          <p className="text-[11px] md:text-[14px] mono text-[#3a210d] leading-relaxed uppercase tracking-widest italic font-bold">
                            {option.deepInfo.content}
                          </p>
                          
                          {/* Typewriter effect for metadata if available */}
                          {option.deepInfo.metadata && (
                            <div className="mt-4 text-[8px] md:text-[10px] text-[#3a210d]/40 border-t border-[#3a210d]/10 pt-3 animate-fadeIn">
                              {option.deepInfo.metadata}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Animated corner */}
                      <div className="absolute bottom-2 right-2 w-6 h-6 border-r-2 border-b-2 border-[#3a210d]/20 animate-pulseSoft" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slideInLeft {
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
          0%, 100% {
            transform: translateX(0);
          }
          10%, 30%, 50%, 70%, 90% {
            transform: translateX(-2px);
          }
          20%, 40%, 60%, 80% {
            transform: translateX(2px);
          }
        }

        @keyframes flow {
          0% {
            transform: translateY(-100%);
          }
          100% {
            transform: translateY(200%);
          }
        }

        @keyframes cornerPulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.1);
          }
        }

        @keyframes glow {
          0%, 100% {
            text-shadow: 0 0 5px rgba(58, 33, 13, 0.3);
          }
          50% {
            text-shadow: 0 0 15px rgba(58, 33, 13, 0.5);
          }
        }

        @keyframes ripple {
          0% {
            transform: scale(0.8);
            opacity: 1;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
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
            rgba(58, 33, 13, 0.05) 10px,
            rgba(58, 33, 13, 0.05) 20px
          );
        }

        .scanline {
          background: linear-gradient(
            to bottom,
            transparent,
            rgba(201, 150, 90, 0.1),
            transparent
          );
          animation: flow 6s linear infinite;
        }
      `}</style>
    </div>
  );
};