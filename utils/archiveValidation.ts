import JSZip from "jszip";
import type { ArchiveManifest, ArchiveData, ValidationResult } from "./archiveTypes";

export async function validateArchive(zip: JSZip): Promise<ValidationResult> {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 1. Check required files exist
  const manifestFile = zip.file("manifest.json");
  const dataFile = zip.file("data.json");

  if (!manifestFile) {
    errors.push("L'archive ne contient pas de fichier manifest.json");
  }
  if (!dataFile) {
    errors.push("L'archive ne contient pas de fichier data.json");
  }
  if (errors.length > 0) {
    return { valid: false, errors };
  }

  // 2. Parse JSON files
  let manifest: ArchiveManifest;
  let data: ArchiveData;

  try {
    manifest = JSON.parse(await manifestFile!.async("text"));
  } catch {
    return { valid: false, errors: ["manifest.json contient du JSON invalide"] };
  }

  try {
    data = JSON.parse(await dataFile!.async("text"));
  } catch {
    return { valid: false, errors: ["data.json contient du JSON invalide"] };
  }

  // 3. Validate manifest
  if (typeof manifest.formatVersion !== "number") {
    errors.push("manifest.json: formatVersion manquant ou invalide");
  } else if (manifest.formatVersion > 1) {
    errors.push(
      "Cette archive a été créée avec une version plus récente de BodyLog. Veuillez mettre à jour l'application."
    );
  } else if (manifest.formatVersion !== 1) {
    errors.push(`manifest.json: formatVersion non supporté (${manifest.formatVersion})`);
  }

  if (manifest.appName !== "BodyLog") {
    errors.push("manifest.json: cette archive n'a pas été créée par BodyLog");
  }

  if (typeof manifest.exportedAt !== "string" || isNaN(Date.parse(manifest.exportedAt))) {
    errors.push("manifest.json: exportedAt manquant ou invalide");
  }

  for (const field of ["markerCount", "entryCount", "imageCount"] as const) {
    if (typeof manifest[field] !== "number" || !Number.isInteger(manifest[field]) || manifest[field] < 0) {
      errors.push(`manifest.json: ${field} doit être un entier positif`);
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  // 4. Validate data structure
  if (data.gender !== "male" && data.gender !== "female") {
    errors.push("data.json: gender doit être 'male' ou 'female'");
  }

  if (!Array.isArray(data.markers)) {
    errors.push("data.json: markers doit être un tableau");
    return { valid: false, errors };
  }

  let totalEntries = 0;
  let totalImages = 0;

  for (let i = 0; i < data.markers.length; i++) {
    const marker = data.markers[i];
    const prefix = `data.json: markers[${i}]`;

    if (typeof marker.id !== "string" || !marker.id) {
      errors.push(`${prefix}.id manquant ou invalide`);
    }
    if (typeof marker.title !== "string" || !marker.title.trim()) {
      errors.push(`${prefix}.title manquant ou vide`);
    }
    if (
      !Array.isArray(marker.position) ||
      marker.position.length !== 3 ||
      !marker.position.every((n) => typeof n === "number" && isFinite(n))
    ) {
      errors.push(`${prefix}.position doit être un tableau de 3 nombres`);
    }
    if (typeof marker.createdAt !== "string") {
      errors.push(`${prefix}.createdAt manquant`);
    }
    if (!Array.isArray(marker.entries)) {
      errors.push(`${prefix}.entries doit être un tableau`);
      continue;
    }

    for (let j = 0; j < marker.entries.length; j++) {
      const entry = marker.entries[j];
      const ePrefix = `${prefix}.entries[${j}]`;

      if (typeof entry.id !== "string" || !entry.id) {
        errors.push(`${ePrefix}.id manquant ou invalide`);
      }
      if (typeof entry.date !== "string") {
        errors.push(`${ePrefix}.date manquant`);
      }
      if (typeof entry.description !== "string") {
        errors.push(`${ePrefix}.description manquant`);
      }
      if (entry.imageFile !== null && typeof entry.imageFile !== "string") {
        errors.push(`${ePrefix}.imageFile doit être une chaîne ou null`);
      }

      // 5. Check image file exists in ZIP
      if (typeof entry.imageFile === "string") {
        totalImages++;
        if (!zip.file(entry.imageFile)) {
          warnings.push(`Image manquante dans l'archive: ${entry.imageFile}`);
        }
      }

      totalEntries++;
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  // 6. Cross-check counts (warnings only)
  if (manifest.markerCount !== data.markers.length) {
    warnings.push(
      `Le manifest indique ${manifest.markerCount} markers mais l'archive en contient ${data.markers.length}`
    );
  }
  if (manifest.entryCount !== totalEntries) {
    warnings.push(
      `Le manifest indique ${manifest.entryCount} entries mais l'archive en contient ${totalEntries}`
    );
  }
  if (manifest.imageCount !== totalImages) {
    warnings.push(
      `Le manifest indique ${manifest.imageCount} images mais l'archive en contient ${totalImages}`
    );
  }

  return { valid: true, data, manifest, warnings };
}
