import React, { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Image as ImageIcon } from 'lucide-react';
import { useTranslation } from '../i18n';

interface LightboxEntry {
  url?: string;
  description: string;
  date: string;
}

interface ImageLightboxProps {
  entries: LightboxEntry[];
  currentIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
  markerTitle?: string;
  markerPosition?: string;
  onMarkerPrev?: () => void;
  onMarkerNext?: () => void;
}

export const ImageLightbox: React.FC<ImageLightboxProps> = ({
  entries,
  currentIndex,
  onClose,
  onPrev,
  onNext,
  markerTitle,
  markerPosition,
  onMarkerPrev,
  onMarkerNext,
}) => {
  const { t } = useTranslation();
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (currentIndex === -1) return;
    if (e.key === 'ArrowLeft') onPrev();
    else if (e.key === 'ArrowRight') onNext();
    else if (e.key === 'ArrowUp' && onMarkerPrev) { e.preventDefault(); onMarkerPrev(); }
    else if (e.key === 'ArrowDown' && onMarkerNext) { e.preventDefault(); onMarkerNext(); }
    else if (e.key === 'Escape') onClose();
  }, [currentIndex, onPrev, onNext, onClose, onMarkerPrev, onMarkerNext]);

  useEffect(() => {
    if (currentIndex === -1) return;
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, handleKeyDown]);

  if (currentIndex === -1 || !entries[currentIndex]) return null;

  const currentEntry = entries[currentIndex];

  return (
    <div 
      className="fixed inset-0 z-[300] flex flex-col items-center justify-center bg-black/95 backdrop-blur-md p-8 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <button 
        onClick={onClose}
        className="absolute top-8 right-8 p-3 bg-slate-800/80 hover:bg-slate-700 rounded-full text-white transition-all z-[310] shadow-xl border border-white/10"
      >
        <X size={24} />
      </button>

      {entries.length > 1 && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            className="absolute left-8 p-4 bg-slate-800/80 hover:bg-slate-700 rounded-full text-white transition-all z-[310] shadow-xl border border-white/10"
          >
            <ChevronLeft size={32} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            className="absolute right-8 p-4 bg-slate-800/80 hover:bg-slate-700 rounded-full text-white transition-all z-[310] shadow-xl border border-white/10"
          >
            <ChevronRight size={32} />
          </button>
        </>
      )}

      {onMarkerPrev && onMarkerNext && (
        <>
          <button
            onClick={(e) => { e.stopPropagation(); onMarkerPrev(); }}
            className="absolute top-8 left-1/2 -translate-x-1/2 p-3 bg-slate-800/80 hover:bg-slate-700 rounded-full text-white transition-all z-[310] shadow-xl border border-white/10"
          >
            <ChevronUp size={28} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onMarkerNext(); }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 p-3 bg-slate-800/80 hover:bg-slate-700 rounded-full text-white transition-all z-[310] shadow-xl border border-white/10"
          >
            <ChevronDown size={28} />
          </button>
        </>
      )}

      <div 
        className="relative flex flex-col items-center max-w-5xl w-full h-full justify-center gap-6 py-12"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative flex-1 flex items-center justify-center w-full min-h-0">
          {currentEntry.url ? (
            <img 
              src={currentEntry.url} 
              alt="Full size documentation" 
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-in zoom-in duration-300"
            />
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 text-slate-500 bg-slate-900/50 rounded-2xl p-20 border border-white/5 shadow-2xl animate-in zoom-in duration-300">
              <ImageIcon size={64} strokeWidth={1} />
              <span className="text-sm font-medium uppercase tracking-[0.2em]">{t.noImageLightbox}</span>
            </div>
          )}
        </div>
        
        <div className="w-full max-w-2xl bg-slate-900/80 backdrop-blur-md border border-white/10 p-6 rounded-2xl shadow-2xl animate-in slide-in-from-bottom-4 duration-500">
          {markerTitle && (
            <div className="flex flex-col items-center gap-1 mb-4">
              <span className="text-white font-bold text-base tracking-wide">{markerTitle}</span>
              {markerPosition && (
                <span className="text-slate-500 font-bold text-xs uppercase tracking-widest">{markerPosition}</span>
              )}
            </div>
          )}
          <div className="flex items-center gap-3 mb-3 justify-center">
            <span className="h-px w-8 bg-slate-700" />
            <span className="text-blue-400 font-bold text-xs uppercase tracking-widest">{currentEntry.date}</span>
            <span className="h-px w-8 bg-slate-700" />
          </div>
          <p className="text-slate-200 text-center text-lg leading-relaxed font-medium">
            {currentEntry.description}
          </p>
          <div className="mt-4 flex justify-center">
            <span className="text-slate-500 font-bold bg-slate-800/50 px-3 py-1 rounded-full text-xs tracking-widest uppercase">
              {t.entryOf(currentIndex + 1, entries.length)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
