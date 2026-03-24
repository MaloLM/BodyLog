import React, { useState, useEffect, useRef } from "react";
import { Lock, X } from "lucide-react";
import { useTranslation } from "../i18n";

interface PasswordModalProps {
  isOpen: boolean;
  mode: "export" | "import";
  onConfirm: (password: string | null) => void;
  onCancel: () => void;
  error?: string;
}

export const PasswordModal: React.FC<PasswordModalProps> = ({
  isOpen,
  mode,
  onConfirm,
  onCancel,
  error,
}) => {
  const { t } = useTranslation();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setPassword("");
      setConfirm("");
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const mismatch = mode === "export" && password.length > 0 && confirm.length > 0 && password !== confirm;
  const canEncrypt = mode === "export" ? password.length > 0 && password === confirm : password.length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (canEncrypt) onConfirm(password);
  };

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onCancel}
    >
      <div
        className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-blue-500/10">
          <div className="flex items-center gap-3">
            <div className="bg-blue-500/20 p-2 rounded-lg text-blue-400">
              <Lock size={20} />
            </div>
            <h3 className="text-xl font-bold text-white">
              {mode === "export" ? t.protectExport : t.protectedArchive}
            </h3>
          </div>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-slate-400 text-sm leading-relaxed">
            {mode === "export"
              ? t.addPasswordDesc
              : t.archiveProtectedDesc}
          </p>

          <input
            ref={inputRef}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={mode === "export" ? t.passwordOptionalPlaceholder : t.passwordPlaceholder}
            className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
          />

          {mode === "export" && password.length > 0 && (
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder={t.confirmPassword}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          )}

          {mismatch && (
            <p className="text-red-400 text-xs">{t.passwordMismatch}</p>
          )}

          {error && (
            <p className="text-red-400 text-xs">{error}</p>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            {mode === "export" ? (
              <>
                <button
                  type="button"
                  onClick={() => onConfirm(null)}
                  className="flex-1 py-3 text-sm font-bold text-slate-400 hover:text-white transition-colors"
                >
                  {t.withoutEncryption}
                </button>
                <button
                  type="submit"
                  disabled={!canEncrypt}
                  className="flex-[2] bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 py-3 rounded-xl text-sm font-bold text-white shadow-lg shadow-blue-900/20 transition-all active:scale-95"
                >
                  {t.encryptAndExport}
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex-1 py-3 text-sm font-bold text-slate-400 hover:text-white transition-colors"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  disabled={!canEncrypt}
                  className="flex-[2] bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:hover:bg-blue-600 py-3 rounded-xl text-sm font-bold text-white shadow-lg shadow-blue-900/20 transition-all active:scale-95"
                >
                  {t.decrypt}
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};
