
import React from 'react';
import { Topic, Option } from '../types';
import { soundManager } from '../utils/soundManager';

interface TopicPanelProps {
  topic: Topic;
  isOpen: boolean;
  onToggle: () => void;
}

export const TopicPanel: React.FC<TopicPanelProps> = ({ topic, isOpen, onToggle }) => {
  const [openOptionId, setOpenOptionId] = React.useState<string | null>(null);

  const handleTopicClick = () => {
    if (topic.isLocked) return;
    soundManager.playExpand();
    onToggle();
  };

  const handleOptionClick = (option: Option) => {
    if (option.isLocked) return;
    soundManager.playClick();
    setOpenOptionId(openOptionId === option.id ? null : option.id);
  };

  return (
    <div className={`border-b border-neutral-900 transition-all duration-500 ${isOpen ? 'bg-neutral-800/20' : ''} ${topic.isLocked ? 'locked-pattern' : ''}`}>
      <button
        onClick={handleTopicClick}
        className={`w-full flex items-center justify-between py-6 px-6 transition-all group relative ${
          topic.isLocked ? 'cursor-default opacity-40 grayscale' : 'hover:bg-neutral-800/40 cursor-pointer'
        }`}
      >
        <div className="flex items-center gap-4">
          <div className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${isOpen ? 'bg-red-600 red-glow scale-125' : topic.isLocked ? 'bg-neutral-800' : 'bg-neutral-700'}`} />
          <span className={`mono text-xs md:text-sm tracking-[0.15em] uppercase text-start transition-colors duration-300 ${isOpen ? 'text-white font-bold' : topic.isLocked ? 'text-neutral-600' : 'text-neutral-400 group-hover:text-neutral-200'}`}>
            {topic.title}
          </span>
        </div>
        {topic.isLocked && (
          <span className="text-[9px] md:text-[10px] mono text-neutral-700 border border-neutral-800/50 px-2 py-0.5 rounded-sm tracking-[0.2em]">
            LOCKED_CORE
          </span>
        )}
      </button>

      {isOpen && !topic.isLocked && topic.options && (
        <div className="px-12 pb-8 space-y-4 fade-in">
          <div className="pt-2 flex flex-col gap-4 border-s border-neutral-800 ms-0.5 ps-6">
            {topic.options.map((option) => (
              <div key={option.id} className="flex flex-col">
                <button
                  onClick={() => handleOptionClick(option)}
                  className={`flex items-center gap-3 text-[10px] md:text-xs mono tracking-[0.2em] py-1 text-start uppercase transition-all duration-300 ${
                    option.isLocked ? 'text-neutral-700 cursor-default opacity-50' : 'text-neutral-400 hover:text-white cursor-pointer'
                  }`}
                >
                  <span className={`w-1 h-1 rounded-full ${openOptionId === option.id ? 'bg-red-600' : 'bg-neutral-800'}`} />
                  <span className={option.isLocked ? 'line-through decoration-neutral-800' : ''}>
                    {option.title}
                  </span>
                  {option.isLocked && <span className="text-[8px] opacity-40 mono ml-auto ps-4"> [SECURED_PROTOCOL]</span>}
                </button>
                
                {openOptionId === option.id && option.deepInfo && (
                  <div className="mt-4 p-4 bg-black/40 border border-neutral-800/50 rounded-sm deep-reveal">
                    <p className="text-[10px] md:text-[12px] mono text-neutral-500 leading-loose uppercase tracking-widest italic">
                       &gt;&gt; {option.deepInfo.content}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};