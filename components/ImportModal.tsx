import React from "react";
import {
  AlertTriangle,
  CheckCircle,
  Upload,
  X,
  AlertCircle,
} from "lucide-react";
import type { ArchiveManifest } from "../utils/archiveTypes";
import { useTranslation } from "../i18n";

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (mode: 'replace' | 'merge') => void;
  errors: string[];
  manifest: ArchiveManifest | null;
  warnings: string[];
  currentMarkerCount: number;
}

export const ImportModal: React.FC<ImportModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  errors,
  manifest,
  warnings,
  currentMarkerCount,
}) => {
  const { t } = useTranslation();
  if (!isOpen) return null;

  const hasErrors = errors.length > 0;

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className={`p-6 border-b border-slate-800 flex justify-between items-center ${
            hasErrors ? "bg-red-500/10" : "bg-blue-500/10"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${
                hasErrors
                  ? "bg-red-500/20 text-red-500"
                  : "bg-blue-500/20 text-blue-400"
              }`}
            >
              {hasErrors ? (
                <AlertTriangle size={20} />
              ) : (
                <Upload size={20} />
              )}
            </div>
            <h3 className="text-xl font-bold text-white">
              {hasErrors ? t.importError : t.importSessionTitle}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          {hasErrors ? (
            <div className="space-y-2">
              <p className="text-slate-300 text-sm mb-3">
                {t.invalidArchive}
              </p>
              {errors.map((error, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 text-red-400 text-sm"
                >
                  <AlertCircle size={16} className="mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              ))}
            </div>
          ) : manifest ? (
            <>
              <div className="bg-slate-800/50 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">{t.anatomicalPoints}</span>
                  <span className="text-white font-medium">
                    {manifest.markerCount}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">{t.entries}</span>
                  <span className="text-white font-medium">
                    {manifest.entryCount}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">{t.images}</span>
                  <span className="text-white font-medium">
                    {manifest.imageCount}
                  </span>
                </div>
                <div className="flex justify-between text-sm border-t border-slate-700 pt-2 mt-2">
                  <span className="text-slate-400">{t.exportDate}</span>
                  <span className="text-white font-medium">
                    {new Date(manifest.exportedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {warnings.length > 0 && (
                <div className="space-y-1">
                  {warnings.map((warning, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 text-amber-400 text-sm"
                    >
                      <AlertCircle size={14} className="mt-0.5 shrink-0" />
                      <span>{warning}</span>
                    </div>
                  ))}
                </div>
              )}

              {currentMarkerCount > 0 ? (
                <div className="flex items-start gap-2 text-slate-300 text-sm bg-slate-800/50 rounded-lg p-3">
                  <AlertTriangle size={16} className="mt-0.5 shrink-0 text-amber-400" />
                  <span dangerouslySetInnerHTML={{ __html: t.existingPointsWarning(currentMarkerCount) }} />
                </div>
              ) : (
                <div className="flex items-start gap-2 text-amber-400/80 text-sm bg-amber-500/10 rounded-lg p-3">
                  <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                  <span>
                    {t.archiveDataWillBeLoaded}
                  </span>
                </div>
              )}
            </>
          ) : null}
        </div>

        {/* Footer */}
        <div className="p-6 pt-0 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 text-sm font-bold text-slate-400 hover:text-white transition-colors"
          >
            {hasErrors ? t.close : t.cancel}
          </button>
          {!hasErrors && currentMarkerCount > 0 ? (
            <>
              <button
                onClick={() => onConfirm('merge')}
                className="flex-1 bg-slate-700 hover:bg-slate-600 py-3 rounded-xl text-sm font-bold text-white transition-all active:scale-95"
              >
                {t.merge}
              </button>
              <button
                onClick={() => onConfirm('replace')}
                className="flex-1 bg-blue-600 hover:bg-blue-500 py-3 rounded-xl text-sm font-bold text-white shadow-lg shadow-blue-900/20 transition-all active:scale-95"
              >
                {t.replace}
              </button>
            </>
          ) : !hasErrors ? (
            <button
              onClick={() => onConfirm('replace')}
              className="flex-[2] bg-blue-600 hover:bg-blue-500 py-3 rounded-xl text-sm font-bold text-white shadow-lg shadow-blue-900/20 transition-all active:scale-95"
            >
              {t.importAction}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
};
