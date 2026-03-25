import React, { createContext, useContext, useState, useCallback } from 'react';
import { en } from './en';
import { fr } from './fr';

export type Language = 'en' | 'fr';

export interface Translations {
  // App.tsx
  desktopOnly: string;
  desktopOnlyDescription: string;
  male: string;
  female: string;
  help: string;
  closePanel: string;
  openPanel: string;
  copyAppendix: string;

  // Sidebar.tsx
  timeline: string;
  overview: string;
  progressTracking: (title: string) => string;
  documentedPoints: (count: number) => string;
  importSession: string;
  exportSession: string;
  noDataToExport: string;
  pdfReport: string;
  noData: string;
  back: string;
  renamePoint: string;
  recent: string;
  editEntry: string;
  deleteEntryTitle: string;
  deleteEntryMessage: string;
  pain: string;
  clickToEnlarge: string;
  noImage: string;
  addEntry: string;
  sortRecent: string;
  sortAlpha: string;
  sortEntries: string;
  noMatchingPoint: string;
  noPointYet: string;
  tryAnotherSearch: string;
  doubleClickToStart: string;
  duplicatePoint: string;
  deletePoint: string;
  deletePointMessage: (title: string) => string;
  noDescription: string;
  searchPlaceholder: string;

  // EntryModal.tsx
  newTrackingPoint: string;
  editEntryModalTitle: string;
  newEntry: string;
  autoTimestamp: (date: string) => string;
  pointName: string;
  pointNamePlaceholder: string;
  observationNotes: string;
  observationPlaceholder: string;
  painLevel: string;
  optional: string;
  removePainLevel: string;
  activate: string;
  tags: string;
  visualDocumentation: string;
  dragPasteOrClick: string;
  dropImageHere: string;
  uploadImage: string;
  ctrlVToPaste: string;
  deleteImage: string;
  preview: string;
  cancel: string;
  save: string;

  // HelpModal.tsx
  howToUse: string;
  rotation: string;
  rotationDesc: string;
  zoom: string;
  zoomDesc: string;
  placePoint: string;
  placePointDesc: string;
  selectDeselect: string;
  selectDeselectDesc: string;
  understood: string;

  // WelcomeModal.tsx
  welcomeTitle: string;
  welcomeSubtitle: string;
  precisionTracking: string;
  precisionTrackingDesc: string;
  visualHistory: string;
  visualHistoryDesc: string;
  toGetStarted: string;
  toGetStartedDesc: (doubleClick: string) => string;
  doubleClick: string;
  startTracking: string;

  // ImportModal.tsx
  importError: string;
  importSessionTitle: string;
  invalidArchive: string;
  anatomicalPoints: string;
  entries: string;
  images: string;
  exportDate: string;
  existingPointsWarning: (count: number) => string;
  archiveDataWillBeLoaded: string;
  close: string;
  merge: string;
  replace: string;
  importAction: string;

  // PasswordModal.tsx
  protectExport: string;
  protectedArchive: string;
  addPasswordDesc: string;
  archiveProtectedDesc: string;
  passwordOptionalPlaceholder: string;
  passwordPlaceholder: string;
  confirmPassword: string;
  passwordMismatch: string;
  withoutEncryption: string;
  encryptAndExport: string;
  decrypt: string;

  // ConfirmModal.tsx
  confirmDeletion: string;

  // Viewer3D.tsx
  leftClickDrag: string;
  mouseWheel: string;
  doubleClickBody: string;
  solidMode: string;
  wireframeMode: string;
  performance: string;

  // Skin mode
  skinColor: string;
  skinMesh: string;
  skinWireframe: string;
  skinLight: string;
  skinMedium: string;
  skinDark: string;
  skinEbony: string;

  // StatsBar.tsx
  pointCount: (count: number) => string;
  entryCount: (count: number) => string;
  imageCount: (count: number) => string;
  activeCount: (count: number) => string;
  monitoringCount: (count: number) => string;
  resolvedCount: (count: number) => string;
  lastActivity: string;

  // ImageLightbox.tsx
  noImageLightbox: string;
  entryOf: (current: number, total: number) => string;

  // PRESET_TAGS
  presetTags: string[];

  // pdfExport.ts
  pdfTitle: string;
  pdfGeneratedOn: (date: string, gender: string, count: number) => string;
  pdfGenderMale: string;
  pdfGenderFemale: string;
  pdfPoints: (count: number) => string;
  pdfEntries: (count: number) => string;
  pdfStatusActive: string;
  pdfStatusMonitoring: string;
  pdfStatusResolved: string;
  pdfCreatedOn: (date: string, count: number) => string;
  pdfPain: (level: number) => string;
  pdfImageNotEmbeddable: string;
  pdfFilenamePrefix: string;

  // archive.ts
  invalidZipFile: string;

  // archiveValidation.ts
  archiveNoManifest: string;
  archiveNoData: string;
  manifestInvalidJson: string;
  dataInvalidJson: string;
  manifestFormatVersionMissing: string;
  manifestNewerVersion: string;
  manifestFormatUnsupported: (version: number) => string;
  manifestNotBodyLog: string;
  manifestExportedAtInvalid: string;
  manifestFieldPositiveInt: (field: string) => string;
  dataGenderInvalid: string;
  dataMarkersMustBeArray: string;
  dataFieldMissing: (prefix: string, field: string) => string;
  dataFieldEmpty: (prefix: string, field: string) => string;
  dataPositionInvalid: (prefix: string) => string;
  dataEntriesMustBeArray: (prefix: string) => string;
  dataImageFileMustBeStringOrNull: (prefix: string) => string;
  imageMissingInArchive: (filename: string) => string;
  manifestCountMismatch: (field: string, expected: number, actual: number) => string;

  // crypto.ts
  encryptionVersionUnsupported: string;
  wrongPasswordOrCorrupted: string;

  // LeaveWarningModal.tsx
  leaveWarningTitle: string;
  leaveWarningMessage: string;
  leaveWarningExportHint: string;
  leaveWarningExport: string;
  leaveWarningStay: string;
  leaveWarningLeave: string;
}

const translations = { en, fr } as const;

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextValue>({
  language: 'en',
  setLanguage: () => {},
  t: en,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('bodylog_language');
    return saved === 'fr' ? 'fr' : 'en';
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('bodylog_language', lang);
  }, []);

  const t = translations[language];

  return React.createElement(
    LanguageContext.Provider,
    { value: { language, setLanguage, t } },
    children
  );
};

export const useTranslation = () => useContext(LanguageContext);
