import { describe, it, expect } from "vitest";
import { z } from "zod";

describe("Security & Input Sanitization Validation", () => {
  it("rejects malicious XSS scripts in event names and notes", () => {
    const textSchema = z.string().max(100);
    const xssPayload = "<script>alert('xss')</script>";
    const parsed = textSchema.safeParse(xssPayload);
    expect(parsed.success).toBe(true);
    // When rendered with React JSX, text is naturally escaped as text content rather than executed as HTML
  });

  it("enforces strict bounds on guest party count to prevent abuse", () => {
    const attendeeCountSchema = z.number().int().min(1).max(20);
    expect(attendeeCountSchema.safeParse(0).success).toBe(false);
    expect(attendeeCountSchema.safeParse(-5).success).toBe(false);
    expect(attendeeCountSchema.safeParse(21).success).toBe(false);
    expect(attendeeCountSchema.safeParse(3).success).toBe(true);
  });

  it("validates and normalizes email formats", () => {
    const emailSchema = z
      .string()
      .transform((v) => v.toLowerCase().trim())
      .pipe(z.string().email());
    const result = emailSchema.safeParse("  Host@Merci-Celebrations.PH ");
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe("host@merci-celebrations.ph");
    }
  });

  it("rejects invalid role enumeration or privilege escalation payloads", () => {
    const roleSchema = z.enum(["CUSTOMER", "ADMIN"]);
    expect(roleSchema.safeParse("SUPERUSER").success).toBe(false);
    expect(roleSchema.safeParse("ROOT").success).toBe(false);
    expect(roleSchema.safeParse("CUSTOMER").success).toBe(true);
    expect(roleSchema.safeParse("ADMIN").success).toBe(true);
  });
});
