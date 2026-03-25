import React from 'react';
import { X, Activity, MousePointerClick, Shield, BarChart3 } from 'lucide-react';
import { useTranslation } from '../i18n';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative p-8 text-center">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"
          >
            <X size={20} />
          </button>

          <div className="flex justify-center mb-6">
            <div className="bg-blue-500/10 p-4 rounded-2xl text-blue-400 ring-1 ring-blue-500/20">
              <Activity size={40} />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-white mb-2">{t.welcomeTitle}</h1>
          <p className="text-slate-400 mb-8">{t.welcomeSubtitle}</p>

          <div className="grid gap-6 text-left mb-10">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-slate-800 rounded-lg text-blue-400 shrink-0">
                <Shield size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-200 text-sm">{t.precisionTracking}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{t.precisionTrackingDesc}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 bg-slate-800 rounded-lg text-blue-400 shrink-0">
                <BarChart3 size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-200 text-sm">{t.visualHistory}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{t.visualHistoryDesc}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400 shrink-0 ring-1 ring-blue-500/50">
                <MousePointerClick size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-blue-300 text-sm italic">{t.toGetStarted}</h3>
                <p className="text-xs text-blue-200/70 leading-relaxed font-medium">
                  {t.toGetStartedDesc(t.doubleClick)}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-600/25 hover:scale-[1.02] active:scale-[0.98]"
          >
            {t.startTracking}
          </button>

          <a
            href="https://github.com/MaloLM/BodyLog"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 mt-4 text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            <span>Open source on GitHub</span>
          </a>
        </div>
      </div>
    </div>
  );
};
