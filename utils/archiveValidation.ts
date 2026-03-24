import JSZip from "jszip";
import type { ArchiveManifest, ArchiveData, ValidationResult } from "./archiveTypes";
import type { Translations } from "../i18n";

export async function validateArchive(zip: JSZip, t?: Translations): Promise<ValidationResult> {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 1. Check required files exist
  const manifestFile = zip.file("manifest.json");
  const dataFile = zip.file("data.json");

  if (!manifestFile) {
    errors.push(t?.archiveNoManifest || "Archive does not contain a manifest.json file");
  }
  if (!dataFile) {
    errors.push(t?.archiveNoData || "Archive does not contain a data.json file");
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
    return { valid: false, errors: [t?.manifestInvalidJson || "manifest.json contains invalid JSON"] };
  }

  try {
    data = JSON.parse(await dataFile!.async("text"));
  } catch {
    return { valid: false, errors: [t?.dataInvalidJson || "data.json contains invalid JSON"] };
  }

  // 3. Validate manifest
  if (typeof manifest.formatVersion !== "number") {
    errors.push(t?.manifestFormatVersionMissing || "manifest.json: formatVersion missing or invalid");
  } else if (manifest.formatVersion > 1) {
    errors.push(t?.manifestNewerVersion || "This archive was created with a newer version of BodyLog.");
  } else if (manifest.formatVersion !== 1) {
    errors.push(t?.manifestFormatUnsupported(manifest.formatVersion) || `manifest.json: unsupported formatVersion (${manifest.formatVersion})`);
  }

  if (manifest.appName !== "BodyLog") {
    errors.push(t?.manifestNotBodyLog || "manifest.json: this archive was not created by BodyLog");
  }

  if (typeof manifest.exportedAt !== "string" || isNaN(Date.parse(manifest.exportedAt))) {
    errors.push(t?.manifestExportedAtInvalid || "manifest.json: exportedAt missing or invalid");
  }

  for (const field of ["markerCount", "entryCount", "imageCount"] as const) {
    if (typeof manifest[field] !== "number" || !Number.isInteger(manifest[field]) || manifest[field] < 0) {
      errors.push(t?.manifestFieldPositiveInt(field) || `manifest.json: ${field} must be a positive integer`);
    }
  }

  if (errors.length > 0) {
    return { valid: false, errors };
  }

  // 4. Validate data structure
  if (data.gender !== "male" && data.gender !== "female") {
    errors.push(t?.dataGenderInvalid || "data.json: gender must be 'male' or 'female'");
  }

  if (!Array.isArray(data.markers)) {
    errors.push(t?.dataMarkersMustBeArray || "data.json: markers must be an array");
    return { valid: false, errors };
  }

  let totalEntries = 0;
  let totalImages = 0;

  for (let i = 0; i < data.markers.length; i++) {
    const marker = data.markers[i];
    const prefix = `data.json: markers[${i}]`;

    if (typeof marker.id !== "string" || !marker.id) {
      errors.push(t?.dataFieldMissing(prefix, "id") || `${prefix}.id missing or invalid`);
    }
    if (typeof marker.title !== "string" || !marker.title.trim()) {
      errors.push(t?.dataFieldEmpty(prefix, "title") || `${prefix}.title missing or empty`);
    }
    if (
      !Array.isArray(marker.position) ||
      marker.position.length !== 3 ||
      !marker.position.every((n) => typeof n === "number" && isFinite(n))
    ) {
      errors.push(t?.dataPositionInvalid(prefix) || `${prefix}.position must be an array of 3 numbers`);
    }
    if (typeof marker.createdAt !== "string") {
      errors.push(t?.dataFieldMissing(prefix, "createdAt") || `${prefix}.createdAt missing`);
    }
    if (!Array.isArray(marker.entries)) {
      errors.push(t?.dataEntriesMustBeArray(prefix) || `${prefix}.entries must be an array`);
      continue;
    }

    for (let j = 0; j < marker.entries.length; j++) {
      const entry = marker.entries[j];
      const ePrefix = `${prefix}.entries[${j}]`;

      if (typeof entry.id !== "string" || !entry.id) {
        errors.push(t?.dataFieldMissing(ePrefix, "id") || `${ePrefix}.id missing or invalid`);
      }
      if (typeof entry.date !== "string") {
        errors.push(t?.dataFieldMissing(ePrefix, "date") || `${ePrefix}.date missing`);
      }
      if (typeof entry.description !== "string") {
        errors.push(t?.dataFieldMissing(ePrefix, "description") || `${ePrefix}.description missing`);
      }
      if (entry.imageFile !== null && typeof entry.imageFile !== "string") {
        errors.push(t?.dataImageFileMustBeStringOrNull(ePrefix) || `${ePrefix}.imageFile must be a string or null`);
      }

      // 5. Check image file exists in ZIP
      if (typeof entry.imageFile === "string") {
        totalImages++;
        if (!zip.file(entry.imageFile)) {
          warnings.push(t?.imageMissingInArchive(entry.imageFile) || `Missing image in archive: ${entry.imageFile}`);
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
    warnings.push(t?.manifestCountMismatch("markers", manifest.markerCount, data.markers.length) || `Manifest indicates ${manifest.markerCount} markers but archive contains ${data.markers.length}`);
  }
  if (manifest.entryCount !== totalEntries) {
    warnings.push(t?.manifestCountMismatch("entries", manifest.entryCount, totalEntries) || `Manifest indicates ${manifest.entryCount} entries but archive contains ${totalEntries}`);
  }
  if (manifest.imageCount !== totalImages) {
    warnings.push(t?.manifestCountMismatch("images", manifest.imageCount, totalImages) || `Manifest indicates ${manifest.imageCount} images but archive contains ${totalImages}`);
  }

  return { valid: true, data, manifest, warnings };
}
