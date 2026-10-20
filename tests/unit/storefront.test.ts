import { describe, it, expect } from "vitest";
import { TEMPLATES } from "@/lib/templates-data";
import { MERCI_TOKENS } from "@/lib/design-tokens";

describe("Design System & Templates Foundation", () => {
  it("defines core MERCI brand tokens with proper Philippine currency", () => {
    expect(MERCI_TOKENS.brand.name).toBe("MERCI");
    expect(MERCI_TOKENS.brand.currency).toBe("PHP");
    expect(MERCI_TOKENS.brand.currencySymbol).toBe("₱");
    expect(MERCI_TOKENS.colors.ivory).toBe("#FAF8F3");
  });

  it("provides at least 3 distinct original templates with complete metadata", () => {
    expect(TEMPLATES.length).toBeGreaterThanOrEqual(3);

    const slugs = TEMPLATES.map((t) => t.slug);
    const uniqueSlugs = new Set(slugs);
    expect(uniqueSlugs.size).toBe(slugs.length);

    TEMPLATES.forEach((tmpl) => {
      expect(tmpl.name).toBeTruthy();
      expect(tmpl.tagline).toBeTruthy();
      expect(tmpl.description).toBeTruthy();
      expect(tmpl.samplePricePHP).toBeGreaterThan(0);
      expect(tmpl.sampleEvent.hosts).toBeTruthy();
      expect(tmpl.sampleEvent.venue).toBeTruthy();
      expect(tmpl.sampleEvent.schedule.length).toBeGreaterThan(0);
      expect(tmpl.features.length).toBeGreaterThanOrEqual(5);
    });
  });

  it("ensures each template has distinct styling and occasion", () => {
    const occasions = TEMPLATES.map((t) => t.occasion);
    expect(occasions).toContain("wedding");
    expect(occasions).toContain("debut");
    expect(occasions).toContain("baptism");
  });
});
