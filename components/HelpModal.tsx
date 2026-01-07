
import React from 'react';
import { X, MousePointer2, ZoomIn, Rotate3d, MousePointerClick } from 'lucide-react';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            How to use BodyLog
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                <Rotate3d size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-200">Rotate</h3>
                <p className="text-sm text-slate-400">Click and drag with the left mouse button to rotate the model.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                <ZoomIn size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-200">Zoom</h3>
                <p className="text-sm text-slate-400">Use the mouse wheel to zoom in and out on the body.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                <MousePointerClick size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-200">Place a Marker</h3>
                <p className="text-sm text-slate-400">Double-click anywhere on the body to add a new tracking point.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                <MousePointer2 size={20} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-200">Select / Deselect</h3>
                <p className="text-sm text-slate-400">Click on an existing point to see its details or deselect it.</p>
              </div>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/20"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
