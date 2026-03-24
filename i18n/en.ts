import type { Translations } from './index';

export const en: Translations = {
  // App.tsx
  desktopOnly: 'Desktop only',
  desktopOnlyDescription: 'BodyLog is designed for high-precision 3D anatomical tracking and is currently only available on desktop.',
  male: 'Male',
  female: 'Female',
  help: 'Help',
  closePanel: 'Close panel',
  openPanel: 'Open panel',
  copyAppendix: '(copy)',

  // Sidebar.tsx
  timeline: 'Timeline',
  overview: 'Overview',
  progressTracking: (title: string) => `Progress tracking: ${title}`,
  documentedPoints: (count: number) => `${count} documented point${count > 1 ? 's' : ''} on model`,
  importSession: 'Import session',
  exportSession: 'Export session',
  noDataToExport: 'No data to export',
  pdfReport: 'PDF Report',
  noData: 'No data',
  back: '← Back',
  renamePoint: 'Rename point',
  recent: 'Recent',
  editEntry: 'Edit entry',
  deleteEntryTitle: 'Delete entry',
  deleteEntryMessage: 'Are you sure you want to delete this entry? This action cannot be undone.',
  pain: 'Pain',
  clickToEnlarge: 'Click to enlarge',
  noImage: 'No image',
  addEntry: 'Add entry',
  sortRecent: 'Most recent',
  sortAlpha: 'Alphabetical',
  sortEntries: 'Entry count',
  noMatchingPoint: 'No matching points.',
  noPointYet: 'No points placed yet.',
  tryAnotherSearch: 'Try another search term.',
  doubleClickToStart: 'Double-click on the 3D model to get started.',
  duplicatePoint: 'Duplicate point',
  deletePoint: 'Delete point',
  deletePointMessage: (title: string) => `Are you sure you want to delete "${title}" and all its entries? This action cannot be undone.`,
  noDescription: 'No description',
  searchPlaceholder: 'Search notes...',

  // EntryModal.tsx
  newTrackingPoint: 'New tracking point',
  editEntryModalTitle: 'Edit entry',
  newEntry: 'New entry',
  autoTimestamp: (date: string) => `Auto timestamp: ${date}`,
  pointName: 'Point name',
  pointNamePlaceholder: 'e.g. Left knee inflammation',
  observationNotes: 'Observation notes',
  observationPlaceholder: 'Describe clinical observations, pain levels or visual symptoms...',
  painLevel: 'Pain level',
  optional: '(optional)',
  removePainLevel: 'Remove pain level',
  activate: 'Enable',
  tags: 'Tags',
  visualDocumentation: 'Visual documentation',
  dragPasteOrClick: '(drag, paste or click)',
  dropImageHere: 'Drop image here',
  uploadImage: 'Upload an image',
  ctrlVToPaste: 'or Ctrl+V to paste',
  deleteImage: 'Delete image',
  preview: 'Preview',
  cancel: 'Cancel',
  save: 'Save',

  // HelpModal.tsx
  howToUse: 'How to use BodyLog',
  rotation: 'Rotation',
  rotationDesc: 'Click and drag with the left mouse button to rotate the model.',
  zoom: 'Zoom',
  zoomDesc: 'Use the mouse wheel to zoom in and out on the body.',
  placePoint: 'Place a point',
  placePointDesc: 'Double-click anywhere on the body to add a new tracking point.',
  selectDeselect: 'Select / Deselect',
  selectDeselectDesc: 'Click on an existing point to view its details or deselect it.',
  understood: 'Got it',

  // WelcomeModal.tsx
  welcomeTitle: 'Welcome to BodyLog',
  welcomeSubtitle: 'Your personal 3D anatomical tracking tool.',
  precisionTracking: 'Precision tracking',
  precisionTrackingDesc: 'Document physical changes, injuries or progress directly on a high-fidelity 3D model.',
  visualHistory: 'Visual history',
  visualHistoryDesc: 'Keep a chronological history of observations for each point of interest on the body.',
  toGetStarted: 'To get started',
  toGetStartedDesc: (doubleClick: string) => `${doubleClick} anywhere on the 3D model to place your first point.`,
  doubleClick: 'Double-click',
  startTracking: 'Start tracking',

  // ImportModal.tsx
  importError: 'Import error',
  importSessionTitle: 'Import session',
  invalidArchive: 'The selected archive is not valid:',
  anatomicalPoints: 'Anatomical points',
  entries: 'Entries',
  images: 'Images',
  exportDate: 'Export date',
  existingPointsWarning: (count: number) => `You already have <strong>${count}</strong> point${count > 1 ? 's' : ''} in session. Choose how to import.`,
  archiveDataWillBeLoaded: 'Archive data will be loaded into the session.',
  close: 'Close',
  merge: 'Merge',
  replace: 'Replace',
  importAction: 'Import',

  // PasswordModal.tsx
  protectExport: 'Protect export',
  protectedArchive: 'Protected archive',
  addPasswordDesc: 'Add an optional password to encrypt your data.',
  archiveProtectedDesc: 'This archive is protected by a password.',
  passwordOptionalPlaceholder: 'Password (optional)',
  passwordPlaceholder: 'Password',
  confirmPassword: 'Confirm password',
  passwordMismatch: 'Passwords do not match',
  withoutEncryption: 'Without encryption',
  encryptAndExport: 'Encrypt and export',
  decrypt: 'Decrypt',

  // ConfirmModal.tsx
  confirmDeletion: 'Confirm deletion',

  // Viewer3D.tsx
  leftClickDrag: 'Left click + drag: Rotate',
  mouseWheel: 'Scroll wheel: Zoom',
  doubleClickBody: 'Double click on body: Place a point',
  solidMode: 'Solid mode',
  wireframeMode: 'Wireframe mode',
  performance: 'Performance',

  // Skin mode
  skinColor: 'Skin color',
  skinMesh: 'Mesh',
  skinWireframe: 'Wireframe',
  skinLight: 'Light',
  skinMedium: 'Medium',
  skinDark: 'Dark',
  skinEbony: 'Ebony',

  // StatsBar.tsx
  pointCount: (count: number) => `${count} point${count > 1 ? 's' : ''}`,
  entryCount: (count: number) => `${count} ${count > 1 ? 'entries' : 'entry'}`,
  imageCount: (count: number) => `${count} image${count > 1 ? 's' : ''}`,
  activeCount: (count: number) => `${count} active`,
  monitoringCount: (count: number) => `${count} monitoring`,
  resolvedCount: (count: number) => `${count} resolved`,
  lastActivity: 'Last activity:',

  // ImageLightbox.tsx
  noImageLightbox: 'No image',
  entryOf: (current: number, total: number) => `Entry ${current} / ${total}`,

  // PRESET_TAGS
  presetTags: ['injury', 'inflammation', 'scar', 'post-op', 'chronic pain', 'follow-up', 'other'],

  // pdfExport.ts
  pdfTitle: 'BodyLog — Session Report',
  pdfGeneratedOn: (date: string, gender: string, count: number) =>
    `Generated on ${date} | Model: ${gender} | ${count} point${count > 1 ? 's' : ''}`,
  pdfGenderMale: 'Male',
  pdfGenderFemale: 'Female',
  pdfPoints: (count: number) => `${count} point${count > 1 ? 's' : ''}`,
  pdfEntries: (count: number) => `${count} ${count > 1 ? 'entries' : 'entry'}`,
  pdfStatusActive: 'Active',
  pdfStatusMonitoring: 'Monitoring',
  pdfStatusResolved: 'Resolved',
  pdfCreatedOn: (date: string, count: number) =>
    `Created on ${date} · ${count} ${count > 1 ? 'entries' : 'entry'}`,
  pdfPain: (level: number) => `Pain: ${level}/10`,
  pdfImageNotEmbeddable: '[Image not embeddable]',
  pdfFilenamePrefix: 'bodylog_report',

  // archive.ts
  invalidZipFile: 'The selected file is not a valid ZIP archive',

  // archiveValidation.ts
  archiveNoManifest: 'Archive does not contain a manifest.json file',
  archiveNoData: 'Archive does not contain a data.json file',
  manifestInvalidJson: 'manifest.json contains invalid JSON',
  dataInvalidJson: 'data.json contains invalid JSON',
  manifestFormatVersionMissing: 'manifest.json: formatVersion missing or invalid',
  manifestNewerVersion: 'This archive was created with a newer version of BodyLog. Please update the application.',
  manifestFormatUnsupported: (version: number) => `manifest.json: unsupported formatVersion (${version})`,
  manifestNotBodyLog: 'manifest.json: this archive was not created by BodyLog',
  manifestExportedAtInvalid: 'manifest.json: exportedAt missing or invalid',
  manifestFieldPositiveInt: (field: string) => `manifest.json: ${field} must be a positive integer`,
  dataGenderInvalid: "data.json: gender must be 'male' or 'female'",
  dataMarkersMustBeArray: 'data.json: markers must be an array',
  dataFieldMissing: (prefix: string, field: string) => `${prefix}.${field} missing or invalid`,
  dataFieldEmpty: (prefix: string, field: string) => `${prefix}.${field} missing or empty`,
  dataPositionInvalid: (prefix: string) => `${prefix}.position must be an array of 3 numbers`,
  dataEntriesMustBeArray: (prefix: string) => `${prefix}.entries must be an array`,
  dataImageFileMustBeStringOrNull: (prefix: string) => `${prefix}.imageFile must be a string or null`,
  imageMissingInArchive: (filename: string) => `Missing image in archive: ${filename}`,
  manifestCountMismatch: (field: string, expected: number, actual: number) =>
    `Manifest indicates ${expected} ${field} but archive contains ${actual}`,

  // crypto.ts
  encryptionVersionUnsupported: 'Unsupported encryption version',
  wrongPasswordOrCorrupted: 'Incorrect password or corrupted data',
};
