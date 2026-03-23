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
import { validateArchive } from "./archiveValidation";

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
  gender: Gender
): Promise<void> {
  const zip = new JSZip();
  const imageFolder = zip.folder("images")!;

  let imageCount = 0;
  const archiveMarkers: ArchiveMarker[] = markers.map((marker) => ({
    id: marker.id,
    title: marker.title,
    position: marker.position,
    createdAt: marker.createdAt,
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
        };
      }
      return {
        id: entry.id,
        date: entry.date,
        description: entry.description,
        imageFile: null,
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

  const blob = await zip.generateAsync({ type: "blob", streamFiles: true });
  const date = new Date().toISOString().split("T")[0];
  saveAs(blob, `bodylog_${date}.bodylog`);
}

// --- Import ---

export async function importArchive(
  file: File
): Promise<
  | { success: true; result: ImportResult }
  | { success: false; errors: string[] }
> {
  let zip: JSZip;
  try {
    const buffer = await file.arrayBuffer();
    zip = await JSZip.loadAsync(buffer);
  } catch {
    return {
      success: false,
      errors: ["Le fichier sélectionné n'est pas une archive ZIP valide"],
    };
  }

  const validation = await validateArchive(zip);
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
          };
        })
      );

      return {
        id: archiveMarker.id,
        title: archiveMarker.title,
        position: archiveMarker.position,
        createdAt: archiveMarker.createdAt,
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
