/**
 * MERCI — Client Portal Access Token & Session Utilities
 *
 * Implements high-entropy order access codes (e.g. MRC-8F2K),
 * SHA-256 code hashing, rate limiting, and encrypted/signed HMAC portal session tokens.
 */
import crypto from "crypto";

const PORTAL_COOKIE_NAME = "merci_portal_session";
const PORTAL_SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS_PER_WINDOW = 15;

// In-memory rate limiting map for access code verification attempts: IP/identifier -> { count, resetAt }
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

/**
 * Clean up expired rate limit entries periodically
 */
function cleanupRateLimits() {
  const now = Date.now();
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetAt) {
      rateLimitMap.delete(key);
    }
  }
}

/**
 * Checks and increments rate limiting for a client key (IP or IP+email).
 * Returns true if allowed, false if rate limited.
 */
export function checkPortalRateLimit(identifier: string): { allowed: boolean; remaining: number; retryAfterSeconds?: number } {
  cleanupRateLimits();
  const now = Date.now();
  const record = rateLimitMap.get(identifier);

  if (!record || now > record.resetAt) {
    rateLimitMap.set(identifier, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { allowed: true, remaining: MAX_ATTEMPTS_PER_WINDOW - 1 };
  }

  if (record.count >= MAX_ATTEMPTS_PER_WINDOW) {
    const retryAfterSeconds = Math.ceil((record.resetAt - now) / 1000);
    return { allowed: false, remaining: 0, retryAfterSeconds };
  }

  record.count += 1;
  return { allowed: true, remaining: MAX_ATTEMPTS_PER_WINDOW - record.count };
}

/**
 * Resets rate limit upon successful verification
 */
export function resetPortalRateLimit(identifier: string): void {
  rateLimitMap.delete(identifier);
}

/**
 * Normalizes user input for order access codes (trims, uppercase, standardizes dashes).
 * Example: "  mrc - ab12 " -> "MRC-AB12"
 */
export function normalizeAccessCode(input: string): string {
  return input
    .trim()
    .toUpperCase()
    .replace(/\s+/g, "")
    .replace(/[–—]/g, "-");
}

/**
 * Generates a cryptographically strong, non-sequential order access code.
 * Format: MRC-XXXX where XXXX is 4 random unambiguous alphanumeric characters (Crockford-style charset).
 */
export function generateOrderAccessCode(): string {
  // Safe character set excluding easily confused characters (0, O, 1, I, L)
  const charset = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
  const bytes = crypto.randomBytes(6);
  let code = "MRC-";
  for (let i = 0; i < 4; i++) {
    code += charset[bytes[i] % charset.length];
  }
  return code;
}

/**
 * Computes deterministic SHA-256 hex hash of an access code for DB storage/lookup.
 * Raw codes are never stored in the database.
 */
export function hashAccessCode(code: string): string {
  const normalized = normalizeAccessCode(code);
  return crypto.createHash("sha256").update(`merci:order:${normalized}`).digest("hex");
}

/**
 * Creates a masked hint for admin/support view (e.g. "MRC-••7A")
 */
export function createAccessCodeHint(code: string): string {
  const normalized = normalizeAccessCode(code);
  if (normalized.length <= 4) return "MRC-••••";
  return `${normalized.slice(0, 4)}••${normalized.slice(-2)}`;
}

export interface PortalSessionPayload {
  orderId: string;
  orderReference: string;
  customerId: string;
  email: string;
  packageSlug: string;
  exp: number; // unix timestamp in seconds
}

function getPortalSecret(): string {
  return process.env.AUTH_SECRET || "merci-portal-fallback-secret-minimum-32-chars-long";
}

/**
 * Signs and packages a portal session payload into an encrypted/HMAC token
 */
export function sealPortalSession(payload: Omit<PortalSessionPayload, "exp">): string {
  const secret = getPortalSecret();
  const fullPayload: PortalSessionPayload = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + PORTAL_SESSION_MAX_AGE_SECONDS,
  };

  const jsonStr = JSON.stringify(fullPayload);
  const iv = crypto.randomBytes(12);
  const key = crypto.createHash("sha256").update(secret).digest();
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  
  const encrypted = Buffer.concat([cipher.update(jsonStr, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();

  // Format: base64(iv).base64(tag).base64(encrypted)
  return `${iv.toString("base64url")}.${tag.toString("base64url")}.${encrypted.toString("base64url")}`;
}

/**
 * Verifies and unpacks a portal session token
 */
export function unsealPortalSession(token: string): PortalSessionPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;

    const [ivB64, tagB64, encB64] = parts;
    const iv = Buffer.from(ivB64, "base64url");
    const tag = Buffer.from(tagB64, "base64url");
    const encrypted = Buffer.from(encB64, "base64url");

    const secret = getPortalSecret();
    const key = crypto.createHash("sha256").update(secret).digest();
    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(tag);

    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    const payload: PortalSessionPayload = JSON.parse(decrypted.toString("utf8"));

    if (!payload.exp || Math.floor(Date.now() / 1000) > payload.exp) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export { PORTAL_COOKIE_NAME, PORTAL_SESSION_MAX_AGE_SECONDS };
