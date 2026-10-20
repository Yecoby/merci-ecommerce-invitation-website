# MERCI Digital Invitations — Asset & Creative License Register (Audited & Verified)

**Scope:** Inventory of all visual assets, vector graphics, typography, icons, and software components utilized in the MERCI project workspace.
**Audit Finding:** Permissive open-source licenses and custom in-house vector artwork verified. Assets with pending legal trademark status are explicitly marked.

---

## 1. Asset & License Register

| Asset Identifier | Asset Type / File Location | Author / Source | License Type | Permitted Use | Attribution Requirement | Unresolved Risk / Provenance Status |
|---|---|---|---|---|---|---|
| **MERCI Quatrefoil Brand Mark** | Vector SVG (`src/components/ui/merci-logo.tsx`) | Custom original authoring for MERCI platform | Proprietary / Internal | Commercial & Editorial use on platform | None | **VERIFIED IN-HOUSE SVG**. Note: Brand name trademark with IPOPHL is pending owner registration. |
| **Botanical Floral Accent** | Vector SVG (`src/components/ui/decorative-artwork.tsx`) | Custom original authoring for MERCI platform | Proprietary / Internal | Commercial & Editorial use on platform | None | **VERIFIED IN-HOUSE SVG**. Clean vector geometric math. |
| **Celestial Constellation Accent** | Vector SVG (`src/components/ui/decorative-artwork.tsx`) | Custom original authoring for MERCI platform | Proprietary / Internal | Commercial & Editorial use on platform | None | **VERIFIED IN-HOUSE SVG**. Clean vector polygon math. |
| **Modern Arch Frame** | CSS / Layout Component (`src/components/ui/decorative-artwork.tsx`) | Custom original authoring for MERCI platform | Proprietary / Internal | Commercial & Editorial use on platform | None | **VERIFIED IN-HOUSE CSS**. Standard Tailwind CSS border styling. |
| **Lucide React Icons** | UI Icon Pack (`src/types/lucide-react.d.ts` / `lucide-react`) | Lucide Project Contributors | ISC License | Commercial, modification, distribution permitted | Standard ISC notice | **VERIFIED OPEN-SOURCE**. Permissive ISC license. |
| **System Typography Stack** | Web Fonts (`src/app/globals.css`) | System font stack (`Georgia`, `Cambria`, `Times New Roman`, `-apple-system`, `Segoe UI`, `Roboto`) | System Default Fonts | Standard cross-platform OS rendering | None | **VERIFIED ZERO RISK**. Uses OS pre-installed system fonts; zero licensing fee liability. |
| **Sample Event Narratives** | Fictional Sample Data (`src/lib/templates-data.ts`) | Fictional names and events created for demonstration ("Mateo & Sofia", "Lucas Gabriel", "Cassandra") | Proprietary / Fictional | Demonstration & Preview only | Clearly labeled sample data | **VERIFIED FICTIONAL**. All names, venues, and storylines are fictional placeholders. |
| **Confetti Animation Library** | NPM Dependency (`canvas-confetti`) | Kiril Vatev | ISC License | Commercial, modification, distribution permitted | Standard ISC notice | **VERIFIED OPEN-SOURCE**. Permissive ISC license. |

---

## 2. Integrity Verification
- **No Unlicensed Fonts:** The application relies on system serif fonts and system sans-serif fonts, avoiding expensive web-font commercial foundry licensing issues.
- **No Stolen Stock Photography:** The platform utilizes bespoke vector decorations, SVG line art, and typography compositions rather than unverified third-party stock photos.
- **Truth in Marketing:** Storefront packages and template previews clearly display notifications that initial prices and demo event entries are illustrative samples. No fake customer reviews or artificial sales counters are present.
