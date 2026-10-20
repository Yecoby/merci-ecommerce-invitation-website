import { describe, it, expect } from "vitest";
import { generateSecureToken, hashToken } from "@/lib/email/transactional";
import { verifyPayMongoSignature } from "@/lib/payments/paymongo";
import crypto from "crypto";

describe("Recovery Tokens & Webhook Signature Verification", () => {
  it("generates random high-entropy tokens and produces deterministic SHA-256 hashes", () => {
    const token1 = generateSecureToken(32);
    const token2 = generateSecureToken(32);

    expect(token1).toHaveLength(64); // 32 bytes in hex = 64 characters
    expect(token2).toHaveLength(64);
    expect(token1).not.toBe(token2);

    const hashA1 = hashToken(token1);
    const hashA2 = hashToken(token1);
    expect(hashA1).toBe(hashA2);
    expect(hashA1).toHaveLength(64);
  });

  it("verifies legitimate PayMongo webhook signature", () => {
    const webhookSecret = "whsec_test_secret_key_123456";
    const payload = JSON.stringify({
      data: {
        attributes: {
          type: "payment.paid",
          data: { id: "pay_123", attributes: { amount: 189900, description: "MERCI-2027-0104" } },
        },
      },
    });

    const timestamp = Math.floor(Date.now() / 1000).toString();
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(`${timestamp}.${payload}`)
      .digest("hex");

    const signatureHeader = `t=${timestamp},te=${expectedSignature}`;

    const isValid = verifyPayMongoSignature(payload, signatureHeader, webhookSecret);
    expect(isValid).toBe(true);
  });

  it("rejects forged or tampered webhook signatures", () => {
    const webhookSecret = "whsec_test_secret_key_123456";
    const payload = JSON.stringify({ data: { test: true } });
    const signatureHeader = "t=12345678,te=tampered_invalid_signature";

    const isValid = verifyPayMongoSignature(payload, signatureHeader, webhookSecret);
    expect(isValid).toBe(false);
  });
});
