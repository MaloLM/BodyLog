import React, { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { Viewer3D } from "./components/Viewer3D";
import { Sidebar } from "./components/Sidebar";
import { EntryModal } from "./components/EntryModal";
import { HelpModal } from "./components/HelpModal";
import { WelcomeModal } from "./components/WelcomeModal";
import { ImportModal } from "./components/ImportModal";
import { PasswordModal } from "./components/PasswordModal";
import { LeaveWarningModal } from "./components/LeaveWarningModal";
import { LanguageSwitcher } from "./components/LanguageSwitcher";
import { Marker, Gender, Entry, SkinMode, SKIN_OPTIONS } from "./types";
import { exportArchive, importArchive } from "./utils/archive";
import { useLocalStorage, useLocalStorageBoolean } from "./utils/useLocalStorage";
import { useClickOutside } from "./utils/useClickOutside";
import { useKeyboardShortcuts } from "./utils/useKeyboardShortcuts";
import { exportPDF } from "./utils/pdfExport";
import type { ArchiveManifest } from "./utils/archiveTypes";
import { ENCRYPTED_SENTINEL } from "./utils/archiveTypes";
import { useTranslation, Language } from "./i18n";
import {
  Activity,
  HelpCircle,
  PanelRightClose,
  PanelRightOpen,
  Monitor,
  Grid3x3,
  Palette,
} from "lucide-react";

// Robust ID generator to prevent crashes in non-secure contexts
const generateId = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
};

