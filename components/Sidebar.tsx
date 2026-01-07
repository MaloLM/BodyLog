import React, { useState, useMemo } from "react";
import {
  Plus,
  History,
  CircleDot,
  Search,
  Calendar,
  Image as ImageIcon,
  Trash2,
  Edit2,
} from "lucide-react";
import { ImageLightbox } from "./ImageLightbox";
import { ConfirmModal } from "./ConfirmModal";

import { Entry, Marker } from "../types";

interface SidebarProps {
  markers: Marker[];
  selectedMarker: Marker | null;
  onSelectMarker: (id: string | null) => void;
  onAddEntry: () => void;
  onEditEntry: (markerId: string, entry: Entry) => void;
  onDeleteMarker: (id: string) => void;
  onDeleteEntry: (markerId: string, entryId: string) => void;
  onLightboxToggle?: (isOpen: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  markers,
  selectedMarker,
  onSelectMarker,
  onAddEntry,
  onEditEntry,
  onDeleteMarker,
  onDeleteEntry,
  onLightboxToggle,
}) => {
  const [lightboxIndex, setLightboxIndex] = useState(-1);
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmConfig, setConfirmConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });

  const filteredMarkers = useMemo(() => {
    if (!searchQuery.trim()) return markers;
    const query = searchQuery.toLowerCase();
    return markers.filter(
      (m) =>
        m.title.toLowerCase().includes(query) ||
        m.entries.some((e) => e.description.toLowerCase().includes(query))
    );
  }, [markers, searchQuery]);

  const timelineEntries = useMemo(() => {
    if (!selectedMarker) return [];
    return selectedMarker.entries.map((e) => ({
      url: e.imageUrl,
      description: e.description,
      date: e.date,
    }));
  }, [selectedMarker]);

  const handleEntryClick = (index: number) => {
    setLightboxIndex(index);
    onLightboxToggle?.(true);
  };

  const handleCloseLightbox = () => {
    setLightboxIndex(-1);
    onLightboxToggle?.(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-slate-800">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          {selectedMarker ? <History className="text-blue-500" /> : <></>}
          {selectedMarker ? "Marker Timeline" : "Anatomy Overview"}
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
                  <div
                    className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border-4 border-slate-900 ${
                      idx === 0 ? "bg-blue-500" : "bg-slate-700"
                    }`}
                  />

                  <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700/50 group/entry">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                          <Calendar size={12} /> {entry.date}
                        </span>
                        {idx === 0 && (
                          <span className="bg-blue-500/10 text-blue-400 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase">
                            Latest
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 opacity-0 group-hover/entry:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onEditEntry(selectedMarker.id, entry);
                          }}
                          className="text-slate-400 hover:text-blue-400 transition-colors p-1 hover:bg-slate-700/50 rounded"
                          title="Edit entry"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmConfig({
                              isOpen: true,
                              title: "Delete Entry",
                              message:
                                "Are you sure you want to delete this entry? This action cannot be undone.",
                              onConfirm: () => {
                                onDeleteEntry(selectedMarker.id, entry.id);
                                setConfirmConfig((prev) => ({
                                  ...prev,
                                  isOpen: false,
                                }));
                              },
                            });
                          }}
                          className="text-slate-400 hover:text-red-400 transition-colors p-1 hover:bg-slate-700/50 rounded"
                          title="Delete entry"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <p className="text-slate-200 text-sm leading-relaxed">
                      <span className="text-slate-500 font-medium mr-2">
                        {entry.date} —
                      </span>
                      {entry.description}
                    </p>
                    <div
                      className={`mt-3 rounded-lg overflow-hidden border cursor-zoom-in group/img relative ${
                        entry.imageUrl
                          ? "border-slate-700"
                          : "border-slate-800 bg-slate-900/50 h-24 flex flex-col items-center justify-center gap-2 text-slate-600"
                      }`}
                      onClick={() => handleEntryClick(idx)}
                    >
                      {entry.imageUrl ? (
                        <>
                          <img
                            src={entry.imageUrl}
                            alt="Documentation"
                            className="w-full h-32 object-cover transition-transform duration-500 group-hover/img:scale-110"
                          />
                          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="bg-slate-900/80 text-white text-[10px] font-bold px-2 py-1 rounded-full backdrop-blur-sm border border-white/10">
                              Click to enlarge
                            </span>
                          </div>
                        </>
                      ) : (
                        <>
                          <ImageIcon size={20} />
                          <span className="text-[10px] font-medium uppercase tracking-wider">
                            No image provided
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={onAddEntry}
              className="w-full py-4 border-2 border-dashed border-slate-700 rounded-xl flex items-center justify-center gap-2 text-slate-400 hover:text-white hover:border-slate-500 transition-all"
            >
              <Plus size={20} />
              <span className="font-medium">Add Entry</span>
            </button>
          </div>
        ) : (
          // Global View: Marker Cards
          <div className="space-y-3">
            {filteredMarkers.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center text-center opacity-50">
                <div className="bg-slate-800 p-4 rounded-full mb-4">
                  <CircleDot size={32} />
                </div>
                <p className="text-slate-400">
                  {searchQuery
                    ? "No matching markers found."
                    : "No markers placed yet."}
                </p>
                <p className="text-xs">
                  {searchQuery
                    ? "Try a different search term."
                    : "Double click on the 3D model to start."}
                </p>
              </div>
            ) : (
              filteredMarkers.map((marker) => {
                const entriesWithImages = marker.entries.filter(
                  (e) => e.imageUrl
                );
                const displayEntries = entriesWithImages.slice(0, 3);

                return (
                  <div
                    key={marker.id}
                    onClick={() => onSelectMarker(marker.id)}
                    className="group bg-slate-800/40 hover:bg-slate-800 px-4 py-3 rounded-xl border border-slate-700/50 hover:border-blue-500/50 cursor-pointer transition-all flex gap-4 items-center overflow-hidden min-h-[100px] relative"
                  >
                    {/* Left side: Text info */}
                    <div className="flex-1 min-w-0 py-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-white truncate leading-tight">
                          {marker.title}
                        </h3>
                        <div className="flex items-center gap-1">
                          <span className="text-[10px] text-slate-500 font-mono whitespace-nowrap bg-slate-900/50 px-1.5 py-0.5 rounded border border-slate-700/30">
                            {marker.entries.length}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setConfirmConfig({
                                isOpen: true,
                                title: "Delete Marker",
                                message: `Are you sure you want to delete "${marker.title}" and all its entries? This action cannot be undone.`,
                                onConfirm: () => {
                                  onDeleteMarker(marker.id);
                                  setConfirmConfig((prev) => ({ ...prev, isOpen: false }));
                                },
                              });
                            }}
                            className="p-1 text-slate-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                            title="Delete marker"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-slate-400 line-clamp-2 leading-snug">
                        {marker.entries[0]?.description || "No description"}
                      </p>
                    </div>

                    {/* Right side: Image stack (always 3 slots) */}
                    <div className="relative w-32 h-[76px] flex-shrink-0">
                      {[0, 1, 2].map((i) => {
                        const entry = displayEntries[i];
                        return (
                          <div
                            key={i}
                            className="absolute rounded-lg overflow-hidden border border-slate-700 shadow-2xl transition-all duration-300 group-hover:border-blue-500/30 bg-slate-900/80 flex items-center justify-center"
                            style={{
                              left: `${i * 16}px`,
                              top: `${i * 2}px`,
                              zIndex: 10 - i,
                              opacity: 1 - i * 0.3,
                              transform: `scale(${1 - i * 0.05})`,
                              width: "4.5rem", // 72px
                              height: "4.5rem", // 72px
                            }}
                          >
                            {entry?.imageUrl ? (
                              <img
                                src={entry.imageUrl}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <ImageIcon size={24} className="text-slate-700" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-slate-800 bg-slate-900/80 backdrop-blur-md">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
            size={16}
          />
          <input
            type="text"
            placeholder="Search anatomy notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <ImageLightbox
        entries={timelineEntries}
        currentIndex={lightboxIndex}
        onClose={handleCloseLightbox}
        onPrev={() =>
          setLightboxIndex((prev) =>
            prev > 0 ? prev - 1 : timelineEntries.length - 1
          )
        }
        onNext={() =>
          setLightboxIndex((prev) =>
            prev < timelineEntries.length - 1 ? prev + 1 : 0
          )
        }
      />

      <ConfirmModal
        isOpen={confirmConfig.isOpen}
        title={confirmConfig.title}
        message={confirmConfig.message}
        onConfirm={confirmConfig.onConfirm}
        onCancel={() => setConfirmConfig((prev) => ({ ...prev, isOpen: false }))}
      />
    </div>
  );
};
