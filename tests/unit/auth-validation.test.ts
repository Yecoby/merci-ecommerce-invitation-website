import { describe, it, expect } from "vitest";
import { loginSchema, registerSchema, forgotPasswordSchema } from "@/lib/validation/auth";

describe("Auth Validation Schemas", () => {
  it("validates valid registration data", () => {
    const valid = {
      name: "Juan Dela Cruz",
      email: "juan@example.ph",
      password: "Password123",
      confirmPassword: "Password123",
    };
    const result = registerSchema.safeParse(valid);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("juan@example.ph");
    }
  });

  it("rejects mismatching passwords in registration", () => {
    const invalid = {
      name: "Juan Dela Cruz",
      email: "juan@example.ph",
      password: "Password123",
      confirmPassword: "Password456",
    };
    const result = registerSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("rejects weak passwords missing uppercase or numbers", () => {
    const invalid = {
      name: "Juan Dela Cruz",
      email: "juan@example.ph",
      password: "passwordonly",
      confirmPassword: "passwordonly",
    };
    const result = registerSchema.safeParse(invalid);
    expect(result.success).toBe(false);
  });

  it("validates login credentials correctly", () => {
    const valid = {
      email: " Sofia@Merci.ph  ",
      password: "SomePassword1",
    };
    const result = loginSchema.safeParse(valid);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.email).toBe("sofia@merci.ph");
    }
  });

  it("validates forgot password email", () => {
    const valid = { email: "test@domain.com" };
    expect(forgotPasswordSchema.safeParse(valid).success).toBe(true);

    const invalid = { email: "not-an-email" };
    expect(forgotPasswordSchema.safeParse(invalid).success).toBe(false);
  });
});
