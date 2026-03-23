
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
