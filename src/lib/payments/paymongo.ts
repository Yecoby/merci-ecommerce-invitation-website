import crypto from "crypto";

/**
 * Verifies PayMongo webhook signature using HMAC SHA-256.
 * PayMongo delivers signature in the 'paymongo-signature' header:
 * Format: t=timestamp,te=test_signature,li=live_signature
 */
export function verifyPayMongoSignature(
  payloadString: string,
  signatureHeader: string | null,
  webhookSecret: string
): boolean {
  if (!signatureHeader || !webhookSecret) return false;

  const parts = signatureHeader.split(",");
  let timestamp = "";
  let liveSignature = "";
  let testSignature = "";

  for (const part of parts) {
    const [key, value] = part.trim().split("=");
    if (key === "t") timestamp = value;
    if (key === "li") liveSignature = value;
    if (key === "te") testSignature = value;
  }

  const signatureToCompare = liveSignature || testSignature;
  if (!timestamp || !signatureToCompare) return false;

  const expectedSignature = crypto
    .createHmac("sha256", webhookSecret)
    .update(`${timestamp}.${payloadString}`)
    .digest("hex");

  const sigBuf = Buffer.from(signatureToCompare);
  const expBuf = Buffer.from(expectedSignature);

  if (sigBuf.length !== expBuf.length) return false;

  return crypto.timingSafeEqual(sigBuf, expBuf);
}
