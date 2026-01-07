import React, { useState, useCallback, useMemo } from "react";
import { Viewer3D } from "./components/Viewer3D";
import { Sidebar } from "./components/Sidebar";
import { EntryModal } from "./components/EntryModal";
import { HelpModal } from "./components/HelpModal";
import { Marker, Gender, Entry } from "./types";
import {
  Activity,
  HelpCircle,
  PanelRightClose,
  PanelRightOpen,
  Monitor,
} from "lucide-react";

// Robust ID generator to prevent crashes in non-secure contexts
const generateId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
};

const App: React.FC = () => {
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
  const [gender, setGender] = useState<Gender>(() => {
    const saved = localStorage.getItem("bodylog_gender");
    return (saved as Gender) || "male";
  });
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    const saved = localStorage.getItem("bodylog_sidebar_open");
    return saved !== null ? saved === "true" : true;
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [pendingMarkerPos, setPendingMarkerPos] = useState<
    [number, number, number] | null
  >(null);
  const [editingEntry, setEditingEntry] = useState<{
    markerId: string;
    entry: Entry;
  } | null>(null);

  const selectedMarker = useMemo(
    () => markers.find((m) => m.id === selectedMarkerId) || null,
    [markers, selectedMarkerId]
  );

  const handlePointClick = useCallback((position: [number, number, number]) => {
    setPendingMarkerPos(position);
    setIsModalOpen(true);
  }, []);

  const handleSaveMarker = useCallback(
    (title: string, description: string, image?: string) => {
      if (editingEntry) {
        // Update existing entry
        setMarkers((prev) =>
          prev.map((m) =>
            m.id === editingEntry.markerId
              ? {
                  ...m,
                  entries: m.entries.map((e) =>
                    e.id === editingEntry.entry.id
                      ? { ...e, description, imageUrl: image }
                      : e
                  ),
                }
              : m
          )
        );
        setEditingEntry(null);
      } else {
        const newEntry: Entry = {
          id: generateId(),
          date: new Date().toLocaleDateString(),
          description,
          imageUrl: image,
        };

        if (pendingMarkerPos) {
          // New Marker
          const newMarker: Marker = {
            id: generateId(),
            title,
            position: pendingMarkerPos,
            entries: [newEntry],
            createdAt: new Date().toISOString(),
          };
          setMarkers((prev) => [...prev, newMarker]);
          setSelectedMarkerId(newMarker.id);
        } else if (selectedMarkerId) {
          // Add entry to existing marker
          setMarkers((prev) =>
            prev.map((m) =>
              m.id === selectedMarkerId
                ? { ...m, entries: [newEntry, ...m.entries] }
                : m
            )
          );
        }
      }

      setIsModalOpen(false);
      setPendingMarkerPos(null);
    },
    [pendingMarkerPos, selectedMarkerId, editingEntry]
  );

  const handleDeleteMarker = useCallback((markerId: string) => {
    setMarkers((prev) => prev.filter((m) => m.id !== markerId));
    setSelectedMarkerId((prev) => (prev === markerId ? null : prev));
  }, []);

  const handleDeleteEntry = useCallback(
    (markerId: string, entryId: string) => {
      setMarkers((prev) =>
        prev
          .map((m) => {
            if (m.id !== markerId) return m;
            const updatedEntries = m.entries.filter((e) => e.id !== entryId);
            return { ...m, entries: updatedEntries };
          })
          .filter((m) => m.entries.length > 0)
      );
    },
    []
  );

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Mobile Overlay */}
      <div className="lg:hidden fixed inset-0 z-[1000] bg-slate-950 flex flex-col items-center justify-center p-8 text-center">
        <div className="bg-blue-500/10 p-6 rounded-3xl mb-6 text-blue-400">
          <Monitor size={48} />
        </div>
        <h1 className="text-2xl font-bold text-white mb-4">Desktop Only</h1>
        <p className="text-slate-400 max-w-xs leading-relaxed">
          BodyLog is designed for high-precision 3D anatomical tracking and is
          currently only available on desktop devices.
        </p>
      </div>

      {/* 3D Canvas Section */}
      <div
        className={`relative transition-all duration-500 ease-in-out h-full overflow-hidden ${
          isSidebarOpen ? "w-[65%]" : "w-full"
        }`}
      >
        <div className="absolute top-6 left-6 z-10 flex items-center gap-4">
          <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700 px-4 py-2 rounded-xl shadow-xl flex items-center gap-2 text-blue-400">
            <Activity size={18} />
            <span className="text-sm font-bold tracking-widest text-white">
              BodyLog
            </span>
          </div>

          <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700 p-1 rounded-xl shadow-xl flex">
            <button
              onClick={() => {
                setGender("male");
                localStorage.setItem("bodylog_gender", "male");
              }}
              className={`px-4 py-2 rounded-lg flex items-center transition-all ${
                gender === "male"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span className="text-sm font-medium">Male</span>
            </button>
            <button
              onClick={() => {
                setGender("female");
                localStorage.setItem("bodylog_gender", "female");
              }}
              className={`px-4 py-2 rounded-lg flex items-center transition-all ${
                gender === "female"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span className="text-sm font-medium">Female</span>
            </button>
          </div>

          <button
            onClick={() => setIsHelpOpen(true)}
            className="bg-slate-800/80 backdrop-blur-md border border-slate-700 p-2.5 rounded-xl shadow-xl text-slate-400 hover:text-white transition-all"
            title="Help"
          >
            <HelpCircle size={20} />
          </button>
        </div>

        <div className="absolute top-6 right-6 z-10">
          <button
            onClick={() => {
              const newState = !isSidebarOpen;
              setIsSidebarOpen(newState);
              localStorage.setItem("bodylog_sidebar_open", String(newState));
            }}
            className={`bg-slate-800/80 backdrop-blur-md border border-slate-700 p-2.5 rounded-xl shadow-xl transition-all ${
              isSidebarOpen
                ? "text-blue-400"
                : "text-slate-400 hover:text-white"
            }`}
            title={isSidebarOpen ? "Close Sidebar" : "Open Sidebar"}
          >
            {isSidebarOpen ? (
              <PanelRightClose size={20} />
            ) : (
              <PanelRightOpen size={20} />
            )}
          </button>
        </div>

        <Viewer3D
          gender={gender}
          markers={markers}
          selectedMarkerId={selectedMarkerId}
          onPointClick={handlePointClick}
          onMarkerSelect={setSelectedMarkerId}
          isModalOpen={isModalOpen || isHelpOpen || isLightboxOpen}
        />
      </div>

      {/* Sidebar Section */}
      <div
        className={`relative bg-slate-900 border-l border-slate-800 transition-all duration-500 ease-in-out h-full flex flex-col ${
          isSidebarOpen ? "w-[35%] opacity-100" : "w-0 opacity-0"
        }`}
      >
        {isSidebarOpen && (
          <Sidebar
            markers={markers}
            selectedMarker={selectedMarker}
            onSelectMarker={setSelectedMarkerId}
            onAddEntry={() => {
              setPendingMarkerPos(null);
              setEditingEntry(null);
              setIsModalOpen(true);
            }}
            onEditEntry={(markerId, entry) => {
              setEditingEntry({ markerId, entry });
              setPendingMarkerPos(null);
              setIsModalOpen(true);
            }}
            onDeleteMarker={handleDeleteMarker}
            onDeleteEntry={handleDeleteEntry}
            onLightboxToggle={setIsLightboxOpen}
          />
        )}
      </div>

      {/* Entry Modal */}
      <EntryModal
        isOpen={isModalOpen}
        isNewMarker={!!pendingMarkerPos}
        initialDescription={editingEntry?.entry.description}
        initialImage={editingEntry?.entry.imageUrl}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEntry(null);
        }}
        onSave={handleSaveMarker}
      />

      {/* Help Modal */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
    </div>
  );
};

export default App;
