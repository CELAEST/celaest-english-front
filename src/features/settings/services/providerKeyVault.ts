/**
 * ProviderKeyVault
 * Stores AI provider API keys encrypted at rest (AES-GCM 256-bit)
 * via the ISecureVault port. Keys NEVER leave the client device.
 */

import { AiProviderId } from "../../../domain/entities/AiProvider";
import { EncryptedLocalStorageVault } from "../../../infrastructure/adapters/storage/EncryptedLocalStorageVault";

function getCurrentUserId(): string | null {
  if (typeof window === "undefined" || typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem("lingua_auth_user");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.id || null;
  } catch {
    return null;
  }
}

function getKeyPrefix(): string {
  const userId = getCurrentUserId();
  return userId ? `celaest:user:${userId}:provider-key:` : "celaest:session:provider-key:";
}

function getConfigPrefix(): string {
  const userId = getCurrentUserId();
  return userId ? `celaest:user:${userId}:provider-config:` : "celaest:session:provider-config:";
}

function getActiveProviderKey(): string {
  const userId = getCurrentUserId();
  return userId ? `celaest:user:${userId}:active-provider` : "celaest:session:active-provider";
}

const USE_CENTRAL_CORE_KEY = "celaest:use-central-core";

export interface StoredProviderKeyEntry {
  apiKey?: string;
  apiKeys?: string[];
  savedAt?: string;
}

export interface StoredProviderConfig {
  endpoint?: string;
  defaultModel?: string;
}