const App: React.FC = () => {
  const { t, language, setLanguage } = useTranslation();
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [selectedMarkerId, setSelectedMarkerId] = useState<string | null>(null);
  const [gender, setGender] = useLocalStorage<Gender>("bodylog_gender", "male");
  const [skinMode, setSkinMode] = useLocalStorage<SkinMode>("bodylog_skin_mode", "mesh");
  const [isSkinPopoverOpen, setIsSkinPopoverOpen] = useState(false);
  const skinPopoverRef = useRef<HTMLDivElement>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useLocalStorageBoolean("bodylog_sidebar_open", true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(() => {
    const hasVisited = localStorage.getItem("bodylog_visited");
    return !hasVisited;
  });
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [pendingMarkerPos, setPendingMarkerPos] = useState<
    [number, number, number] | null
  >(null);
  const [editingEntry, setEditingEntry] = useState<{
    markerId: string;
    entry: Entry;
  } | null>(null);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importErrors, setImportErrors] = useState<string[]>([]);
  const [importManifest, setImportManifest] = useState<ArchiveManifest | null>(null);
  const [importWarnings, setImportWarnings] = useState<string[]>([]);
  const [pendingImport, setPendingImport] = useState<{
    markers: Marker[];
    gender: Gender;
    skinMode?: SkinMode;
    language?: Language;
  } | null>(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordMode, setPasswordMode] = useState<"export" | "import">("export");
  const [passwordError, setPasswordError] = useState("");
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [isLeaveWarningOpen, setIsLeaveWarningOpen] = useState(false);
  const leaveActionRef = useRef<(() => void) | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedMarker = useMemo(
    () => markers.find((m) => m.id === selectedMarkerId) || null,
    [markers, selectedMarkerId]
  );

  const handlePointClick = useCallback((position: [number, number, number]) => {
    setPendingMarkerPos(position);
    setIsModalOpen(true);
  }, []);

  const handleCloseWelcome = useCallback(() => {
    setIsWelcomeOpen(false);
    localStorage.setItem("bodylog_visited", "true");
  }, []);

  const handleSaveMarker = useCallback(
    (title: string, description: string, image?: string, painLevel?: number, tags?: string[]) => {
      if (editingEntry) {
        // Update existing entry
        setMarkers((prev) =>
          prev.map((m) =>
            m.id === editingEntry.markerId
              ? {
                  ...m,
                  entries: m.entries.map((e) =>
                    e.id === editingEntry.entry.id
                      ? { ...e, description, imageUrl: image, painLevel, tags }
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
          painLevel,
          tags,
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

  const handleRenameMarker = useCallback((markerId: string, newTitle: string) => {
    setMarkers((prev) =>
      prev.map((m) => (m.id === markerId ? { ...m, title: newTitle } : m))
    );
  }, []);

  const handleDuplicateMarker = useCallback((markerId: string) => {
    setMarkers((prev) => {
      const source = prev.find((m) => m.id === markerId);
      if (!source) return prev;
      const clone: Marker = {
        ...source,
        id: generateId(),
        title: `${source.title} ${t.copyAppendix}`,
        entries: source.entries.map((e) => ({ ...e, id: generateId() })),
        createdAt: new Date().toISOString(),
      };
      return [...prev, clone];
    });
  }, []);

  // Undo / Redo
  const [history, setHistory] = useState<Marker[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const markersRef = useRef(markers);
  markersRef.current = markers;

  const pushHistory = useCallback((snapshot: Marker[]) => {
    setHistory((prev) => {
      const trimmed = prev.slice(0, historyIndex + 1);
      const next = [...trimmed, snapshot].slice(-20);
      setHistoryIndex(next.length - 1);
      return next;
    });
  }, [historyIndex]);

  // Wrap setMarkers to auto-push history
  const updateMarkers = useCallback((updater: (prev: Marker[]) => Marker[]) => {
    setMarkers((prev) => {
      pushHistory(prev);
      return updater(prev);
    });
  }, [pushHistory]);

  const handleUndo = useCallback(() => {
    if (historyIndex < 0) return;
    const snapshot = history[historyIndex];
    setHistoryIndex((i) => i - 1);
    setMarkers(snapshot);
  }, [history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex >= history.length - 1) return;
    const next = history[historyIndex + 1];
    if (!next) return;
    setHistoryIndex((i) => i + 1);
    setMarkers(next);
  }, [history, historyIndex]);

  const handleExport = useCallback(() => {
    setPasswordMode("export");
    setPasswordError("");
    setIsPasswordModalOpen(true);
  }, []);

  const handleExportPDF = useCallback(async () => {
    try {
      await exportPDF(markers, gender, t);
    } catch (err) {
      console.error("PDF export failed:", err);
    }
  }, [markers, gender]);

  const handlePasswordConfirm = useCallback(
    async (password: string | null) => {
      setIsPasswordModalOpen(false);

      if (passwordMode === "export") {
        try {
          await exportArchive(markers, gender, password, { skinMode, language });
        } catch (err) {
          console.error("Export failed:", err);
        }
        return;
      }

      // Import mode
      if (!pendingFile || !password) return;
      const result = await importArchive(pendingFile, password, t);
      if (result.success === false) {
        // Wrong password — reopen modal with error
        setPasswordError(result.errors[0]);
        setIsPasswordModalOpen(true);
        return;
      }
      // Success — proceed to import modal
      setImportErrors([]);
      setImportManifest(result.result.manifest);
      setImportWarnings(result.result.warnings);
      setPendingImport({
        markers: result.result.markers,
        gender: result.result.gender,
        skinMode: result.result.skinMode,
        language: result.result.language,
      });
      setPendingFile(null);
      setIsImportModalOpen(true);
    },
    [passwordMode, markers, gender, pendingFile, t]
  );

  const handlePasswordCancel = useCallback(() => {
    setIsPasswordModalOpen(false);
    setPendingFile(null);
    setPasswordError("");
  }, []);

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      // Reset input so the same file can be re-selected
      e.target.value = "";

      const result = await importArchive(file, undefined, t);
      if (result.success === false) {
        if (result.errors[0] === ENCRYPTED_SENTINEL) {
          setPendingFile(file);
          setPasswordMode("import");
          setPasswordError("");
          setIsPasswordModalOpen(true);
          return;
        }
        setImportErrors(result.errors);
        setImportManifest(null);
        setImportWarnings([]);
        setPendingImport(null);
      } else {
        setImportErrors([]);
        setImportManifest(result.result.manifest);
        setImportWarnings(result.result.warnings);
        setPendingImport({
          markers: result.result.markers,
          gender: result.result.gender,
        });
      }
      setIsImportModalOpen(true);
    },
    [t]
  );

  const handleImportConfirm = useCallback((mode: 'replace' | 'merge') => {
    if (pendingImport) {
      if (mode === 'merge') {
        setMarkers((prev) => {
          const existingIds = new Set(prev.map((m) => m.id));
          const newMarkers = pendingImport.markers.filter((m) => !existingIds.has(m.id));
          return [...prev, ...newMarkers];
        });
      } else {
        setMarkers(pendingImport.markers);
        setGender(pendingImport.gender);
        if (pendingImport.skinMode) {
          setSkinMode(pendingImport.skinMode);
        }
        if (pendingImport.language) {
          setLanguage(pendingImport.language);
        }
      }
      setSelectedMarkerId(null);
    }
    setIsImportModalOpen(false);
    setPendingImport(null);
  }, [pendingImport]);

  const handleImportClose = useCallback(() => {
    setIsImportModalOpen(false);
    setPendingImport(null);
  }, []);

  // Close skin popover on click outside
  useClickOutside(skinPopoverRef, useCallback(() => setIsSkinPopoverOpen(false), []));

  // Warn before leaving / refreshing when there is data
  useEffect(() => {
    if (markers.length === 0) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [markers.length > 0]);

  // Global keyboard shortcuts
  useKeyboardShortcuts({
    markers,
    leaveActionRef,
    setIsLeaveWarningOpen,
    handleUndo,
    handleRedo,
    isLeaveWarningOpen,
    isPasswordModalOpen,
    handlePasswordCancel,
    isImportModalOpen,
    handleImportClose,
    isHelpOpen,
    setIsHelpOpen,
    isModalOpen,
    setIsModalOpen,
    setEditingEntry,
    selectedMarkerId,
    setSelectedMarkerId,
  });

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 text-slate-100">
      {/* Mobile Overlay */}
      <div className="lg:hidden fixed inset-0 z-[1000] bg-slate-950 flex flex-col items-center justify-center p-8 text-center">
        <div className="bg-blue-500/10 p-6 rounded-3xl mb-6 text-blue-400">
          <Monitor size={48} />
        </div>
        <h1 className="text-2xl font-bold text-white mb-4">{t.desktopOnly}</h1>
        <p className="text-slate-400 max-w-xs leading-relaxed">
          {t.desktopOnlyDescription}
        </p>
      </div>

      {/* 3D Canvas Section */}
      <div
        className={`relative transition-all duration-500 ease-in-out h-full overflow-hidden ${
          isSidebarOpen ? "w-[65%]" : "w-full"
        }`}
      >
        <div className="absolute top-6 left-6 z-10">
          <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700 px-4 py-2 rounded-xl shadow-xl flex items-center gap-2 text-blue-400">
            <Activity size={18} />
            <span className="text-sm font-bold tracking-widest text-white">
              BodyLog
            </span>
          </div>
        </div>

        <div className="absolute top-6 right-6 z-10 flex items-stretch gap-4">
          <div className="bg-slate-800/80 backdrop-blur-md border border-slate-700 p-1 rounded-xl shadow-xl flex">
            <button
              onClick={() => setGender("male")}
              className={`px-4 py-2 rounded-lg flex items-center transition-all ${
                gender === "male"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span className="text-sm font-medium">{t.male}</span>
            </button>
            <button
              onClick={() => setGender("female")}
              className={`px-4 py-2 rounded-lg flex items-center transition-all ${
                gender === "female"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <span className="text-sm font-medium">{t.female}</span>
            </button>
          </div>

          <div ref={skinPopoverRef} className="relative flex">
            <button
              onClick={() => setIsSkinPopoverOpen((o) => !o)}
              className={`bg-slate-800/80 backdrop-blur-md border border-slate-700 p-2.5 rounded-xl shadow-xl transition-all flex items-center ${
                isSkinPopoverOpen
                  ? "text-blue-400 border-blue-500/50"
                  : "text-slate-400 hover:text-white"
              }`}
              title={t.skinColor}
            >
              <Palette size={20} />
            </button>
            {isSkinPopoverOpen && (
              <div className="absolute top-full mt-2 right-0 bg-slate-800 border border-slate-700 rounded-xl shadow-2xl p-3 z-50 flex items-center gap-2">
                {SKIN_OPTIONS.map((opt) => (
                  <button
                    key={opt.key}
                    onClick={() => {
                      setSkinMode(opt.key);
                      setIsSkinPopoverOpen(false);
                    }}
                    className={`relative w-8 h-8 rounded-full border-2 transition-all flex items-center justify-center ${
                      skinMode === opt.key
                        ? "border-blue-400 scale-110 shadow-lg shadow-blue-500/30"
                        : "border-slate-600 hover:border-slate-400 hover:scale-105"
                    }`}
                    style={{ backgroundColor: opt.color }}
                    title={
                      ({ mesh: t.skinMesh, wireframe: t.skinWireframe, light: t.skinLight, medium: t.skinMedium, dark: t.skinDark, ebony: t.skinEbony } as Record<SkinMode, string>)[opt.key]
                    }
                  >
                    {opt.isWireframe && <Grid3x3 size={14} className="text-white/80" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={() => setIsHelpOpen(true)}
            className="bg-slate-800/80 backdrop-blur-md border border-slate-700 p-2.5 rounded-xl shadow-xl text-slate-400 hover:text-white transition-all flex items-center"
            title={t.help}
          >
            <HelpCircle size={20} />
          </button>

          <LanguageSwitcher />

          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className={`bg-slate-800/80 backdrop-blur-md border border-slate-700 p-2.5 rounded-xl shadow-xl transition-all flex items-center ${
              isSidebarOpen
                ? "text-blue-400"
                : "text-slate-400 hover:text-white"
            }`}
            title={isSidebarOpen ? t.closePanel : t.openPanel}
          >
            {isSidebarOpen ? (
              <PanelRightClose size={20} />
            ) : (
              <PanelRightOpen size={20} />
            )}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".bodylog,.zip"
            onChange={handleFileSelect}
            hidden
          />
        </div>

        <Viewer3D
          gender={gender}
          skinMode={skinMode}
          markers={markers}
          selectedMarkerId={selectedMarkerId}
          onPointClick={handlePointClick}
          onMarkerSelect={setSelectedMarkerId}
          isModalOpen={
            isModalOpen || isHelpOpen || isWelcomeOpen || isLightboxOpen || isImportModalOpen || isPasswordModalOpen || isLeaveWarningOpen
          }
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
            onExport={handleExport}
            onImport={() => fileInputRef.current?.click()}
            onExportPDF={handleExportPDF}
            onRenameMarker={handleRenameMarker}
            onDuplicateMarker={handleDuplicateMarker}
          />
        )}
      </div>

      {/* Entry Modal */}
      <EntryModal
        isOpen={isModalOpen}
        isNewMarker={!!pendingMarkerPos}
        initialDescription={editingEntry?.entry.description}
        initialImage={editingEntry?.entry.imageUrl}
        initialPainLevel={editingEntry?.entry.painLevel}
        initialTags={editingEntry?.entry.tags}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEntry(null);
        }}
        onSave={handleSaveMarker}
      />

      {/* Help Modal */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />

      {/* Welcome Modal */}
      <WelcomeModal isOpen={isWelcomeOpen} onClose={handleCloseWelcome} />

      {/* Import Modal */}
      <ImportModal
        isOpen={isImportModalOpen}
        onClose={handleImportClose}
        onConfirm={handleImportConfirm}
        errors={importErrors}
        manifest={importManifest}
        warnings={importWarnings}
        currentMarkerCount={markers.length}
      />

      {/* Password Modal */}
      <PasswordModal
        isOpen={isPasswordModalOpen}
        mode={passwordMode}
        onConfirm={handlePasswordConfirm}
        onCancel={handlePasswordCancel}
        error={passwordError}
      />

      {/* Leave Warning Modal */}
      <LeaveWarningModal
        isOpen={isLeaveWarningOpen}
        onStay={() => {
          setIsLeaveWarningOpen(false);
          leaveActionRef.current = null;
        }}
        onExport={() => {
          setIsLeaveWarningOpen(false);
          leaveActionRef.current = null;
          handleExport();
        }}
        onLeave={() => {
          setIsLeaveWarningOpen(false);
          leaveActionRef.current?.();
          leaveActionRef.current = null;
        }}
      />
    </div>
  );
};

export default App;
