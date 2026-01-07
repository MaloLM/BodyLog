
import React, { useState, useEffect } from 'react';
import { X, Camera, Save, Clock } from 'lucide-react';

interface EntryModalProps {
  isOpen: boolean;
  isNewMarker: boolean;
  onClose: () => void;
  onSave: (title: string, description: string, image?: string) => void;
}

export const EntryModal: React.FC<EntryModalProps> = ({ isOpen, isNewMarker, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | undefined>();
  
  useEffect(() => {
    if (isOpen) {
      setTitle('');
      setDescription('');
      setImage(undefined);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isNewMarker && !title) return;
    if (!description) return;
    onSave(title, description, image);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-200">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center bg-slate-800/20">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Clock size={20} className="text-blue-500" />
              {isNewMarker ? 'Capture New Marker' : 'New Timeline Entry'}
            </h3>
            <p className="text-slate-400 text-xs mt-0.5">Automated timestamp: {new Date().toLocaleDateString()}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {isNewMarker && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300">Marker Title</label>
              <input 
                autoFocus
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Left Knee Inflammation" 
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all placeholder:text-slate-600"
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300">Observation Notes</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe clinical findings, pain levels, or visual symptoms..."
              className="w-full h-32 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 outline-none transition-all resize-none placeholder:text-slate-600 text-sm"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-300">Visual Documentation</label>
            <div className="flex gap-4">
              <label className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-700 rounded-xl p-6 hover:border-slate-500 cursor-pointer transition-all bg-slate-800/50 group">
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                {image ? (
                  <div className="relative w-full">
                    <img src={image} className="w-full h-32 object-contain rounded-lg" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-lg">
                      <Camera className="text-white" size={24} />
                    </div>
                  </div>
                ) : (
                  <>
                    <Camera className="text-slate-500 mb-2" size={28} />
                    <span className="text-xs text-slate-500">Upload Reference Image</span>
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
              Cancel
            </button>
            <button 
              type="submit"
              className="flex-[2] bg-blue-600 hover:bg-blue-500 py-3 rounded-xl text-sm font-bold text-white flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 transition-all active:scale-95"
            >
              <Save size={18} />
              Save Observation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
