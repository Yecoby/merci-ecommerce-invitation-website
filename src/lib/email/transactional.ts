import crypto from "crypto";

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

/**
 * Generates a cryptographically random hexadecimal token.
 */
export function generateSecureToken(bytes: number = 32): string {
  return crypto.randomBytes(bytes).toString("hex");
}

/**
 * Hashes a token with SHA-256 before database storage to prevent plain-text exposure if the DB is compromised.
 */
export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

/**
 * Sends a transactional email.
 * If RESEND_API_KEY is configured in the environment, dispatches via Resend API.
 * Otherwise, fails safely with informative server-side logging without leaking recipient PII.
 */
export async function sendTransactionalEmail(options: SendEmailOptions): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.EMAIL_FROM || "MERCI <noreply@merci-invitations.ph>";

  if (!apiKey) {
    if (process.env.NODE_ENV === "development") {
      console.log(`[MERCI Email Mock] Outgoing email queued for subject: "${options.subject}". Transactional email provider API key (RESEND_API_KEY) is unconfigured.`);
    }
    return { success: false, error: "EMAIL_PROVIDER_UNCONFIGURED" };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from: fromEmail,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error("[MERCI Email Provider Error] Status:", res.status);
      return { success: false, error: errorData.message || "Failed to deliver email" };
    }

    return { success: true };
  } catch (err: any) {
    console.error("[MERCI Email Network Error]");
    return { success: false, error: err.message || "Network error" };
  }
}
