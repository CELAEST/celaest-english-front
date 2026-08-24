/**
 * Vault maintenance utilities for Privacy & Data quick actions.
 * Operates on all `celaest:` namespaced entries in local storage.
 */

import { EncryptedLocalStorageVault } from "../../../infrastructure/adapters/storage/EncryptedLocalStorageVault";

const VAULT_NAMESPACE = "celaest:";

export interface ExportedVaultData {
  exportedAt: string;
  namespace: string;
  entries: Record<string, unknown>;
}

export const vaultMaintenance = {
  async exportAll(): Promise<ExportedVaultData> {
    const entries: Record<string, unknown> = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith(VAULT_NAMESPACE)) continue;
      entries[key] = await EncryptedLocalStorageVault.getItem(key);
    }
    return {
      exportedAt: new Date().toISOString(),
      namespace: VAULT_NAMESPACE,
      entries,
    };
  },

  downloadExport(data: ExportedVaultData): void {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `celaest-vault-export-${new Date()
      .toISOString()
      .slice(0, 10)}.json`;
    anchor.click();
    URL.revokeObjectURL(url);
  },

  purgeAll(): number {
    let purged = 0;
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(VAULT_NAMESPACE)) keysToRemove.push(key);
    }
    keysToRemove.forEach((key) => {
      localStorage.removeItem(key);
      purged++;
    });
    return purged;
  },
};
