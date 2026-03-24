
import React, { useState, useEffect, useCallback } from 'react';
import { X, Camera, Save, Clock } from 'lucide-react';
import { compressImage, getImageSizeKB, formatFileSize } from '../utils/imageUtils';
import { useTranslation } from '../i18n';

interface EntryModalProps {
  isOpen: boolean;
  isNewMarker: boolean;
  initialTitle?: string;
  initialDescription?: string;
  initialImage?: string;
  initialPainLevel?: number;
  initialTags?: string[];
  onClose: () => void;
  onSave: (title: string, description: string, image?: string, painLevel?: number, tags?: string[]) => void;
}

export const EntryModal: React.FC<EntryModalProps> = ({
  isOpen,
  isNewMarker,
  initialTitle = "",
  initialDescription = "",
  initialImage,
  initialPainLevel,
  initialTags,
  onClose,
  onSave,
}) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState(initialTitle);
  const [description, setDescription] = useState(initialDescription);
  const [image, setImage] = useState<string | undefined>(initialImage);
  const [painLevel, setPainLevel] = useState<number | undefined>(initialPainLevel);
  const [selectedTags, setSelectedTags] = useState<string[]>(initialTags || []);
  const [isDragging, setIsDragging] = useState(false);
  const [imageSizeKB, setImageSizeKB] = useState<number | null>(null);

  const processImage = useCallback(async (dataUrl: string) => {
    const sizeKB = getImageSizeKB(dataUrl);
    let result = dataUrl;
    if (sizeKB > 500) {
      result = await compressImage(dataUrl);
    }
    setImage(result);
    setImageSizeKB(getImageSizeKB(result));
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTitle(initialTitle);
      setDescription(initialDescription);
      setImage(initialImage);
      setPainLevel(initialPainLevel);
      setSelectedTags(initialTags || []);
    }
  }, [isOpen, initialTitle, initialDescription, initialImage, initialPainLevel, initialTags]);

  const readFileAsDataUrl = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        processImage(reader.result);
      }
    };
    reader.readAsDataURL(file);
  }, [processImage]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file?.type.startsWith('image/')) readFileAsDataUrl(file);
  }, [readFileAsDataUrl]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Clipboard paste
  useEffect(() => {
    if (!isOpen) return;
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;
      for (const item of Array.from(items)) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile();
          if (file) readFileAsDataUrl(file);
          break;
        }
      }
    };
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [isOpen, readFileAsDataUrl]);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) readFileAsDataUrl(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isNewMarker && !title) return;
    if (!description) return;
    onSave(title, description, image, painLevel, selectedTags.length > 0 ? selectedTags : undefined);
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div 
        className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-200 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-800/20">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Clock size={20} className="text-blue-500" />
              {isNewMarker
                ? t.newTrackingPoint
                : initialDescription
                ? t.editEntryModalTitle
                : t.newEntry}
            </h3>
            <p className="text-slate-400 text-xs mt-0.5">{t.autoTimestamp(new Date().toLocaleDateString())}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto flex-1">
          {isNewMarker && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300">{t.pointName}</label>
              <input
                autoFocus
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t.pointNamePlaceholder}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all placeholder:text-slate-600"
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300">{t.observationNotes}</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t.observationPlaceholder}
              className="w-full h-32 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all resize-none placeholder:text-slate-600 text-sm"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300">
                {t.painLevel}
                <span className="text-slate-500 font-normal ml-1">{t.optional}</span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={painLevel ?? 5}
                  onChange={(e) => setPainLevel(Number(e.target.value))}
                  className="flex-1 h-2 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: painLevel != null
                      ? `linear-gradient(to right, #22c55e, #eab308 50%, #ef4444)`
                      : '#334155',
                  }}
                />
                {painLevel != null ? (
                  <div className="flex items-center gap-2">
                    <span
                      className="text-sm font-bold w-8 text-center rounded-lg py-1"
                      style={{
                        color: painLevel <= 3 ? '#22c55e' : painLevel <= 6 ? '#eab308' : '#ef4444',
                      }}
                    >
                      {painLevel}
                    </span>
                    <button
                      type="button"
                      onClick={() => setPainLevel(undefined)}
                      className="text-slate-500 hover:text-slate-300 transition-colors"
                      title={t.removePainLevel}
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setPainLevel(5)}
                    className="text-xs text-slate-500 hover:text-slate-300 transition-colors whitespace-nowrap"
                  >
                    {t.activate}
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300">
                {t.tags}
                <span className="text-slate-500 font-normal ml-1">{t.optional}</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {t.presetTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() =>
                        setSelectedTags((prev) =>
                          isSelected ? prev.filter((t) => t !== tag) : [...prev, tag]
                        )
                      }
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                        isSelected
                          ? 'bg-blue-500/20 border-blue-500/50 text-blue-400'
                          : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-500'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300">
              {t.visualDocumentation}
              <span className="text-slate-500 font-normal ml-1">{t.dragPasteOrClick}</span>
            </label>
            <div
              className="flex gap-4"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <label className={`flex-1 flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 cursor-pointer transition-all bg-slate-800/50 group ${
                isDragging ? 'border-blue-500 bg-blue-500/10' : 'border-slate-700 hover:border-slate-500'
              }`}>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                {image ? (
                  <div className="relative w-full group/img">
                    <img
                      src={image}
                      alt={t.preview}
                      className="w-full h-32 object-contain rounded-lg"
                    />
                    {imageSizeKB != null && (
                      <span className="absolute top-2 left-2 text-[10px] bg-slate-900/80 text-slate-300 px-1.5 py-0.5 rounded backdrop-blur-sm">
                        {formatFileSize(imageSizeKB)}
                      </span>
                    )}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity rounded-lg gap-4">
                      <Camera className="text-white" size={24} />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setImage(undefined);
                          setImageSizeKB(null);
                        }}
                        className="bg-red-500 p-2 rounded-full text-white hover:bg-red-600 transition-colors"
                        title={t.deleteImage}
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <Camera className={`mb-2 ${isDragging ? 'text-blue-400' : 'text-slate-500'}`} size={28} />
                    <span className={`text-xs ${isDragging ? 'text-blue-400' : 'text-slate-500'}`}>
                      {isDragging ? t.dropImageHere : t.uploadImage}
                    </span>
                    <span className="text-[10px] text-slate-600 mt-1">{t.ctrlVToPaste}</span>
                  </>
                )}
              </label>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-3 text-sm font-bold text-slate-400 hover:text-white transition-colors"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="flex-[2] bg-blue-600 hover:bg-blue-500 py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 transition-all active:scale-95"
            >
              <Save size={18} />
              {t.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
