import { describe, it, expect, beforeEach, vi } from "vitest";
import { EncryptedLocalStorageVault } from "../EncryptedLocalStorageVault";

describe("EncryptedLocalStorageVault", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("round-trips a value without leaking plaintext into localStorage", async () => {
    const secret = { apiKey: "sk-test-123", savedAt: "2026-01-01T00:00:00Z" };

    await EncryptedLocalStorageVault.setItem("test:key", secret);

    const stored = localStorage.getItem("test:key") ?? "";
    expect(stored).not.toContain("sk-test-123");
    expect(stored.startsWith("v2:")).toBe(true);

    const decrypted = await EncryptedLocalStorageVault.getItem<typeof secret>("test:key");
    expect(decrypted).toEqual(secret);
  });

  it("uses a random IV so identical values produce different ciphertexts", async () => {
    await EncryptedLocalStorageVault.setItem("iv:a", { n: 1 });
    await EncryptedLocalStorageVault.setItem("iv:b", { n: 1 });

    const a = localStorage.getItem("iv:a");
    const b = localStorage.getItem("iv:b");
    expect(a).not.toBe(b);
  });

  it("returns null for missing keys", async () => {
    expect(await EncryptedLocalStorageVault.getItem("missing")).toBeNull();
  });

  it("rejects tampered ciphertexts instead of returning corrupted data (GCM integrity)", async () => {
    await EncryptedLocalStorageVault.setItem("tamper:key", { value: 42 });

    // Flip bytes inside the payload (keeps base64 valid)
    const raw = localStorage.getItem("tamper:key") ?? "";
    const payload = raw.slice(3);
    const flipped = payload
      .slice(0, -4)
      .split("")
      .map((c) => c)
      .join("");
    localStorage.setItem("tamper:key", `v2:${flipped.slice(0, flipped.length - 2)}AA==`);

    expect(await EncryptedLocalStorageVault.getItem<{ value: number }>("tamper:key")).toBeNull();
  });

  it("rejects plaintext values written by an attacker", async () => {
    localStorage.setItem("plain:key", JSON.stringify({ evil: true }));

    expect(await EncryptedLocalStorageVault.getItem<{ evil: boolean }>("plain:key")).toBeNull();
  });

  it("throws on encryption failure instead of degrading to plaintext", async () => {
    const subtleSpy = vi
      .spyOn(globalThis.crypto.subtle, "encrypt")
      .mockRejectedValue(new Error("crypto unavailable"));

    await expect(EncryptedLocalStorageVault.setItem("fail:key", { secret: "x" })).rejects.toThrow();

    expect(localStorage.getItem("fail:key")).toBeNull();
    subtleSpy.mockRestore();
  });

  it("removes items", async () => {
    await EncryptedLocalStorageVault.setItem("rm:key", { a: 1 });
    EncryptedLocalStorageVault.removeItem("rm:key");
    expect(await EncryptedLocalStorageVault.getItem("rm:key")).toBeNull();
  });
});
