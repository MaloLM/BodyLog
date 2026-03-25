
export type Gender = 'male' | 'female';

export type MarkerStatus = 'active' | 'monitoring' | 'resolved';

export const PRESET_TAGS = [
  'blessure',
  'inflammation',
  'cicatrice',
  'post-op',
  'douleur chronique',
  'suivi',
  'autre',
] as const;

export interface Entry {
  id: string;
  date: string;
  description: string;
  imageUrl?: string;
  painLevel?: number;
  tags?: string[];
}

export interface Marker {
  id: string;
  title: string;
  position: [number, number, number];
  entries: Entry[];
  createdAt: string;
  status?: MarkerStatus;
}

export interface AppState {
  markers: Marker[];
  selectedMarkerId: string | null;
  gender: Gender;
  isSidebarOpen: boolean;
}

export type SkinMode = 'mesh' | 'wireframe' | 'light' | 'medium' | 'dark' | 'ebony';

export const SKIN_OPTIONS: { key: SkinMode; color: string; isWireframe?: boolean }[] = [
  { key: 'wireframe', color: '#64748b', isWireframe: true },
  { key: 'mesh', color: '#334155' },
  { key: 'light', color: '#FFDBAC' },
  { key: 'medium', color: '#C68642' },
  { key: 'dark', color: '#8D5524' },
  { key: 'ebony', color: '#4A2912' },
];

export const SKIN_MATERIALS: Record<SkinMode, { color: string; opacity: number; roughness: number; metalness: number; wireframe: boolean }> = {
  mesh:      { color: '#334155', opacity: 0.8, roughness: 0.4, metalness: 0.3, wireframe: false },
  wireframe: { color: '#64748b', opacity: 0.3, roughness: 0.4, metalness: 0.3, wireframe: true },
  light:     { color: '#e6be8b', opacity: 1, roughness: 0.7, metalness: 0.1, wireframe: false },
  medium:    { color: '#cd9253', opacity: 1, roughness: 0.7, metalness: 0.1, wireframe: false },
  dark:      { color: '#8D5524', opacity: 1, roughness: 0.7, metalness: 0.1, wireframe: false },
  ebony:     { color: '#4A2912', opacity: 1, roughness: 0.7, metalness: 0.1, wireframe: false },
};
