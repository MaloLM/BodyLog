import JSZip from "jszip";
import { saveAs } from "file-saver";
import type { Marker, Gender } from "../types";
import type {
  ArchiveManifest,
  ArchiveData,
  ArchiveEntry,
  ArchiveMarker,
  ImportResult,
} from "./archiveTypes";
import { ENCRYPTED_SENTINEL } from "./archiveTypes";
import { validateArchive } from "./archiveValidation";
import { encryptBlob, isEncrypted, decryptBlob } from "./crypto";
import type { Translations } from "../i18n";

// --- Helpers ---

function dataUrlToBlob(dataUrl: string): { data: Uint8Array; ext: string } {
  const [header, base64] = dataUrl.split(",");
  const mime = header.match(/:(.*?);/)?.[1] || "image/png";
  const ext = mime.split("/")[1] === "jpeg" ? "jpg" : mime.split("/")[1];
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return { data: bytes, ext };
}

function extToMime(ext: string): string {
  const map: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    svg: "image/svg+xml",
  };
  return map[ext.toLowerCase()] || "image/png";
}

// --- Export ---

export async function exportArchive(
  markers: Marker[],
  gender: Gender,
  password?: string | null
): Promise<void> {
  const zip = new JSZip();
  const imageFolder = zip.folder("images")!;

  let imageCount = 0;
  const archiveMarkers: ArchiveMarker[] = markers.map((marker) => ({
    id: marker.id,
    title: marker.title,
    position: marker.position,
    createdAt: marker.createdAt,
    ...(marker.status ? { status: marker.status } : {}),
    entries: marker.entries.map((entry): ArchiveEntry => {
      if (entry.imageUrl) {
        const { data, ext } = dataUrlToBlob(entry.imageUrl);
        const filename = `${entry.id}.${ext}`;
        imageFolder.file(filename, data);
        imageCount++;
        return {
          id: entry.id,
          date: entry.date,
          description: entry.description,
          imageFile: `images/${filename}`,
          ...(entry.painLevel != null ? { painLevel: entry.painLevel } : {}),
          ...(entry.tags ? { tags: entry.tags } : {}),
        };
      }
      return {
        id: entry.id,
        date: entry.date,
        description: entry.description,
        imageFile: null,
        ...(entry.painLevel != null ? { painLevel: entry.painLevel } : {}),
        ...(entry.tags ? { tags: entry.tags } : {}),
      };
    }),
  }));

  const entryCount = archiveMarkers.reduce(
    (sum, m) => sum + m.entries.length,
    0
  );

  const manifest: ArchiveManifest = {
    formatVersion: 1,
    appName: "BodyLog",
    exportedAt: new Date().toISOString(),
    markerCount: archiveMarkers.length,
    entryCount,
    imageCount,
  };

  const data: ArchiveData = {
    gender,
    markers: archiveMarkers,
  };

  zip.file("manifest.json", JSON.stringify(manifest, null, 2));
  zip.file("data.json", JSON.stringify(data, null, 2));

  let blob = await zip.generateAsync({ type: "blob", streamFiles: true });
  if (password) {
    blob = await encryptBlob(blob, password);
  }
  const date = new Date().toISOString().split("T")[0];
  saveAs(blob, `bodylog_${date}.bodylog`);
}

// --- Import ---

export async function importArchive(
  file: File,
  password?: string,
  t?: Translations
): Promise<
  | { success: true; result: ImportResult }
  | { success: false; errors: string[] }
> {
  let zip: JSZip;
  try {
    let buffer = await file.arrayBuffer();

    if (isEncrypted(buffer)) {
      if (!password) {
        return { success: false, errors: [ENCRYPTED_SENTINEL] };
      }
      try {
        buffer = await decryptBlob(buffer, password);
      } catch (err) {
        return { success: false, errors: [(err as Error).message] };
      }
    }

    zip = await JSZip.loadAsync(buffer);
  } catch {
    return {
      success: false,
      errors: [t?.invalidZipFile || "The selected file is not a valid ZIP archive"],
    };
  }

  const validation = await validateArchive(zip, t);
  if (validation.valid === false) {
    return { success: false, errors: validation.errors };
  }

  const { data, manifest, warnings } = validation;

  // Reconstruct Marker[] with base64 images
  const markers: Marker[] = await Promise.all(
    data.markers.map(async (archiveMarker) => {
      const entries = await Promise.all(
        archiveMarker.entries.map(async (archiveEntry) => {
          let imageUrl: string | undefined;

          if (archiveEntry.imageFile) {
            const imageFile = zip.file(archiveEntry.imageFile);
            if (imageFile) {
              const imageData = await imageFile.async("uint8array");
              const ext = archiveEntry.imageFile.split(".").pop() || "png";
              const mime = extToMime(ext);
              const base64 = uint8ArrayToBase64(imageData);
              imageUrl = `data:${mime};base64,${base64}`;
            }
          }

          return {
            id: archiveEntry.id,
            date: archiveEntry.date,
            description: archiveEntry.description,
            ...(imageUrl ? { imageUrl } : {}),
            ...(archiveEntry.painLevel != null ? { painLevel: archiveEntry.painLevel } : {}),
            ...(archiveEntry.tags ? { tags: archiveEntry.tags } : {}),
          };
        })
      );

      return {
        id: archiveMarker.id,
        title: archiveMarker.title,
        position: archiveMarker.position,
        createdAt: archiveMarker.createdAt,
        ...(archiveMarker.status ? { status: archiveMarker.status } : {}),
        entries,
      };
    })
  );

  return {
    success: true,
    result: {
      markers,
      gender: data.gender,
      manifest,
      warnings,
    },
  };
}

function uint8ArrayToBase64(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
