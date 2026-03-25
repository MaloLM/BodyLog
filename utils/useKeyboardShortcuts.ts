import { useEffect, MutableRefObject } from 'react';

interface KeyboardShortcutConfig {
  markers: { length: number };
  leaveActionRef: MutableRefObject<(() => void) | null>;
  setIsLeaveWarningOpen: (v: boolean) => void;
  handleUndo: () => void;
  handleRedo: () => void;
  isLeaveWarningOpen: boolean;
  isPasswordModalOpen: boolean;
  handlePasswordCancel: () => void;
  isImportModalOpen: boolean;
  handleImportClose: () => void;
  isHelpOpen: boolean;
  setIsHelpOpen: (v: boolean) => void;
  isModalOpen: boolean;
  setIsModalOpen: (v: boolean) => void;
  setEditingEntry: (v: null) => void;
  selectedMarkerId: string | null;
  setSelectedMarkerId: (v: string | null) => void;
}

export function useKeyboardShortcuts(config: KeyboardShortcutConfig) {
  const {
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
  } = config;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Intercept refresh shortcuts to show custom modal
      if (markers.length > 0 && (
        e.key === 'F5' ||
        ((e.metaKey || e.ctrlKey) && e.key === 'r')
      )) {
        e.preventDefault();
        leaveActionRef.current = () => window.location.reload();
        setIsLeaveWarningOpen(true);
        return;
      }

      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        handleRedo();
      } else if (e.key === 'Escape') {
        if (isLeaveWarningOpen) setIsLeaveWarningOpen(false);
        else if (isPasswordModalOpen) handlePasswordCancel();
        else if (isImportModalOpen) handleImportClose();
        else if (isHelpOpen) setIsHelpOpen(false);
        else if (isModalOpen) { setIsModalOpen(false); setEditingEntry(null); }
        else if (selectedMarkerId) setSelectedMarkerId(null);
      } else if (e.key === '?') {
        setIsHelpOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [
    markers.length,
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
  ]);
}
