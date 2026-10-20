import { describe, it, expect, beforeEach } from "vitest";
import {
  generateOrderAccessCode,
  normalizeAccessCode,
  hashAccessCode,
  createAccessCodeHint,
  sealPortalSession,
  unsealPortalSession,
  checkPortalRateLimit,
  resetPortalRateLimit,
} from "@/lib/auth/portal-session";

describe("Client Portal Security & Session Helpers", () => {
  it("generates high-entropy non-sequential access codes formatted as MRC-XXXX", () => {
    const code1 = generateOrderAccessCode();
    const code2 = generateOrderAccessCode();

    expect(code1).toMatch(/^MRC-[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{4}$/);
    expect(code2).toMatch(/^MRC-[23456789ABCDEFGHJKMNPQRSTUVWXYZ]{4}$/);
    expect(code1).not.toBe(code2);
  });

  it("normalizes access code inputs regardless of whitespace or casing", () => {
    expect(normalizeAccessCode("  mrc - ab12 ")).toBe("MRC-AB12");
    expect(normalizeAccessCode("mrc—xy89")).toBe("MRC-XY89");
    expect(normalizeAccessCode("mrc-9k2p")).toBe("MRC-9K2P");
  });

  it("produces deterministic SHA-256 hashes for storage without storing raw codes", () => {
    const code = "MRC-7T4K";
    const hash1 = hashAccessCode(code);
    const hash2 = hashAccessCode("  mrc - 7t4k ");

    expect(hash1).toBe(hash2);
    expect(hash1).toHaveLength(64);
    expect(hash1).not.toContain("7T4K");
  });

  it("creates safe masked hints for administrative or user guidance", () => {
    expect(createAccessCodeHint("MRC-8F2K")).toBe("MRC-••2K");
    expect(createAccessCodeHint("MRC-12")).toBe("MRC-••12");
  });

  it("seals and unseals portal session payloads with AES-256-GCM encryption", () => {
    const payload = {
      orderId: "ord_12345678",
      orderReference: "MERCI-2027-9999",
      customerId: "usr_customer_1",
      email: "sofia@example.ph",
      packageSlug: "custom-concierge",
    };

    const token = sealPortalSession(payload);
    expect(typeof token).toBe("string");
    expect(token.split(".")).toHaveLength(3); // iv.tag.enc

    const unpacked = unsealPortalSession(token);
    expect(unpacked).not.toBeNull();
    expect(unpacked?.orderReference).toBe("MERCI-2027-9999");
    expect(unpacked?.email).toBe("sofia@example.ph");
    expect(unpacked?.customerId).toBe("usr_customer_1");
  });

  it("rejects tampered or malformed portal session tokens", () => {
    const token = sealPortalSession({
      orderId: "ord_1",
      orderReference: "REF-1",
      customerId: "usr_1",
      email: "test@example.ph",
      packageSlug: "self-service",
    });

    // Tamper token
    const tampered = token.slice(0, -6) + "XXXXXX";
    expect(unsealPortalSession(tampered)).toBeNull();
    expect(unsealPortalSession("invalid.token")).toBeNull();
    expect(unsealPortalSession("")).toBeNull();
  });

  it("enforces rate limiting and blocks brute force attempts after 15 attempts", () => {
    const testKey = "portal_test_ip_999";
    resetPortalRateLimit(testKey);

    for (let i = 0; i < 15; i++) {
      const res = checkPortalRateLimit(testKey);
      expect(res.allowed).toBe(true);
    }

    // 16th attempt should be blocked
    const blockedRes = checkPortalRateLimit(testKey);
    expect(blockedRes.allowed).toBe(false);
    expect(blockedRes.remaining).toBe(0);
    expect(blockedRes.retryAfterSeconds).toBeGreaterThan(0);

    // Reset works
    resetPortalRateLimit(testKey);
    const resetRes = checkPortalRateLimit(testKey);
    expect(resetRes.allowed).toBe(true);
  });
});
