import React from 'react';
import { X, Activity, MousePointerClick, Shield, BarChart3 } from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose }) => {
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

          <h1 className="text-3xl font-bold text-white mb-2">Welcome to BodyLog</h1>
          <p className="text-slate-400 mb-8">Your personal 3D anatomical progress tracker.</p>
          
          <div className="grid gap-6 text-left mb-10">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-slate-800 rounded-lg text-blue-400 shrink-0">
                <Shield size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-200 text-sm">Track with Precision</h3>
                <p className="text-xs text-slate-400 leading-relaxed">Document physical changes, injuries, or progress directly on a high-fidelity 3D model.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 bg-slate-800 rounded-lg text-blue-400 shrink-0">
                <BarChart3 size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-200 text-sm">Visual History</h3>
                <p className="text-xs text-slate-400 leading-relaxed">Keep a chronological record of entries for every point of interest on your body.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400 shrink-0 ring-1 ring-blue-500/50">
                <MousePointerClick size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-blue-300 text-sm italic">Get Started</h3>
                <p className="text-xs text-blue-200/70 leading-relaxed font-medium">
                  Simply <span className="text-blue-400 font-bold underline underline-offset-2">double click</span> anywhere on the 3D model to add your first "point".
                </p>
              </div>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-full py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl transition-all shadow-lg shadow-blue-600/25 hover:scale-[1.02] active:scale-[0.98]"
          >
            Start Tracking
          </button>
        </div>
      </div>
    </div>
  );
};
