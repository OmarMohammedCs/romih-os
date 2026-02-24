import React, { useState, useEffect, useMemo } from 'react';
import { AppView, Language, Theme } from './types';
import { getSections, UI_STRINGS } from './constants';
import { Engine } from './components/Engine';
import { SectionPage } from './components/SectionPage';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { playClickSound, playBackSound, playConnectSound } from './utils/sound';

const AppContent: React.FC = () => {
  const [view, setView] = useState<AppView>('intro');
  const [lang, setLang] = useState<Language>('en');
  const [currentSectionId, setCurrentSectionId] = useState<string | null>(null);
  const [introVisible, setIntroVisible] = useState(true);
  const [engineClicked, setEngineClicked] = useState(false);
  const [hoveredSection, setHoveredSection] = useState<string | null>(null);
  const [screenConnected, setScreenConnected] = useState(false);
  const [connectionStrength, setConnectionStrength] = useState(0);
  const { theme, toggleTheme } = useTheme();

  const sections = useMemo(() => getSections(lang), [lang]);
  const currentSection = sections.find(s => s.id === currentSectionId);
  const trans = UI_STRINGS[lang];

  // كشف حجم الشاشة للتجاوب
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowSize.width < 640;
  const isTablet = windowSize.width >= 640 && windowSize.width < 1024;
  const isDesktop = windowSize.width >= 1024;

  // تأثيرات الدخول
  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIntroVisible(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // محاكاة الاتصال بالشاشة
  useEffect(() => {
    if (engineClicked) {
      const timer = setTimeout(() => {
        setScreenConnected(true);
        playConnectSound(); // صوت الاتصال
        
        const interval = setInterval(() => {
          setConnectionStrength(prev => Math.min(prev + 5, 100));
        }, 100);
        return () => clearInterval(interval);
      }, 800);
      return () => clearTimeout(timer);
    } else {
      setScreenConnected(false);
      setConnectionStrength(0);
    }
  }, [engineClicked]);

  const handleEngineClick = () => {
    playClickSound(); // صوت عند الضغط على المحرك
    setEngineClicked(true);
  };

  const handleSectionClick = (sectionId: string) => {
    playClickSound(); // صوت عند اختيار قسم
    setCurrentSectionId(sectionId);
    setView('section');
  };

  const handleBack = () => {
    playBackSound(); // صوت مختلف عند الرجوع
    setView('hub');
    setCurrentSectionId(null);
  };

  const handleLangToggle = () => {
    playClickSound(); // صوت عند تغيير اللغة
    setLang(l => l === 'en' ? 'ar' : 'en');
  };

  const handleThemeToggle = () => {
    playClickSound(); // صوت عند تغيير الثيم
    toggleTheme();
  };

  // حساب نصف القطر المناسب للشاشة
  const getSectionRadius = () => {
    if (isMobile) return 110;
    if (isTablet) return 170;
    return 250;
  };

  // واجهة الدخول - محسنة لجميع الشاشات
  if (introVisible) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-stone-950 via-stone-900 to-amber-950 flex items-center justify-center z-50">
        <div className="relative px-4 sm:px-6">
          {/* دوائر متحركة - أحجام متناسبة */}
          <div className="absolute inset-0 -m-12 sm:-m-16 md:-m-24">
            <div className="w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 border-2 border-amber-500/20 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
            <div className="absolute inset-0 w-32 h-32 sm:w-40 sm:h-40 md:w-48 md:h-48 border-2 border-amber-500/10 rounded-full animate-spin-slow" />
          </div>
          
          {/* الشعار - أحجام متجاوبة */}
          <div className="relative text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-thin text-amber-500 mb-2 sm:mb-3 md:mb-4 tracking-wider">
              BIN ROMIH
            </h1>
            <p className="text-amber-500/40 tracking-[0.5em] sm:tracking-[0.6em] md:tracking-[0.8em] text-xs sm:text-sm font-light">
              OFFICE
            </p>
            
            {/* خطوط زخرفية */}
            <div className="absolute -bottom-6 sm:-bottom-8 left-1/2 -translate-x-1/2 w-16 sm:w-24 md:w-32 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
          </div>
        </div>
      </div>
    );
  }

  // صفحة القسم - محسنة للشاشات المختلفة
  if (view === 'section' && currentSection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-stone-50 to-amber-50 dark:from-stone-950 dark:to-stone-900">
        {/* شريط علوي متجاوب */}
        <div className="fixed top-0 left-0 right-0 bg-white/90 dark:bg-stone-950/90 backdrop-blur-2xl border-b border-amber-500/10 z-50 shadow-lg">
          <div className="container mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
            <button
              onClick={handleBack}
              className="flex items-center gap-2 sm:gap-3 text-stone-600 dark:text-stone-400 hover:text-amber-500 transition-all duration-300 group"
            >
              <div className="relative">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="absolute -inset-2 bg-amber-500/20 rounded-full scale-0 group-hover:scale-100 transition-transform" />
              </div>
              <span className="text-xs sm:text-sm tracking-wider font-light hidden xs:inline">
                {lang === 'ar' ? 'رجوع' : 'BACK'}
              </span>
            </button>
            
            <div className="flex items-center gap-2 sm:gap-4">
              {/* مؤشرات الحالة - تظهر فقط في الشاشات المتوسطة فأكبر */}
              <div className="hidden sm:flex gap-2">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-emerald-500 rounded-full animate-pulse" />
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-amber-500 rounded-full animate-pulse" style={{ animationDelay: '0.5s' }} />
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-stone-500 rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
              </div>
              
              <span className="text-xs sm:text-sm md:text-base text-stone-500 dark:text-stone-400 font-light tracking-wider truncate max-w-[150px] sm:max-w-none">
                {currentSection.title}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-20 sm:pt-24 pb-8 sm:pb-12 px-3 sm:px-4 md:px-6">
          <SectionPage section={currentSection} lang={lang} />
        </div>
      </div>
    );
  }

  // الواجهة الرئيسية - محسنة بالكامل
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-stone-100 dark:from-stone-950 dark:via-stone-900 dark:to-stone-950 relative overflow-hidden">
      
      {/* خلفية ديناميكية متجاوبة */}
      <div className="absolute inset-0">
        {/* جسيمات متحركة - عدد أقل على الجوال */}
        {[...Array(isMobile ? 10 : isTablet ? 20 : 30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 bg-amber-500/30 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animation: `floatParticle ${15 + Math.random() * 20}s linear infinite`,
              animationDelay: `${Math.random() * 5}s`,
              opacity: 0.2 + Math.random() * 0.3
            }}
          />
        ))}
        
        {/* دوائر متحدة المركز - أحجام متجاوبة */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          {[1, 2, 3, 4].map((i) => {
            const size = isMobile ? 100 : isTablet ? 140 : 180;
            return (
              <div
                key={i}
                className="absolute inset-0 border border-amber-500/10 rounded-full"
                style={{
                  width: `${i * size}px`,
                  height: `${i * size}px`,
                  transform: 'translate(-50%, -50%)',
                  animation: `rotateRing ${15 + i * 5}s linear infinite`,
                  borderStyle: i % 2 === 0 ? 'dashed' : 'solid',
                  opacity: 0.1 / i
                }}
              />
            );
          })}
        </div>

        {/* تدرجات ضبابية - مخفية على الجوال */}
        {!isMobile && (
          <>
            <div className="absolute top-0 left-0 w-48 sm:w-64 md:w-96 h-48 sm:h-64 md:h-96 bg-amber-500/5 rounded-full blur-3xl animate-pulse-slow" />
            <div className="absolute bottom-0 right-0 w-48 sm:w-64 md:w-96 h-48 sm:h-64 md:h-96 bg-stone-500/5 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
          </>
        )}
      </div>

      {/* مؤشر الاتصال - متجاوب */}
  

      {/* رسالة الترحيب - متجاوبة */}
      {!engineClicked && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-32 sm:-translate-y-36 md:-translate-y-40 text-center z-40 animate-fade-in px-4 w-full">
          <div className="relative max-w-xs sm:max-w-sm md:max-w-md mx-auto">
            {/* خلفية متوهجة */}
            <div className="absolute inset-0 -m-4 sm:-m-6 md:-m-10 bg-amber-500/10 rounded-full blur-2xl sm:blur-3xl animate-pulse-slow" />
            
            <div className="relative bg-white/90 dark:bg-stone-950/90 backdrop-blur-2xl rounded-2xl sm:rounded-3xl shadow-2xl border border-amber-500/20 p-4 sm:p-6 md:p-8">
              <div className="absolute -top-2 sm:-top-3 left-1/2 -translate-x-1/2 px-2 sm:px-3 md:px-4 py-0.5 sm:py-1 bg-amber-500 text-white text-xxs sm:text-xs rounded-full tracking-wider shadow-lg whitespace-nowrap">
                {lang === 'ar' ? 'نظام التشغيل' : 'SYSTEM READY'}
              </div>
              
              <h2 className="text-lg sm:text-xl md:text-2xl text-stone-800 dark:text-stone-200 mb-1 sm:mb-2 md:mb-3 font-light">
                {lang === 'ar' ? 'مرحباً بك في' : 'Welcome to'}
              </h2>
              
              <p className="text-amber-500 text-xl sm:text-2xl md:text-3xl font-thin tracking-wider mb-2 sm:mb-3 md:mb-4">
                BIN ROMIH OFFICE
              </p>
              
              <div className="w-8 sm:w-10 md:w-12 h-px bg-amber-500/30 mx-auto my-2 sm:my-3 md:my-4" />
              
              <div className="text-xxs sm:text-xs md:text-sm text-stone-500 dark:text-stone-400 flex items-center justify-center gap-1 sm:gap-2">
                <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-amber-500 rounded-full animate-pulse" />
                {lang === 'ar' ? 'اضغط على المحرك للبدء' : 'CLICK THE ENGINE TO START'}
              </div>

              {/* نقاط إرشادية - مخفية على الجوال */}
              <div className="absolute -bottom-1 sm:-bottom-2 left-1/2 -translate-x-1/2 hidden sm:flex gap-1">
                <div className="w-1 h-1 bg-amber-500/50 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
                <div className="w-1 h-1 bg-amber-500/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                <div className="w-1 h-1 bg-amber-500/50 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* المحرك في المنتصف - متجاوب */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">
        <div 
          onClick={handleEngineClick}
          className="relative cursor-pointer group"
        >
          {/* هالات متحركة - أحجام متجاوبة */}
          <div className="absolute inset-0 -m-4 sm:-m-6 md:-m-8 lg:-m-12">
            <div className="absolute inset-0 rounded-full bg-amber-500/20 blur-xl sm:blur-2xl md:blur-3xl group-hover:bg-amber-500/30 transition-all duration-700 animate-pulse-slow" />
            <div className="absolute inset-0 rounded-full border border-amber-500/30 border-dashed animate-spin-slow" style={{ borderWidth: isMobile ? '1px' : '2px' }} />
          </div>
          
          {/* المحرك - حجم متجاوب */}
          <div className="relative transform group-hover:scale-105 sm:group-hover:scale-110 transition-all duration-700 ease-out">
            <Engine 
              isActive={engineClicked} 
              lang={lang}
              activeSegment={hoveredSection}
              rotation={connectionStrength * 3.6}
            />
          </div>

          {/* دائرة الاتصال - تظهر فقط عندما يكون الاتصال نشطاً */}
          {screenConnected && (
            <div className="absolute inset-0 -m-4 sm:-m-6 md:-m-8 lg:-m-12 xl:-m-16">
              <div className="absolute inset-0 rounded-full border border-amber-500/30 border-dashed animate-spin-reverse" style={{ borderWidth: isMobile ? '1px' : '2px' }} />
              <div className="absolute inset-2 sm:inset-3 md:inset-4 rounded-full border border-amber-500/20 border-dashed animate-spin-slow" style={{ borderWidth: isMobile ? '1px' : '1px' }} />
              
              {/* نقاط دوارة - عدد أقل على الجوال */}
              {[...Array(isMobile ? 4 : 8)].map((_, i) => (
                <div
                  key={i}
                  className="absolute top-1/2 left-1/2 w-0.5 h-0.5 sm:w-1 sm:h-1 bg-amber-500/50 rounded-full"
                  style={{
                    transform: `rotate(${i * (isMobile ? 90 : 45)}deg) translateY(${isMobile ? -40 : -60}px)`,
                    animation: `pulse 2s ease-in-out ${i * 0.25}s infinite`
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* خيارات الأقسام - متجاوبة بالكامل */}
      {engineClicked && sections.slice(1).map((section, index) => {
        const angle = (index * 45) * (Math.PI / 180);
        const radius = getSectionRadius();
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const isHovered = hoveredSection === section.id;

        // إخفاء بعض الخيارات على الجوال إذا كان هناك ازدحام
        if (isMobile && index > 5) return null;

        return (
          <div
            key={section.id}
            className="absolute z-40"
            style={{
              left: `calc(50% + ${x}px)`,
              top: `calc(50% + ${y}px)`,
              transform: 'translate(-50%, -50%)',
              animation: `appear 0.5s ease-out ${index * 0.1}s both`
            }}
          >
            {/* خط الربط - يختفي على الجوال */}
            {!isMobile && (
              <svg 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
                style={{ width: Math.abs(x) * 2 + 40, height: Math.abs(y) * 2 + 40 }}
              >
                <line
                  x1="50%"
                  y1="50%"
                  x2={`calc(50% + ${-x}px)`}
                  y2={`calc(50% + ${-y}px)`}
                  stroke={isHovered ? "#f59e0b" : "#78716c"}
                  strokeWidth={isHovered ? "2" : "1"}
                  strokeDasharray="4,4"
                  className="transition-all duration-300 opacity-30"
                >
                  {screenConnected && (
                    <animate 
                      attributeName="stroke-dashoffset" 
                      values="0;8" 
                      dur="1s" 
                      repeatCount="indefinite" 
                    />
                  )}
                </line>
                
                {/* نقطة البداية */}
                <circle
                  cx="50%"
                  cy="50%"
                  r={isHovered ? "4" : "3"}
                  fill={isHovered ? "#f59e0b" : "#78716c"}
                  className="transition-all duration-300"
                />
                
                {/* نقطة النهاية */}
                <circle
                  cx={`calc(50% + ${-x}px)`}
                  cy={`calc(50% + ${-y}px)`}
                  r={isHovered ? "6" : "4"}
                  fill={isHovered ? "#f59e0b" : "#78716c"}
                  className="transition-all duration-300"
                >
                  {screenConnected && (
                    <animate 
                      attributeName="r" 
                      values="4;6;4" 
                      dur="1.5s" 
                      repeatCount="indefinite" 
                    />
                  )}
                </circle>
              </svg>
            )}

            {/* بطاقة القسم - تصميم متجاوب */}
            <div
              className={`
                relative px-3 sm:px-4 md:px-5 lg:px-6 py-2 sm:py-3 md:py-4 rounded-lg sm:rounded-xl md:rounded-2xl whitespace-nowrap
                transition-all duration-500 cursor-pointer
                ${isHovered 
                  ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-white scale-105 sm:scale-110 shadow-xl sm:shadow-2xl' 
                  : 'bg-white/95 dark:bg-stone-950/95 backdrop-blur-2xl text-stone-700 dark:text-stone-300 shadow-md sm:shadow-xl border border-amber-500/20 hover:border-amber-500/40'
                }
              `}
              onMouseEnter={() => setHoveredSection(section.id)}
              onMouseLeave={() => setHoveredSection(null)}
              onClick={() => handleSectionClick(section.id)}
            >
              {/* رقم القسم - متجاوب */}
              <div className={`
                absolute -top-1.5 sm:-top-2 -right-1.5 sm:-right-2 w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 rounded-full 
                flex items-center justify-center text-xxs sm:text-xs md:text-sm font-light
                ${isHovered 
                  ? 'bg-white text-amber-600 shadow-md sm:shadow-lg' 
                  : 'bg-amber-500 text-white shadow-sm sm:shadow-md'}
                transition-all duration-500
              `}>
                {index + 1}
              </div>

              <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-light tracking-wide">
                {section.title}
              </h3>
              
              {/* مؤشر الاتصال */}
              {screenConnected && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2">
                  <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                </div>
              )}

              {/* خط سفلي زخرفي - يظهر عند التحويم فقط على الجوال */}
              <div className={`
                absolute bottom-0 left-1/2 -translate-x-1/2 w-6 sm:w-8 md:w-10 lg:w-12 h-px
                transition-all duration-500
                ${isHovered ? 'bg-white/50' : isMobile ? 'hidden' : 'bg-amber-500/30'}
              `} />
            </div>
          </div>
        );
      })}

      {/* أزرار التحكم - متجاوبة */}
      <div className="fixed bottom-3 sm:bottom-4 md:bottom-6 lg:bottom-8 right-3 sm:right-4 md:right-6 lg:right-8 z-50 flex gap-2 sm:gap-3 md:gap-4">
        <button
          onClick={handleLangToggle}
          className="group relative"
        >
          <div className="absolute inset-0 bg-amber-500 rounded-full blur-md sm:blur-lg md:blur-xl group-hover:blur-lg sm:group-hover:blur-xl md:group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-40 sm:group-hover:opacity-50 md:group-hover:opacity-60" />
          <div className="relative w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-white/95 dark:bg-stone-950/95 backdrop-blur-2xl rounded-full flex items-center justify-center text-xxs sm:text-xs md:text-sm font-light text-stone-600 dark:text-stone-400 hover:text-amber-500 border border-amber-500/30 hover:border-amber-500/60 transition-all shadow-md sm:shadow-lg hover:shadow-xl sm:hover:shadow-2xl">
            {lang === 'en' ? 'AR' : 'EN'}
          </div>
        </button>
        
        <button
          onClick={handleThemeToggle}
          className="group relative"
        >
          <div className="absolute inset-0 bg-amber-500 rounded-full blur-md sm:blur-lg md:blur-xl group-hover:blur-lg sm:group-hover:blur-xl md:group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-40 sm:group-hover:opacity-50 md:group-hover:opacity-60" />
          <div className="relative w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-white/95 dark:bg-stone-950/95 backdrop-blur-2xl rounded-full flex items-center justify-center text-sm sm:text-base md:text-lg lg:text-xl text-stone-600 dark:text-stone-400 hover:text-amber-500 border border-amber-500/30 hover:border-amber-500/60 transition-all shadow-md sm:shadow-lg hover:shadow-xl sm:hover:shadow-2xl">
            {theme === 'light' ? '🌙' : '☀️'}
          </div>
        </button>
      </div>



      <style>{`
        @keyframes floatParticle {
          0% { transform: translate(0, 0) rotate(0deg); }
          33% { transform: translate(15px, -15px) rotate(120deg); }
          66% { transform: translate(-10px, 10px) rotate(240deg); }
          100% { transform: translate(0, 0) rotate(360deg); }
        }
        
        @keyframes rotateRing {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes appear {
          from {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0.5);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }
        
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translate(-50%, -20px);
          }
          to {
            opacity: 1;
            transform: translate(-50%, -40px);
          }
        }

        /* تحسينات للشاشات الصغيرة جداً */
        @media (max-width: 360px) {
          .text-xxs {
            font-size: 0.6rem;
          }
        }

        /* منع التحديد على الجوال */
        * {
          -webkit-tap-highlight-color: transparent;
        }

        /* تحسين التمرير */
        .min-h-screen {
          -webkit-overflow-scrolling: touch;
        }
      `}</style>
    </div>
  );
};

const App: React.FC = () => (
  <ThemeProvider>
    <AppContent />
  </ThemeProvider>
);

export default App;