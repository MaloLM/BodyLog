
import React, { useState, useCallback, useMemo } from 'react';
import { Viewer3D } from './components/Viewer3D';
import { Sidebar } from './components/Sidebar';
import { EntryModal } from './components/EntryModal';
import { Marker, Gender, Entry } from './types';
import { User, Users, ChevronLeft, ChevronRight, Activity } from 'lucide-react';

// Robust ID generator to prevent crashes in non-secure contexts
const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
};

const App: React.FC = () => {
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
  const [gender, setGender] = useState<Gender>('male');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingMarkerPos, setPendingMarkerPos] = useState<[number, number, number] | null>(null);

  const selectedMarker = useMemo(() => 
    markers.find(m => m.id === selectedMarkerId) || null,
    [markers, selectedMarkerId]
  );

  const handlePointClick = useCallback((position: [number, number, number]) => {
    setPendingMarkerPos(position);
    setIsModalOpen(true);
  }, []);

  const handleSaveMarker = useCallback((title: string, description: string, image?: string) => {
    const newEntry: Entry = {
      id: generateId(),
      date: new Date().toLocaleDateString(),
      description,
      imageUrl: image
    };

    if (pendingMarkerPos) {
      // New Marker
      const newMarker: Marker = {
        id: generateId(),
        title,
        position: pendingMarkerPos,
        entries: [newEntry],
        createdAt: new Date().toISOString()
      };
      setMarkers(prev => [...prev, newMarker]);
      setSelectedMarkerId(newMarker.id);
    } else if (selectedMarkerId) {
      // Add entry to existing marker
      setMarkers(prev => prev.map(m => 
        m.id === selectedMarkerId 
          ? { ...m, entries: [newEntry, ...m.entries] }
          : m
      ));
    }

    setIsModalOpen(false);
    setPendingMarkerPos(null);
  }, [pendingMarkerPos, selectedMarkerId]);

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* 3D Canvas Section */}
      <div className={`relative transition-all duration-500 ease-in-out h-full overflow-hidden ${isSidebarOpen ? 'w-[65%]' : 'w-full'}`}>
        <div className="absolute top-6 left-6 z-10 flex items-center gap-4">
          <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700 p-1 rounded-xl shadow-xl flex">
            <button 
              onClick={() => setGender('male')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${gender === 'male' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              <User size={18} />
              <span className="text-sm font-medium">Male</span>
            </button>
            <button 
              onClick={() => setGender('female')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${gender === 'female' ? 'bg-pink-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
            >
              <Users size={18} />
              <span className="text-sm font-medium">Female</span>
            </button>
          </div>
          <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700 px-4 py-2 rounded-xl shadow-xl hidden sm:flex">
             <div className="flex items-center gap-2 text-blue-400">
               <Activity size={18} />
               <span className="text-xs font-bold uppercase tracking-widest">AnatomyNode Live</span>
             </div>
          </div>
        </div>

        <Viewer3D 
          gender={gender} 
          markers={markers} 
          selectedMarkerId={selectedMarkerId}
          onPointClick={handlePointClick}
          onMarkerSelect={setSelectedMarkerId}
        />

        {!isSidebarOpen && (
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="absolute top-1/2 right-4 translate-y-[-50%] z-20 bg-slate-800 border border-slate-700 p-2 rounded-full hover:bg-slate-700 shadow-xl"
            aria-label="Open Sidebar"
          >
            <ChevronLeft size={24} />
          </button>
        )}
      </div>

      {/* Sidebar Section */}
      <div className={`relative bg-slate-900 border-l border-slate-800 transition-all duration-500 ease-in-out h-full flex flex-col ${isSidebarOpen ? 'w-[35%] opacity-100' : 'w-0 opacity-0'}`}>
        {isSidebarOpen && (
          <>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="absolute top-1/2 -left-4 translate-y-[-50%] z-20 bg-slate-800 border border-slate-700 p-2 rounded-full hover:bg-slate-700 shadow-xl"
              aria-label="Close Sidebar"
            >
              <ChevronRight size={24} />
            </button>
            
            <Sidebar 
              markers={markers}
              selectedMarker={selectedMarker}
              onSelectMarker={setSelectedMarkerId}
              onAddEntry={() => {
                setPendingMarkerPos(null);
                setIsModalOpen(true);
              }}
            />
          </>
        )}
      </div>

      {/* Entry Modal */}
      <EntryModal 
        isOpen={isModalOpen}
        isNewMarker={!!pendingMarkerPos}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveMarker}
      />
    </div>
  );
};

export default App;
