// Password-based encryption for .bodylog archives
// Uses Web Crypto API: PBKDF2-SHA256 key derivation + AES-256-GCM

const MAGIC = "BODYLOG_ENC";
const FORMAT_VERSION = 1;
const SALT_LENGTH = 16;
const IV_LENGTH = 12;
const PBKDF2_ITERATIONS = 600_000;

const encoder = new TextEncoder();
const MAGIC_BYTES = encoder.encode(MAGIC);

function deriveKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  return crypto.subtle
    .importKey("raw", encoder.encode(password), "PBKDF2", false, ["deriveKey"])
    .then((keyMaterial) =>
      crypto.subtle.deriveKey(
        { name: "PBKDF2", salt, iterations: PBKDF2_ITERATIONS, hash: "SHA-256" },
        keyMaterial,
        { name: "AES-GCM", length: 256 },
        false,
        ["encrypt", "decrypt"]
      )
    );
}

export async function encryptBlob(
  blob: Blob,
  password: string
): Promise<Blob> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const key = await deriveKey(password, salt);

  const plaintext = await blob.arrayBuffer();
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    plaintext
  );

  // Envelope: MAGIC (11) + VERSION (1) + SALT (16) + IV (12) + ciphertext
  const header = new Uint8Array(MAGIC_BYTES.length + 1 + SALT_LENGTH + IV_LENGTH);
  header.set(MAGIC_BYTES, 0);
  header[MAGIC_BYTES.length] = FORMAT_VERSION;
  header.set(salt, MAGIC_BYTES.length + 1);
  header.set(iv, MAGIC_BYTES.length + 1 + SALT_LENGTH);

  return new Blob([header, ciphertext]);
}

export function isEncrypted(buffer: ArrayBuffer): boolean {
  if (buffer.byteLength < MAGIC_BYTES.length) return false;
  const head = new Uint8Array(buffer, 0, MAGIC_BYTES.length);
  return head.every((b, i) => b === MAGIC_BYTES[i]);
}

export async function decryptBlob(
  buffer: ArrayBuffer,
  password: string
): Promise<ArrayBuffer> {
  const headerLen = MAGIC_BYTES.length + 1 + SALT_LENGTH + IV_LENGTH;
  const bytes = new Uint8Array(buffer);

  const version = bytes[MAGIC_BYTES.length];
  if (version !== FORMAT_VERSION) {
    throw new Error("Version de chiffrement non supportée");
  }

  const salt = bytes.slice(MAGIC_BYTES.length + 1, MAGIC_BYTES.length + 1 + SALT_LENGTH);
  const iv = bytes.slice(MAGIC_BYTES.length + 1 + SALT_LENGTH, headerLen);
  const ciphertext = bytes.slice(headerLen);

  const key = await deriveKey(password, salt);

  try {
    return await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ciphertext);
  } catch {
    throw new Error("Mot de passe incorrect ou données corrompues");
  }
}
