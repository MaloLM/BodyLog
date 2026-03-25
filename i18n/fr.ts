import type { Translations } from './index';

export const fr: Translations = {
  // App.tsx
  desktopOnly: 'Bureau uniquement',
  desktopOnlyDescription: 'BodyLog est conçu pour le suivi anatomique 3D de haute précision et n\'est actuellement disponible que sur ordinateur.',
  male: 'Homme',
  female: 'Femme',
  help: 'Aide',
  closePanel: 'Fermer le panneau',
  openPanel: 'Ouvrir le panneau',
  copyAppendix: '(copie)',

  // Sidebar.tsx
  timeline: 'Chronologie',
  overview: 'Vue d\'ensemble',
  progressTracking: (title: string) => `Suivi de progression : ${title}`,
  documentedPoints: (count: number) => `${count} point${count > 1 ? 's' : ''} documenté${count > 1 ? 's' : ''} sur le modèle`,
  importSession: 'Importer une session',
  exportSession: 'Exporter la session',
  noDataToExport: 'Aucune donnée à exporter',
  pdfReport: 'Rapport PDF',
  noData: 'Aucune donnée',
  back: '← Retour',
  renamePoint: 'Renommer le point',
  recent: 'Récent',
  editEntry: 'Modifier l\'entrée',
  deleteEntryTitle: 'Supprimer l\'entrée',
  deleteEntryMessage: 'Êtes-vous sûr de vouloir supprimer cette entrée ? Cette action est irréversible.',
  pain: 'Douleur',
  clickToEnlarge: 'Cliquer pour agrandir',
  noImage: 'Aucune image',
  addEntry: 'Ajouter une entrée',
  sortRecent: 'Plus récent',
  sortAlpha: 'Alphabétique',
  sortEntries: 'Nb d\'entrées',
  noMatchingPoint: 'Aucun point correspondant.',
  noPointYet: 'Aucun point placé pour le moment.',
  tryAnotherSearch: 'Essayez un autre terme de recherche.',
  doubleClickToStart: 'Double-cliquez sur le modèle 3D pour commencer.',
  duplicatePoint: 'Dupliquer le point',
  deletePoint: 'Supprimer le point',
  deletePointMessage: (title: string) => `Êtes-vous sûr de vouloir supprimer "${title}" et toutes ses entrées ? Cette action est irréversible.`,
  noDescription: 'Aucune description',
  searchPlaceholder: 'Rechercher dans les notes...',

  // EntryModal.tsx
  newTrackingPoint: 'Nouveau point de suivi',
  editEntryModalTitle: 'Modifier l\'entrée',
  newEntry: 'Nouvelle entrée',
  autoTimestamp: (date: string) => `Horodatage automatique : ${date}`,
  pointName: 'Nom du point',
  pointNamePlaceholder: 'ex. Inflammation genou gauche',
  observationNotes: 'Notes d\'observation',
  observationPlaceholder: 'Décrivez les observations cliniques, niveaux de douleur ou symptômes visuels...',
  painLevel: 'Niveau de douleur',
  optional: '(optionnel)',
  removePainLevel: 'Retirer le niveau de douleur',
  activate: 'Activer',
  tags: 'Tags',
  visualDocumentation: 'Documentation visuelle',
  dragPasteOrClick: '(glisser, coller ou cliquer)',
  dropImageHere: 'Déposer l\'image ici',
  uploadImage: 'Téléverser une image',
  ctrlVToPaste: 'ou Ctrl+V pour coller',
  deleteImage: 'Supprimer l\'image',
  preview: 'Aperçu',
  cancel: 'Annuler',
  save: 'Sauvegarder',

  // HelpModal.tsx
  howToUse: 'Comment utiliser BodyLog',
  rotation: 'Rotation',
  rotationDesc: 'Cliquez et glissez avec le bouton gauche de la souris pour faire pivoter le modèle.',
  zoom: 'Zoom',
  zoomDesc: 'Utilisez la molette de la souris pour zoomer et dézoomer sur le corps.',
  placePoint: 'Placer un point',
  placePointDesc: 'Double-cliquez n\'importe où sur le corps pour ajouter un nouveau point de suivi.',
  selectDeselect: 'Sélectionner / Désélectionner',
  selectDeselectDesc: 'Cliquez sur un point existant pour voir ses détails ou le désélectionner.',
  understood: 'Compris',

  // WelcomeModal.tsx
  welcomeTitle: 'Bienvenue sur BodyLog',
  welcomeSubtitle: 'Votre outil de suivi anatomique 3D personnel.',
  precisionTracking: 'Suivi de précision',
  precisionTrackingDesc: 'Documentez les changements physiques, blessures ou progrès directement sur un modèle 3D haute fidélité.',
  visualHistory: 'Historique visuel',
  visualHistoryDesc: 'Conservez un historique chronologique des observations pour chaque point d\'intérêt sur le corps.',
  toGetStarted: 'Pour commencer',
  toGetStartedDesc: (doubleClick: string) => `Faites un ${doubleClick} n'importe où sur le modèle 3D pour placer votre premier point.`,
  doubleClick: 'double clic',
  startTracking: 'Commencer le suivi',

  // ImportModal.tsx
  importError: 'Erreur d\'import',
  importSessionTitle: 'Importer une session',
  invalidArchive: 'L\'archive sélectionnée n\'est pas valide :',
  anatomicalPoints: 'Points anatomiques',
  entries: 'Entrées',
  images: 'Images',
  exportDate: 'Date d\'export',
  existingPointsWarning: (count: number) => `Vous avez déjà <strong>${count}</strong> point${count > 1 ? 's' : ''} en session. Choisissez comment importer.`,
  archiveDataWillBeLoaded: 'Les données de l\'archive seront chargées dans la session.',
  close: 'Fermer',
  merge: 'Fusionner',
  replace: 'Remplacer',
  importAction: 'Importer',

  // PasswordModal.tsx
  protectExport: 'Protéger l\'export',
  protectedArchive: 'Archive protégée',
  addPasswordDesc: 'Ajoutez un mot de passe optionnel pour chiffrer vos données.',
  archiveProtectedDesc: 'Cette archive est protégée par un mot de passe.',
  passwordOptionalPlaceholder: 'Mot de passe (optionnel)',
  passwordPlaceholder: 'Mot de passe',
  confirmPassword: 'Confirmer le mot de passe',
  passwordMismatch: 'Les mots de passe ne correspondent pas',
  withoutEncryption: 'Sans chiffrement',
  encryptAndExport: 'Chiffrer et exporter',
  decrypt: 'Déchiffrer',

  // ConfirmModal.tsx
  confirmDeletion: 'Confirmer la suppression',

  // Viewer3D.tsx
  leftClickDrag: 'Clic gauche + glisser : Rotation',
  mouseWheel: 'Molette : Zoom',
  doubleClickBody: 'Double clic sur le corps : Placer un point',
  solidMode: 'Mode solide',
  wireframeMode: 'Mode fil de fer',
  performance: 'Performance',

  // Skin mode
  skinColor: 'Couleur de peau',
  skinMesh: 'Mesh',
  skinWireframe: 'Fil de fer',
  skinLight: 'Claire',
  skinMedium: 'Moyenne',
  skinDark: 'Foncée',
  skinEbony: 'Ébène',

  // StatsBar.tsx
  pointCount: (count: number) => `${count} point${count > 1 ? 's' : ''}`,
  entryCount: (count: number) => `${count} entrée${count > 1 ? 's' : ''}`,
  imageCount: (count: number) => `${count} image${count > 1 ? 's' : ''}`,
  activeCount: (count: number) => `${count} actif${count > 1 ? 's' : ''}`,
  monitoringCount: (count: number) => `${count} en observation`,
  resolvedCount: (count: number) => `${count} résolu${count > 1 ? 's' : ''}`,
  lastActivity: 'Dernière activité :',

  // ImageLightbox.tsx
  noImageLightbox: 'Aucune image',
  entryOf: (current: number, total: number) => `Entrée ${current} / ${total}`,
  reviewAll: 'Voir tout',
  markerOf: (current: number, total: number) => `Point ${current} / ${total}`,

  // PRESET_TAGS
  presetTags: ['blessure', 'inflammation', 'cicatrice', 'post-op', 'douleur chronique', 'suivi', 'autre'],

  // pdfExport.ts
  pdfTitle: 'BodyLog — Rapport de session',
  pdfGeneratedOn: (date: string, gender: string, count: number) =>
    `Généré le ${date} | Modèle : ${gender} | ${count} point${count > 1 ? 's' : ''}`,
  pdfGenderMale: 'Masculin',
  pdfGenderFemale: 'Féminin',
  pdfPoints: (count: number) => `${count} point${count > 1 ? 's' : ''}`,
  pdfEntries: (count: number) => `${count} entrée${count > 1 ? 's' : ''}`,
  pdfStatusActive: 'Actif',
  pdfStatusMonitoring: 'En observation',
  pdfStatusResolved: 'Résolu',
  pdfCreatedOn: (date: string, count: number) =>
    `Créé le ${date} · ${count} entrée${count > 1 ? 's' : ''}`,
  pdfPain: (level: number) => `Douleur : ${level}/10`,
  pdfImageNotEmbeddable: '[Image non intégrable]',
  pdfFilenamePrefix: 'bodylog_rapport',

  // archive.ts
  invalidZipFile: 'Le fichier sélectionné n\'est pas une archive ZIP valide',

  // archiveValidation.ts
  archiveNoManifest: 'L\'archive ne contient pas de fichier manifest.json',
  archiveNoData: 'L\'archive ne contient pas de fichier data.json',
  manifestInvalidJson: 'manifest.json contient du JSON invalide',
  dataInvalidJson: 'data.json contient du JSON invalide',
  manifestFormatVersionMissing: 'manifest.json: formatVersion manquant ou invalide',
  manifestNewerVersion: 'Cette archive a été créée avec une version plus récente de BodyLog. Veuillez mettre à jour l\'application.',
  manifestFormatUnsupported: (version: number) => `manifest.json: formatVersion non supporté (${version})`,
  manifestNotBodyLog: 'manifest.json: cette archive n\'a pas été créée par BodyLog',
  manifestExportedAtInvalid: 'manifest.json: exportedAt manquant ou invalide',
  manifestFieldPositiveInt: (field: string) => `manifest.json: ${field} doit être un entier positif`,
  dataGenderInvalid: 'data.json: gender doit être \'male\' ou \'female\'',
  dataMarkersMustBeArray: 'data.json: markers doit être un tableau',
  dataFieldMissing: (prefix: string, field: string) => `${prefix}.${field} manquant ou invalide`,
  dataFieldEmpty: (prefix: string, field: string) => `${prefix}.${field} manquant ou vide`,
  dataPositionInvalid: (prefix: string) => `${prefix}.position doit être un tableau de 3 nombres`,
  dataEntriesMustBeArray: (prefix: string) => `${prefix}.entries doit être un tableau`,
  dataImageFileMustBeStringOrNull: (prefix: string) => `${prefix}.imageFile doit être une chaîne ou null`,
  imageMissingInArchive: (filename: string) => `Image manquante dans l'archive: ${filename}`,
  manifestCountMismatch: (field: string, expected: number, actual: number) =>
    `Le manifest indique ${expected} ${field} mais l'archive en contient ${actual}`,

  // crypto.ts
  encryptionVersionUnsupported: 'Version de chiffrement non supportée',
  wrongPasswordOrCorrupted: 'Mot de passe incorrect ou données corrompues',

  // LeaveWarningModal.tsx
  leaveWarningTitle: 'Données non sauvegardées',
  leaveWarningMessage: 'Vos données de suivi sont stockées localement et seront perdues si vous quittez ou rafraîchissez la page.',
  leaveWarningExportHint: 'Exportez votre session pour ne pas perdre votre travail.',
  leaveWarningExport: 'Exporter mes données',
  leaveWarningStay: 'Rester sur la page',
  leaveWarningLeave: 'Quitter quand même',
};
