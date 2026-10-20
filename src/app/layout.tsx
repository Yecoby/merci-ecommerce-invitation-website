import type { Metadata } from "next";
import "./globals.css";
import { CookieBanner } from "@/components/ui/cookie-banner";

export const metadata: Metadata = {
  title: "MERCI — Premium Digital Invitation Websites",
  description: "Bespoke digital invitation websites with editorial elegance, custom storytelling, and effortless RSVP management for weddings, debuts, and milestones in the Philippines.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-[#FAF8F3] text-[#292824]">
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
