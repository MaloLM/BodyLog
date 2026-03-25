import { Gender, Marker } from "../types";
import type { SkinMode } from "../types";
import type { Language } from "../i18n";

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
  painLevel?: number;
  tags?: string[];
}

export interface ArchiveMarker {
  id: string;
  title: string;
  position: [number, number, number];
  createdAt: string;
  entries: ArchiveEntry[];
  status?: 'active' | 'monitoring' | 'resolved';
}

export interface ArchiveData {
  gender: Gender;
  markers: ArchiveMarker[];
  skinMode?: SkinMode;
  language?: Language;
}

export type ValidationResult =
  | { valid: true; data: ArchiveData; manifest: ArchiveManifest; warnings: string[] }
  | { valid: false; errors: string[] };

export interface ImportResult {
  markers: Marker[];
  gender: Gender;
  skinMode?: SkinMode;
  language?: Language;
  manifest: ArchiveManifest;
  warnings: string[];
}

export const ENCRYPTED_SENTINEL = "__ENCRYPTED__";
