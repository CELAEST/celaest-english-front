import { describe, it, expect, beforeEach } from "vitest";
import { providerKeyVault } from "../providerKeyVault";

describe("providerKeyVault — Multi-Key Pool & Encryption at Rest", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("stores and retrieves multiple keys for a provider (key pool)", async () => {
    await providerKeyVault.saveKeys("groq", ["gsk_key_1", "gsk_key_2", "gsk_key_3"]);
    const keys = await providerKeyVault.getKeys("groq");
    expect(keys).toEqual(["gsk_key_1", "gsk_key_2", "gsk_key_3"]);

    // Primary key compatibility
    expect(await providerKeyVault.getKey("groq")).toBe("gsk_key_1");
    expect(await providerKeyVault.getKey("groq", 1)).toBe("gsk_key_2");
    expect(await providerKeyVault.hasKey("groq")).toBe(true);
  });

  it("appends new key to pool using addKey without duplicates", async () => {
    await providerKeyVault.saveKey("groq", "gsk_first");
    await providerKeyVault.addKey("groq", "gsk_second");
    await providerKeyVault.addKey("groq", "gsk_first"); // duplicate should not duplicate

    const keys = await providerKeyVault.getKeys("groq");
    expect(keys).toEqual(["gsk_first", "gsk_second"]);
  });

  it("removes a specific key by index from the pool", async () => {
    await providerKeyVault.saveKeys("gemini", ["key_a", "key_b", "key_c"]);
    await providerKeyVault.removeKeyAtIndex("gemini", 1); // remove "key_b"

    const keys = await providerKeyVault.getKeys("gemini");
    expect(keys).toEqual(["key_a", "key_c"]);
  });

  it("reads single key saved with saveKey as pool array", async () => {
    await providerKeyVault.saveKey("openai", "sk-single-key");
    const keys = await providerKeyVault.getKeys("openai");
    expect(keys).toEqual(["sk-single-key"]);
    expect(await providerKeyVault.getKey("openai")).toBe("sk-single-key");
  });

  it("strictly isolates keys between different user accounts", async () => {
    // User A saves a key
    localStorage.setItem("lingua_auth_user", JSON.stringify({ id: "user-alpha", email: "alpha@celaest.com" }));
    await providerKeyVault.saveKey("groq", "gsk_alpha_secret");
    expect(await providerKeyVault.getKeys("groq")).toEqual(["gsk_alpha_secret"]);

    // User B logs in
    localStorage.setItem("lingua_auth_user", JSON.stringify({ id: "user-beta", email: "beta@celaest.com" }));
    // User B should NOT see User A's keys
    expect(await providerKeyVault.getKeys("groq")).toEqual([]);

    // User B saves their own key
    await providerKeyVault.saveKey("groq", "gsk_beta_secret");
    expect(await providerKeyVault.getKeys("groq")).toEqual(["gsk_beta_secret"]);

    // Switch back to User A
    localStorage.setItem("lingua_auth_user", JSON.stringify({ id: "user-alpha", email: "alpha@celaest.com" }));
    expect(await providerKeyVault.getKeys("groq")).toEqual(["gsk_alpha_secret"]);
  });
});
