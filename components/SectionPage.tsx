
import React from 'react';
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

  const handleToggleTopic = (id: string) => {
    setExpandedTopicId(prev => prev === id ? null : id);
  };

  const isAr = lang === 'ar';
  const trans = UI_STRINGS[lang];

  return (
    <div className="min-h-screen bg-[#050505] text-neutral-300 flex flex-col fade-in" dir={isAr ? 'rtl' : 'ltr'}>
      <header className="p-6 md:p-8 border-b border-neutral-900 flex justify-between items-center sticky top-0 bg-black/80 backdrop-blur-xl z-10">
        <button 
          onClick={onBack}
          className="mono text-[10px] md:text-xs text-neutral-500 hover:text-white transition-colors tracking-[0.4em] flex items-center gap-2"
        >
          {isAr ? `${trans.system} ←` : `← ${trans.system}`}
        </button>
        <div className="flex flex-col items-end">
          <span className="mono text-[8px] md:text-[10px] text-neutral-700 tracking-widest mb-1">SYSTEM_OS_v3.1</span>
          <h1 className="text-sm md:text-2xl font-bold tracking-[0.2em] uppercase text-white truncate max-w-[200px] md:max-w-none">{section.title}</h1>
        </div>
      </header>

      <main className="max-w-4xl w-full mx-auto flex-grow py-8 md:py-16 px-4 md:px-6">
        <div className="border border-neutral-900 bg-neutral-900/20 backdrop-blur-sm rounded-sm">
          {section.topics.map((topic) => (
            <TopicPanel 
              key={topic.id} 
              topic={topic} 
              isOpen={expandedTopicId === topic.id}
              onToggle={() => handleToggleTopic(topic.id)}
            />
          ))}
        </div>
      </main>

      <footer className="p-8 border-t border-neutral-900 text-center opacity-40">
        <p className="mono text-[8px] md:text-[10px] tracking-[0.5em] text-neutral-500">
          {isAr ? 'بروتوكول بن رميح — وصول عالي الأولوية' : 'BIN ROMIH PROTOCOL — HIGH PRIORITY ACCESS'}
        </p>
      </footer>
    </div>
  );
};
