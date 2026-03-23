import { Gender, Marker } from "../types";

export interface ArchiveManifest {
  formatVersion: number;
  appName: string;
  exportedAt: string;
  markerCount: number;
  entryCount: number;
  imageCount: number;
}

export interface ArchiveEntry {
  id: string;
  date: string;
  description: string;
  imageFile: string | null;
}

export interface ArchiveMarker {
  id: string;
  title: string;
  position: [number, number, number];
  createdAt: string;
  entries: ArchiveEntry[];
}

export interface ArchiveData {
  gender: Gender;
  markers: ArchiveMarker[];
}

export type ValidationResult =
  | { valid: true; data: ArchiveData; manifest: ArchiveManifest; warnings: string[] }
  | { valid: false; errors: string[] };

export interface ImportResult {
  markers: Marker[];
  gender: Gender;
  manifest: ArchiveManifest;
  warnings: string[];
}
