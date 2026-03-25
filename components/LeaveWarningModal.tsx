import React from 'react';
import { AlertTriangle, Download, X } from 'lucide-react';
import { useTranslation } from '../i18n';

interface LeaveWarningModalProps {
  isOpen: boolean;
  onStay: () => void;
  onExport: () => void;
  onLeave: () => void;
}

export const LeaveWarningModal: React.FC<LeaveWarningModalProps> = ({
  isOpen,
  onStay,
  onExport,
  onLeave,
}) => {
  const { t } = useTranslation();
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm"
      onClick={onStay}
    >
      <div
        className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8">
          <div className="flex items-start justify-between mb-6">
            <div className="bg-amber-500/10 p-3 rounded-2xl text-amber-400 ring-1 ring-amber-500/20">
              <AlertTriangle size={28} />
            </div>
            <button
              onClick={onStay}
              className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"
            >
              <X size={20} />
            </button>
          </div>

          <h2 className="text-xl font-bold text-white mb-2">{t.leaveWarningTitle}</h2>
          <p className="text-sm text-slate-400 leading-relaxed mb-2">
            {t.leaveWarningMessage}
          </p>
          <p className="text-sm text-amber-400/80 font-medium mb-8">
            {t.leaveWarningExportHint}
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={onExport}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-xl transition-all shadow-lg shadow-blue-600/25 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Download size={18} />
              {t.leaveWarningExport}
            </button>
            <button
              onClick={onStay}
              className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-xl transition-all"
            >
              {t.leaveWarningStay}
            </button>
            <button
              onClick={onLeave}
              className="w-full py-2.5 text-slate-500 hover:text-red-400 text-sm font-medium transition-colors"
            >
              {t.leaveWarningLeave}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
