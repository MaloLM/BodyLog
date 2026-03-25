import React, { useState, useRef, useCallback } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTranslation, Language } from '../i18n';
import { useClickOutside } from '../utils/useClickOutside';

const flags: Record<Language, string> = { en: '🇬🇧', fr: '🇫🇷' };
const labels: Record<Language, string> = { en: 'English', fr: 'Français' };

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useClickOutside(ref, useCallback(() => setOpen(false), []));

  return (
    <div ref={ref} className="relative flex">
      <button
        onClick={() => setOpen(!open)}
        className="bg-slate-800/80 backdrop-blur-md border border-slate-700 px-3 rounded-xl shadow-xl text-sm flex items-center gap-1.5 hover:border-slate-600 transition-all"
      >
        <span className="text-base leading-none">{flags[language]}</span>
        <ChevronDown size={14} className={`text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-full mt-1 right-0 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-50 min-w-[140px]">
          {(Object.keys(flags) as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => { setLanguage(lang); setOpen(false); }}
              className={`w-full px-4 py-2.5 text-sm flex items-center gap-2.5 transition-colors ${
                language === lang ? 'bg-blue-600/20 text-blue-400' : 'text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span className="text-base leading-none">{flags[lang]}</span>
              {labels[lang]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
