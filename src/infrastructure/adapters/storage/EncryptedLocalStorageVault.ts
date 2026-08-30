import { ISecureVault } from "../../../application/ports/ISecureVault";
import { logger } from "../../../shared/utils/logger";

/**
 * AES-GCM 256-bit Client-Side Encrypted Storage Vault Adapter.
 * Implements the ISecureVault port.
 *
 * Security model (honest scope):
 * - The AES key is derived with PBKDF2-SHA256 (100k iterations) from a random
 *   32-byte secret generated once per install and kept OUT of the application
 *   bundle (unlike a compile-time constant, it cannot be extracted from
 *   published JS).
 * - Each item is sealed with a fresh random 96-bit IV; payloads are versioned
 *   ("v2:") so the format can evolve safely.
 * - This is DEFENSE IN DEPTH against casual local-storage inspection and file
 *   scraping. It is NOT protection against active XSS: an attacker running JS
 *   in the page can reach anything the app can. The real XSS mitigations are
 *   the CSP and DOMPurify sanitization layers.
 *
 * Failure policy: encryption/decryption failures NEVER degrade to plaintext.
 * setItem throws; getItem logs and returns null. Tampered or unreadable data
 * is rejected (preserving GCM integrity guarantees).
 */

const KEY_MATERIAL_STORAGE_KEY = "celaest:vault:key-material";
const PAYLOAD_VERSION_PREFIX = "v2:";
const IV_BYTE_LENGTH = 12;
const KEY_MATERIAL_BYTE_LENGTH = 32;
const BASE64_CHUNK_SIZE = 0x8000;
const PBKDF2_ITERATIONS = 100_000;

function toBase64(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i += BASE64_CHUNK_SIZE) {
    binary += String.fromCharCode(...bytes.subarray(i, i + BASE64_CHUNK_SIZE));
  }
  return btoa(binary);
}

function fromBase64(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export class EncryptedLocalStorageVault implements ISecureVault {
  /** Derived CryptoKey cache — avoids repeating the expensive PBKDF2 stretch. */
  private static encryptionKeyPromise: Promise<CryptoKey> | null = null;

  private static async loadOrCreateKeyMaterial(): Promise<Uint8Array> {
    const existing = localStorage.getItem(KEY_MATERIAL_STORAGE_KEY);
    if (existing) {
      return fromBase64(existing);
    }

    const material = window.crypto.getRandomValues(new Uint8Array(KEY_MATERIAL_BYTE_LENGTH));
    localStorage.setItem(KEY_MATERIAL_STORAGE_KEY, toBase64(material));
    return material;
  }

  private static async getEncryptionKey(): Promise<CryptoKey> {
    if (!this.encryptionKeyPromise) {
      this.encryptionKeyPromise = (async () => {
        const encoder = new TextEncoder();
        const rawBytes = await this.loadOrCreateKeyMaterial();
        const keyMaterial = await window.crypto.subtle.importKey(
          "raw",
          rawBytes as unknown as BufferSource,
          { name: "PBKDF2" },
          false,
          ["deriveKey"],
        );

        return window.crypto.subtle.deriveKey(
          {
            name: "PBKDF2",
            // Static application salt is fine: entropy comes from the random key material.
            salt: encoder.encode("celaest-vault-salt"),
            iterations: PBKDF2_ITERATIONS,
            hash: "SHA-256",
          },
          keyMaterial,
          { name: "AES-GCM", length: 256 },
          false,
          ["encrypt", "decrypt"],
        );
      })();
    }
    return this.encryptionKeyPromise;
  }

  public static async setItem<T>(key: string, value: T): Promise<void> {
    try {
      const cryptoKey = await this.getEncryptionKey();
      const iv = window.crypto.getRandomValues(new Uint8Array(IV_BYTE_LENGTH));
      const encodedValue = new TextEncoder().encode(JSON.stringify(value));

      const encryptedContent = await window.crypto.subtle.encrypt(
        { name: "AES-GCM", iv },
        cryptoKey,
        encodedValue,
      );

      const combined = new Uint8Array(iv.length + encryptedContent.byteLength);
      combined.set(iv);
      combined.set(new Uint8Array(encryptedContent), iv.length);

      localStorage.setItem(key, `${PAYLOAD_VERSION_PREFIX}${toBase64(combined)}`);
    } catch (error) {
      logger.error(`Vault encryption failed for key [${key}]:`, error);
      throw error instanceof Error ? error : new Error(`Vault encryption failed for key [${key}]`);
    }
  }

  public static async getItem<T>(key: string): Promise<T | null> {
    const payload = localStorage.getItem(key);
    if (!payload) return null;

    if (!payload.startsWith(PAYLOAD_VERSION_PREFIX)) {
      // Reject unknown/plaintext formats instead of trusting them (integrity).
      logger.warn(`Vault item [${key}] has an unsupported format and was ignored.`);
      return null;
    }

    try {
      const cryptoKey = await this.getEncryptionKey();
      const combined = fromBase64(payload.slice(PAYLOAD_VERSION_PREFIX.length));

      const iv = combined.slice(0, IV_BYTE_LENGTH);
      const ciphertext = combined.slice(IV_BYTE_LENGTH);

      const decryptedContent = await window.crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        cryptoKey,
        ciphertext,
      );

      return JSON.parse(new TextDecoder().decode(decryptedContent)) as T;
    } catch (error) {
      logger.error(`Vault decryption failed for key [${key}]. Item rejected:`, error);
      return null;
    }
  }

  public static removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  public async setItem<T>(key: string, value: T): Promise<void> {
    return EncryptedLocalStorageVault.setItem(key, value);
  }

  public async getItem<T>(key: string): Promise<T | null> {
    return EncryptedLocalStorageVault.getItem<T>(key);
  }

  public removeItem(key: string): void {
    EncryptedLocalStorageVault.removeItem(key);
  }
}
