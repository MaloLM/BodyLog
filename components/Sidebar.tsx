
import React from 'react';
import { Marker, Entry } from '../types';
import { Plus, History, MapPin, Search, Calendar, Image as ImageIcon } from 'lucide-react';

interface SidebarProps {
  markers: Marker[];
  selectedMarker: Marker | null;
  onSelectMarker: (id: string | null) => void;
  onAddEntry: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ 
  markers, 
  selectedMarker, 
  onSelectMarker, 
  onAddEntry 
}) => {
  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-slate-800">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          {selectedMarker ? <History className="text-blue-500" /> : <MapPin className="text-blue-500" />}
          {selectedMarker ? 'Marker Timeline' : 'Anatomy Overview'}
        </h2>
        <p className="text-slate-400 text-sm mt-1">
          {selectedMarker 
            ? `Tracking progression for: ${selectedMarker.title}` 
            : `${markers.length} points documented across current model`}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
        {selectedMarker ? (
          // Detailed View: Timeline of Entries
          <div className="space-y-6">
            <button 
              onClick={() => onSelectMarker(null)}
              className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1 font-medium transition-colors"
            >
              ← Back to Overview
            </button>
            
            <div className="relative pl-6 border-l-2 border-slate-800 space-y-8">
              {selectedMarker.entries.map((entry, idx) => (
                <div key={entry.id} className="relative">
                  {/* Timeline Dot */}
                  <div className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-4 border-slate-900 ${idx === 0 ? 'bg-blue-500' : 'bg-slate-700'}`} />
                  
                  <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                        <Calendar size={12} /> {entry.date}
                      </span>
                      {idx === 0 && <span className="bg-blue-500/10 text-blue-400 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">Latest</span>}
                    </div>
                    <p className="text-slate-200 text-sm leading-relaxed">{entry.description}</p>
                    {entry.imageUrl && (
                      <div className="mt-3 rounded-lg overflow-hidden border border-slate-700">
                        <img src={entry.imageUrl} alt="Documentation" className="w-full h-32 object-cover" />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <button 
              onClick={onAddEntry}
              className="w-full py-4 border-2 border-dashed border-slate-700 rounded-xl flex items-center justify-center gap-2 text-slate-400 hover:text-white hover:border-slate-500 transition-all"
            >
              <Plus size={20} />
              <span className="font-medium">Add Update Entry</span>
            </button>
          </div>
        ) : (
          // Global View: Marker Cards
          <div className="space-y-3">
            {markers.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center text-center opacity-50">
                <div className="bg-slate-800 p-4 rounded-full mb-4">
                  <MapPin size={32} />
                </div>
                <p className="text-slate-400">No markers placed yet.</p>
                <p className="text-xs">Double click on the 3D model to start.</p>
              </div>
            ) : (
              markers.map(marker => (
                <div 
                  key={marker.id}
                  onClick={() => onSelectMarker(marker.id)}
                  className="group bg-slate-800/40 hover:bg-slate-800 p-4 rounded-xl border border-slate-700/50 hover:border-blue-500/50 cursor-pointer transition-all"
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold text-white">{marker.title}</h3>
                    <span className="text-[10px] text-slate-500 font-mono">{marker.entries.length} entries</span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1 mb-3">
                    {marker.entries[0]?.description}
                  </p>
                  <div className="flex items-center gap-2">
                    {marker.entries.slice(0, 3).map((e, i) => (
                      e.imageUrl ? (
                        <img key={e.id} src={e.imageUrl} className="w-8 h-8 rounded-md object-cover border border-slate-600" />
                      ) : (
                        <div key={e.id} className="w-8 h-8 rounded-md bg-slate-700 flex items-center justify-center text-slate-500">
                          <ImageIcon size={14} />
                        </div>
                      )
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-800 bg-slate-900/80 backdrop-blur-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
          <input 
            type="text" 
            placeholder="Search anatomy notes..." 
            className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};
