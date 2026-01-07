
export type Gender = 'male' | 'female';

export interface Entry {
  id: string;
  date: string;
  description: string;
  imageUrl?: string;
}

export interface Marker {
  id: string;
  title: string;
  position: [number, number, number];
  entries: Entry[];
  createdAt: string;
}

export interface AppState {
  markers: Marker[];
  selectedMarkerId: string | null;
  gender: Gender;
  isSidebarOpen: boolean;
}
