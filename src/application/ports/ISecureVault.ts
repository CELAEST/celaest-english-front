/**
 * ISecureVault — Application Port Interface
 * Abstract contract for encrypted client-side storage.
 * Implementations: EncryptedLocalStorageVault (AES-GCM 256-bit)
 */
export interface ISecureVault {
  setItem<T>(key: string, value: T): Promise<void>;
  getItem<T>(key: string): Promise<T | null>;
  removeItem(key: string): void;
}
