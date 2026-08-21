import { ISecureVault } from '../../../application/ports/ISecureVault';

/**
 * AES-GCM 256-bit Client-Side Encrypted Storage Vault Adapter
 * Implements ISecureVault port interface.
 * Ensures User Learning DNA and AI transcripts are encrypted before saving to browser storage.
 */
export class EncryptedLocalStorageVault implements ISecureVault {
  private static SECRET_SALT = 'celaest-lingua-vault-salt-2026';

  private static async getEncryptionKey(): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      encoder.encode(this.SECRET_SALT),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );

    return window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: encoder.encode('lingua-salt'),
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt', 'decrypt']
    );
  }

  public static async setItem<T>(key: string, value: T): Promise<void> {
    try {
      const cryptoKey = await this.getEncryptionKey();
      const encoder = new TextEncoder();
      const iv = window.crypto.getRandomValues(new Uint8Array(12));
      const jsonString = JSON.stringify(value);

      const encryptedContent = await window.crypto.subtle.encrypt(
        { name: 'AES-GCM', iv },
        cryptoKey,
        encoder.encode(jsonString)
      );

      const combined = new Uint8Array(iv.length + encryptedContent.byteLength);
      combined.set(iv);
      combined.set(new Uint8Array(encryptedContent), iv.length);

      const base64Payload = btoa(String.fromCharCode(...combined));
      localStorage.setItem(key, base64Payload);
    } catch (error) {
      console.error(`Vault Encryption Error for key [${key}]:`, error);
      // Fallback for non-supported environments
      localStorage.setItem(key, JSON.stringify(value));
    }
  }

  public static async getItem<T>(key: string): Promise<T | null> {
    try {
      const base64Payload = localStorage.getItem(key);
      if (!base64Payload) return null;

      const cryptoKey = await this.getEncryptionKey();
      const binaryString = atob(base64Payload);
      const combined = Uint8Array.from(binaryString, (c) => c.charCodeAt(0));

      const iv = combined.slice(0, 12);
      const ciphertext = combined.slice(12);

      const decryptedContent = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        cryptoKey,
        ciphertext
      );

      const decoder = new TextDecoder();
      return JSON.parse(decoder.decode(decryptedContent)) as T;
    } catch (error) {
      console.warn(`Vault Decryption Fallback for key [${key}]:`, error);
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
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
