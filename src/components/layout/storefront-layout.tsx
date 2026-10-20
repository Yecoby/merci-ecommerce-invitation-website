import React from "react";
import Link from "next/link";
import { MerciLogo } from "@/components/ui/merci-logo";

export function StorefrontNavbar() {
  return (
    <header className="sticky top-0 z-40 bg-[#FAF8F3]/90 backdrop-blur-md border-b border-[#8B8278]/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Brand */}
        <MerciLogo size="md" withTagline={false} />

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-8 text-sm tracking-wide text-[#292824]">
          <Link href="/invitations" className="hover:text-[#8B8278] transition-colors">
            Designs
          </Link>
          <Link href="/pricing" className="hover:text-[#8B8278] transition-colors">
            Pricing
          </Link>
          <Link href="/custom-invitation" className="hover:text-[#8B8278] transition-colors">
            Custom Service
          </Link>
          <Link href="/about" className="hover:text-[#8B8278] transition-colors">
            About
          </Link>
          <Link href="/faq" className="hover:text-[#8B8278] transition-colors">
            FAQ
          </Link>
          <Link href="/contact" className="hover:text-[#8B8278] transition-colors">
            Contact
          </Link>
        </nav>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <Link
            href="/login"
            className="text-sm font-medium text-[#292824] hover:text-[#8B8278] px-3 py-1.5 transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/create"
            className="inline-flex items-center justify-center px-4 py-2 text-xs uppercase tracking-widest font-medium text-white bg-[#292824] hover:bg-[#3D3B35] transition-colors shadow-sm rounded-none"
          >
            Create Invitation
          </Link>
        </div>
      </div>
    </header>
  );
}

export function StorefrontFooter() {
  return (
    <footer className="bg-[#FAF8F3] border-t border-[#8B8278]/20 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4 md:col-span-1">
            <MerciLogo size="md" withTagline={true} />
            <p className="text-xs text-[#8B8278] leading-relaxed pt-2">
              Elevated digital invitation websites crafted with love in the Philippines. Inspiring celebrations through refined editorial design and effortless guest management.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#292824] mb-4">
              Explore
            </h4>
            <ul className="space-y-2 text-sm text-[#8B8278]">
              <li><Link href="/invitations" className="hover:text-[#292824] transition-colors">Invitation Gallery</Link></li>
              <li><Link href="/create" className="hover:text-[#292824] transition-colors">Self-Service Builder</Link></li>
              <li><Link href="/custom-invitation" className="hover:text-[#292824] transition-colors">Custom Concierge Service</Link></li>
              <li><Link href="/pricing" className="hover:text-[#292824] transition-colors">Package Pricing</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#292824] mb-4">
              Company
            </h4>
            <ul className="space-y-2 text-sm text-[#8B8278]">
              <li><Link href="/about" className="hover:text-[#292824] transition-colors">Our Philosophy</Link></li>
              <li><Link href="/faq" className="hover:text-[#292824] transition-colors">Frequently Asked Questions</Link></li>
              <li><Link href="/contact" className="hover:text-[#292824] transition-colors">Contact Concierge</Link></li>
              <li><Link href="/account" className="hover:text-[#292824] transition-colors">Client Portal</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-[#292824] mb-4">
              Legal & Notice
            </h4>
            <ul className="space-y-2 text-sm text-[#8B8278]">
              <li><Link href="/legal/privacy" className="hover:text-[#292824] transition-colors">Privacy Policy (Draft)</Link></li>
              <li><Link href="/legal/terms" className="hover:text-[#292824] transition-colors">Terms of Service (Draft)</Link></li>
              <li><Link href="/legal/refunds" className="hover:text-[#292824] transition-colors">Refund Policy (Draft)</Link></li>
              <li><Link href="/legal/cookies" className="hover:text-[#292824] transition-colors">Cookie Notice</Link></li>
              <li className="pt-2 text-xs text-[#8B8278]/70">
                Philippine Market · PHP (₱)
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[#8B8278]/15 flex flex-col md:flex-row justify-between items-center text-xs text-[#8B8278]">
          <p>© {new Date().getFullYear()} MERCI Digital Invitations. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Independent bespoke platform. Inspired by the grace of heartfelt hospitality.</p>
        </div>
      </div>
    </footer>
  );
}
