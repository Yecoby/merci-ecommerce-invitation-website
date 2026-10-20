"use client";

import React, { useState } from "react";
import Link from "next/link";
import { StorefrontNavbar, StorefrontFooter } from "@/components/layout/storefront-layout";
import { TEMPLATES } from "@/lib/templates-data";
import { BotanicalFloralAccent, CelestialConstellationAccent } from "@/components/ui/decorative-artwork";
import { Search, Filter } from "lucide-react";

const CATEGORIES = [
  { key: "all", label: "All Collections" },
  { key: "wedding", label: "Weddings" },
  { key: "debut", label: "Debuts & 18th" },
  { key: "baptism", label: "Baptisms & Kids" },
  { key: "anniversary", label: "Anniversaries" },
];

export default function InvitationsGalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "price-asc" | "price-desc">("name");

  const filtered = TEMPLATES.filter((tmpl) => {
    const matchesCategory = selectedCategory === "all" || tmpl.occasion === selectedCategory;
    const matchesSearch =
      tmpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tmpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tmpl.occasionLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === "name") return a.name.localeCompare(b.name);
    if (sortBy === "price-asc") return a.samplePricePHP - b.samplePricePHP;
    if (sortBy === "price-desc") return b.samplePricePHP - a.samplePricePHP;
    return 0;
  });

  return (
    <div className="flex flex-col min-h-screen">
      <StorefrontNavbar />

      <main className="flex-1 py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs uppercase tracking-[0.25em] text-[#8B8278]">Design Portfolio</span>
          <h1 className="text-3xl sm:text-5xl font-serif text-[#292824] mt-2 mb-4">
            Curated Invitation Gallery
          </h1>
          <p className="text-sm text-[#8B8278] font-light leading-relaxed">
            Explore our thoughtfully composed designs. Each template is fully responsive, customizable with your colors and typography, and equipped with smart guest RSVP tracking.
          </p>
        </div>

        {/* Filters and Search Bar */}
        <div className="mb-12 flex flex-col md:flex-row gap-4 items-center justify-between border-y border-[#8B8278]/20 py-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-4 py-1.5 text-xs uppercase tracking-wider transition-all duration-200 ${selectedCategory === cat.key
                    ? "bg-[#292824] text-[#FAF8F3] font-medium"
                    : "bg-transparent text-[#8B8278] hover:text-[#292824]"
                  }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search & Sort */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-60">
              <Search className="w-4 h-4 text-[#8B8278] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search designs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-[#8B8278]/30 focus:outline-none focus:border-[#292824] text-[#292824]"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs bg-white border border-[#8B8278]/30 px-3 py-1.5 text-[#292824] focus:outline-none focus:border-[#292824]"
            >
              <option value="name">Sort by Name</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Gallery Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-24 bg-white/40 border border-[#8B8278]/20 p-8">
            <h3 className="font-serif text-lg text-[#292824] mb-2">No matching designs found</h3>
            <p className="text-xs text-[#8B8278] mb-6">
              Try adjusting your category filter or search keywords.
            </p>
            <button
              onClick={() => {
                setSelectedCategory("all");
                setSearchQuery("");
              }}
              className="px-6 py-2 text-xs uppercase tracking-widest bg-[#292824] text-[#FAF8F3]"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filtered.map((tmpl) => (
              <div
                key={tmpl.id}
                className="group flex flex-col bg-white border border-[#8B8278]/20 overflow-hidden hover:border-[#8B8278]/60 transition-all duration-300 shadow-sm"
              >
                {/* Visual Header */}
                <div
                  className="h-72 p-6 flex flex-col justify-between relative overflow-hidden"
                  style={{ backgroundColor: tmpl.palette.background, color: tmpl.palette.text }}
                >
                  <div className="flex items-center justify-between text-xs tracking-widest uppercase opacity-75">
                    <span>{tmpl.occasionLabel}</span>
                    <span>Sample ₱{tmpl.samplePricePHP.toLocaleString()}</span>
                  </div>

                  <div className="text-center my-auto">
                    <div className="text-[10px] uppercase tracking-[0.3em] opacity-60 mb-1">MERCI Atelier</div>
                    <h2 className="font-serif text-2xl font-light tracking-wide">{tmpl.name}</h2>
                    <p className="text-xs opacity-75 italic mt-1 font-serif">{tmpl.tagline}</p>
                  </div>

                  <div className="flex justify-center">
                    {tmpl.thumbnailStyle === "arch-editorial" && <BotanicalFloralAccent className="w-28 h-6 text-current opacity-70" />}
                    {tmpl.thumbnailStyle === "midnight-celestial" && <CelestialConstellationAccent className="w-16 h-8 text-[#C5A880]" />}
                    {tmpl.thumbnailStyle === "soft-botanical" && <BotanicalFloralAccent className="w-28 h-6 text-current opacity-70" />}
                  </div>
                </div>

                {/* Details */}
                <div className="p-6 flex-1 flex flex-col justify-between bg-[#FAF8F3]">
                  <div>
                    <p className="text-xs text-[#8B8278] leading-relaxed mb-4 font-light">
                      {tmpl.description}
                    </p>
                    <div className="border-t border-[#8B8278]/15 pt-3 mb-6 space-y-1.5">
                      <div className="text-[10px] uppercase tracking-wider text-[#8B8278] font-medium mb-1">
                        Supported Inclusions
                      </div>
                      {tmpl.features.map((feat, i) => (
                        <div key={i} className="text-xs text-[#292824] flex items-center gap-1.5">
                          <span className="w-1 h-1 bg-[#8B8278] rounded-full" />
                          {feat}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#8B8278]/15 flex items-center justify-between">
                    <Link
                      href={`/invitations/${tmpl.slug}`}
                      className="text-xs uppercase tracking-widest font-semibold text-[#292824] hover:text-[#8B8278] transition-colors"
                    >
                      Details & Options
                    </Link>
                    <Link
                      href={`/i/demo-${tmpl.slug}`}
                      className="text-xs uppercase tracking-widest font-medium text-[#8B8278] hover:text-[#292824] transition-colors"
                    >
                      Live Demo →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <StorefrontFooter />
    </div>
  );
}
