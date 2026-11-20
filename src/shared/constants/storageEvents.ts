/**
 * Cross-component event dispatched whenever provider API keys in client vault change.
 * Kept in a dedicated leaf module so partial vi.mock(..., providerKeyVault) in unit tests
 * never break when importing this event name.
 */
export const PROVIDER_KEYS_CHANGED_EVENT = "celaest:provider-keys-changed";
