import React, { Suspense } from "react";
import Link from "next/link";
import { FilterBar } from "@/components/items/FilterBar";
import { ItemGrid } from "@/components/items/ItemGrid";
import { getItems } from "@/lib/data/items";
import {
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Heart,
  ArrowRight,
  Package,
} from "lucide-react";

interface PageProps {
  searchParams: Promise<{
    category?: string;
    condition?: string;
    city?: string;
    q?: string;
    sort?: "newest" | "oldest";
  }>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const items = await getItems(resolvedParams);

  const activeCategory = resolvedParams.category || "All Items";
  const hasActiveFilters = Boolean(
    resolvedParams.q ||
      resolvedParams.category ||
      resolvedParams.condition ||
      resolvedParams.city
  );

  return (
    <div className="flex-1 flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-b from-emerald-50/50 via-white to-white dark:from-emerald-950/20 dark:via-slate-950 dark:to-slate-950 py-16 sm:py-24 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl space-y-6">
            {/* Mission Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-100/80 dark:bg-emerald-950/60 border border-emerald-300/50 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Campus Circular Economy & Free Giveaways</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.1]">
              Give What You Don&apos;t Need. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-500">
                Find What You Do.
              </span>
            </h1>

            {/* Subtext */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
              GiveLoop connects students and neighbors to pass forward study textbooks,
              spare laptops, dorm furniture, and winter clothes. No bidding, no fees—just
              free community goodwill.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href="/donate"
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                Donate an Item
              </Link>
              <a
                href="#browse"
                className="px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 font-medium transition-colors flex items-center gap-2 cursor-pointer"
              >
                Browse Listings
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-8 border-t border-slate-200/60 dark:border-slate-800/60 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Protected Contact Info</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Free Forever</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Zero Delivery Middlemen</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Browse & Explore Section */}
      <section id="browse" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              {activeCategory === "All Items" ? "Available Giveaways" : `${activeCategory} Giveaways`}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Showing {items.length} {items.length === 1 ? "item" : "items"}{" "}
              {hasActiveFilters && "matching your filters"}
            </p>
          </div>
        </div>

        {/* Filter & Search Bar with Suspense boundary */}
        <Suspense
          fallback={
            <div className="h-24 w-full bg-slate-100 dark:bg-slate-900 rounded-2xl animate-pulse" />
          }
        >
          <FilterBar />
        </Suspense>

        {/* Item Cards Grid */}
        <ItemGrid items={items} />
      </section>
    </div>
  );
}