export const providerKeyVault = {
  async isCentralCoreEnabled(): Promise<boolean> {
    const entry = await EncryptedLocalStorageVault.getItem<{ enabled: boolean }>(
      USE_CENTRAL_CORE_KEY,
    );
    // Raíz: si el usuario nunca tocó el toggle, usar CORE por defecto si está levantado (evita fallback procedural innecesario)
    if (entry === null || entry === undefined) return true;
    return entry.enabled ?? true;
  },

  async setCentralCoreEnabled(enabled: boolean): Promise<void> {
    await EncryptedLocalStorageVault.setItem(USE_CENTRAL_CORE_KEY, { enabled });
  },

  async saveKey(providerId: AiProviderId, apiKey: string): Promise<void> {
    const clean = apiKey.trim();
    if (!clean) return;
    const existing = await this.getKeys(providerId);
    const updated = existing.includes(clean) ? existing : [...existing, clean];
    await EncryptedLocalStorageVault.setItem(`${getKeyPrefix()}${providerId}`, {
      apiKey: updated[0] || clean,
      apiKeys: updated,
      savedAt: new Date().toISOString(),
    });
  },

  async saveKeys(providerId: AiProviderId, keys: string[]): Promise<void> {
    const cleanKeys = keys.map((k) => k.trim()).filter(Boolean);
    await EncryptedLocalStorageVault.setItem(`${getKeyPrefix()}${providerId}`, {
      apiKey: cleanKeys[0] || "",
      apiKeys: cleanKeys,
      savedAt: new Date().toISOString(),
    });
  },

  async addKey(providerId: AiProviderId, apiKey: string): Promise<void> {
    await this.saveKey(providerId, apiKey);
  },

  async migrateSessionToUser(targetUserId?: string): Promise<void> {
    const userId = targetUserId || getCurrentUserId();
    if (!userId) return;

    const allProviders: AiProviderId[] = [
      "groq",
      "gemini",
      "openai",
      "anthropic",
      "grok",
      "deepseek",
      "ollama",
      "openrouter",
      "perplexity",
      "huggingface",
      "qwen",
      "meta",
    ];

    for (const pid of allProviders) {
      // 1. Migrate keys
      const sessionKey = `celaest:session:provider-key:${pid}`;
      const userKey = `celaest:user:${userId}:provider-key:${pid}`;
      const sessionEntry = await EncryptedLocalStorageVault.getItem<StoredProviderKeyEntry>(sessionKey);
      if (sessionEntry) {
        const userEntry = await EncryptedLocalStorageVault.getItem<StoredProviderKeyEntry>(userKey);
        if (!userEntry || !userEntry.apiKeys?.length) {
          await EncryptedLocalStorageVault.setItem(userKey, sessionEntry);
        }
        EncryptedLocalStorageVault.removeItem(sessionKey);
      }

      // 2. Migrate configs
      const sessionConfigKey = `celaest:session:provider-config:${pid}`;
      const userConfigKey = `celaest:user:${userId}:provider-config:${pid}`;
      const sessionConfig = await EncryptedLocalStorageVault.getItem<StoredProviderConfig>(sessionConfigKey);
      if (sessionConfig) {
        const userConfig = await EncryptedLocalStorageVault.getItem<StoredProviderConfig>(userConfigKey);
        if (!userConfig) {
          await EncryptedLocalStorageVault.setItem(userConfigKey, sessionConfig);
        }
        EncryptedLocalStorageVault.removeItem(sessionConfigKey);
      }
    }

    // 3. Migrate active provider
    const sessionActiveKey = "celaest:session:active-provider";
    const userActiveKey = `celaest:user:${userId}:active-provider`;
    const sessionActive = await EncryptedLocalStorageVault.getItem<{ providerId: AiProviderId }>(sessionActiveKey);
    if (sessionActive?.providerId) {
      const userActive = await EncryptedLocalStorageVault.getItem<{ providerId: AiProviderId }>(userActiveKey);
      if (!userActive?.providerId) {
        await EncryptedLocalStorageVault.setItem(userActiveKey, sessionActive);
      }
      EncryptedLocalStorageVault.removeItem(sessionActiveKey);
    }
  },

  async getKeys(providerId: AiProviderId): Promise<string[]> {
    const key = `${getKeyPrefix()}${providerId}`;
    let entry = await EncryptedLocalStorageVault.getItem<StoredProviderKeyEntry>(key);

    const userId = getCurrentUserId();
    // Auto-migrate from session or legacy un-scoped key if user is logged in
    if (!entry && userId) {
      const sessionKey = `celaest:session:provider-key:${providerId}`;
      const sessionEntry = await EncryptedLocalStorageVault.getItem<StoredProviderKeyEntry>(sessionKey);
      if (sessionEntry) {
        await EncryptedLocalStorageVault.setItem(key, sessionEntry);
        EncryptedLocalStorageVault.removeItem(sessionKey);
        entry = sessionEntry;
      } else {
        const legacyKey = `celaest:provider-key:${providerId}`;
        const legacyEntry = await EncryptedLocalStorageVault.getItem<StoredProviderKeyEntry>(legacyKey);
        if (legacyEntry) {
          await EncryptedLocalStorageVault.setItem(key, legacyEntry);
          EncryptedLocalStorageVault.removeItem(legacyKey);
          entry = legacyEntry;
        }
      }
    }

    if (entry?.apiKeys && Array.isArray(entry.apiKeys) && entry.apiKeys.length > 0) {
      return entry.apiKeys.filter((k) => typeof k === "string" && k.trim());
    }
    if (entry?.apiKey && entry.apiKey.trim()) {
      return [entry.apiKey.trim()];
    }
    return [];
  },

  async hasKey(providerId: AiProviderId): Promise<boolean> {
    const keys = await this.getKeys(providerId);
    return keys.length > 0;
  },

  async getKey(providerId: AiProviderId, index = 0): Promise<string | null> {
    const keys = await this.getKeys(providerId);
    return keys[index] ?? keys[0] ?? null;
  },

  async removeKeyAtIndex(providerId: AiProviderId, index: number): Promise<void> {
    const keys = await this.getKeys(providerId);
    if (index >= 0 && index < keys.length) {
      const updated = keys.filter((_, i) => i !== index);
      await this.saveKeys(providerId, updated);
    }
  },

  async removeKey(providerId: AiProviderId): Promise<void> {
    EncryptedLocalStorageVault.removeItem(`${getKeyPrefix()}${providerId}`);
  },

  async saveConfig(providerId: AiProviderId, config: StoredProviderConfig): Promise<void> {
    await EncryptedLocalStorageVault.setItem(`${getConfigPrefix()}${providerId}`, config);
  },

  async getConfig(providerId: AiProviderId): Promise<StoredProviderConfig | null> {
    const configKey = `${getConfigPrefix()}${providerId}`;
    let config = await EncryptedLocalStorageVault.getItem<StoredProviderConfig>(configKey);

    const userId = getCurrentUserId();
    if (!config && userId) {
      const sessionConfigKey = `celaest:session:provider-config:${providerId}`;
      const sessionConfig = await EncryptedLocalStorageVault.getItem<StoredProviderConfig>(sessionConfigKey);
      if (sessionConfig) {
        await EncryptedLocalStorageVault.setItem(configKey, sessionConfig);
        EncryptedLocalStorageVault.removeItem(sessionConfigKey);
        config = sessionConfig;
      }
    }

    return config;
  },

  async saveActiveProviderId(providerId: AiProviderId): Promise<void> {
    await EncryptedLocalStorageVault.setItem(getActiveProviderKey(), { providerId });
  },

  async getActiveProviderId(): Promise<AiProviderId | null> {
    const key = getActiveProviderKey();
    let entry = await EncryptedLocalStorageVault.getItem<{ providerId: AiProviderId }>(key);

    const userId = getCurrentUserId();
    if (!entry && userId) {
      const sessionActiveKey = "celaest:session:active-provider";
      const sessionActive = await EncryptedLocalStorageVault.getItem<{ providerId: AiProviderId }>(sessionActiveKey);
      if (sessionActive?.providerId) {
        await EncryptedLocalStorageVault.setItem(key, sessionActive);
        EncryptedLocalStorageVault.removeItem(sessionActiveKey);
        entry = sessionActive;
      } else {
        const legacyEntry = await EncryptedLocalStorageVault.getItem<{ providerId: AiProviderId }>("celaest:active-provider");
        if (legacyEntry?.providerId) {
          await EncryptedLocalStorageVault.setItem(key, legacyEntry);
          EncryptedLocalStorageVault.removeItem("celaest:active-provider");
          entry = legacyEntry;
        }
      }
    }

    return entry?.providerId ?? null;
  },

  async clearActiveProviderId(): Promise<void> {
    EncryptedLocalStorageVault.removeItem(getActiveProviderKey());
  },
};

