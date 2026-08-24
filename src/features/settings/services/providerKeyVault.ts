/**
 * ProviderKeyVault
 * Stores AI provider API keys encrypted at rest (AES-GCM 256-bit)
 * via the ISecureVault port. Keys NEVER leave the client device.
 */

import { AiProviderId } from "../../../domain/entities/AiProvider";
import { EncryptedLocalStorageVault } from "../../../infrastructure/adapters/storage/EncryptedLocalStorageVault";

const KEY_PREFIX = "celaest:provider-key:";
const CONFIG_PREFIX = "celaest:provider-config:";

export interface StoredProviderConfig {
  endpoint?: string;
  defaultModel?: string;
}

export const providerKeyVault = {
  async saveKey(providerId: AiProviderId, apiKey: string): Promise<void> {
    await EncryptedLocalStorageVault.setItem(`${KEY_PREFIX}${providerId}`, {
      apiKey,
      savedAt: new Date().toISOString(),
    });
  },

  async hasKey(providerId: AiProviderId): Promise<boolean> {
    const entry = await EncryptedLocalStorageVault.getItem<{
      apiKey: string;
    }>(`${KEY_PREFIX}${providerId}`);
    return Boolean(entry?.apiKey);
  },

  async removeKey(providerId: AiProviderId): Promise<void> {
    EncryptedLocalStorageVault.removeItem(`${KEY_PREFIX}${providerId}`);
  },

  async saveConfig(
    providerId: AiProviderId,
    config: StoredProviderConfig
  ): Promise<void> {
    await EncryptedLocalStorageVault.setItem(
      `${CONFIG_PREFIX}${providerId}`,
      config
    );
  },

  async getConfig(providerId: AiProviderId): Promise<StoredProviderConfig | null> {
    return EncryptedLocalStorageVault.getItem<StoredProviderConfig>(
      `${CONFIG_PREFIX}${providerId}`
    );
  },
};
