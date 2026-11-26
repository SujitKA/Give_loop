"use client";

import React, { useState, useTransition, useId } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CATEGORIES, CONDITIONS } from "@/lib/validations";
import { Search, X, SlidersHorizontal, ArrowUpDown } from "lucide-react";

const CITIES = ["Bengaluru", "Mumbai", "Delhi", "Hyderabad", "Pune", "Chennai"];

export function FilterBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const currentSearch = searchParams.get("q") || "";
  const currentCategory = searchParams.get("category") || "";
  const currentCondition = searchParams.get("condition") || "";
  const currentCity = searchParams.get("city") || "";
  const currentSort = searchParams.get("sort") || "newest";

  const [searchInput, setSearchInput] = useState(currentSearch);
  const conditionSelectId = useId();
  const citySelectId = useId();
  const sortSelectId = useId();

  const updateFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === "" || value === "all") {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    });

    startTransition(() => {
      router.push(`/?${params.toString()}`, { scroll: false });
    });
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({ q: searchInput.trim() || null });
  };

  const clearAllFilters = () => {
    setSearchInput("");
    startTransition(() => {
      router.push("/", { scroll: false });
    });
  };

  const hasActiveFilters = Boolean(
    currentSearch ||
      currentCategory ||
      currentCondition ||
      currentCity ||
      currentSort !== "newest"
  );

  return (
    <div className="w-full space-y-4">
      {/* Top Row: Search Input & Category Pills */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search clothes, laptops, textbooks, desks..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors shadow-sm"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => {
                setSearchInput("");
                updateFilters({ q: null });
              }}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </form>

        {/* Dropdowns Row on Desktop / Wrapped on Mobile */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          {/* Condition Select */}
          <div className="relative shrink-0">
            <label htmlFor={conditionSelectId} className="sr-only">
              Filter by condition
            </label>
            <select
              id={conditionSelectId}
              value={currentCondition}
              onChange={(e) => updateFilters({ condition: e.target.value })}
              className="appearance-none pl-3 pr-8 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-sm"
            >
              <option value="">All Conditions</option>
              {CONDITIONS.map((cond) => (
                <option key={cond} value={cond}>
                  {cond}
                </option>
              ))}
            </select>
            <SlidersHorizontal className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          </div>

          {/* City Select */}
          <div className="relative shrink-0">
            <label htmlFor={citySelectId} className="sr-only">
              Filter by city
            </label>
            <select
              id={citySelectId}
              value={currentCity}
              onChange={(e) => updateFilters({ city: e.target.value })}
              className="appearance-none pl-3 pr-8 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-sm"
            >
              <option value="">All Cities</option>
              {CITIES.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
            <SlidersHorizontal className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          </div>

          {/* Sort Select */}
          <div className="relative shrink-0">
            <label htmlFor={sortSelectId} className="sr-only">
              Sort listings
            </label>
            <select
              id={sortSelectId}
              value={currentSort}
              onChange={(e) => updateFilters({ sort: e.target.value })}
              className="appearance-none pl-3 pr-8 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-medium text-slate-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer shadow-sm"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
            <ArrowUpDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          </div>

          {/* Clear Filters Button */}
          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearAllFilters}
              className="shrink-0 px-3 py-2 text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-colors cursor-pointer"
            >
              Reset
            </button>
          )}
        </div>
      </div>

      {/* Category Pills (Horizontal Scroll on Mobile) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => updateFilters({ category: null })}
          className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
            !currentCategory
              ? "bg-emerald-600 text-white shadow-sm"
              : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300"
          }`}
        >
          All Items
        </button>
        {CATEGORIES.map((cat) => {
          const isSelected = currentCategory === cat;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => updateFilters({ category: isSelected ? null : cat })}
              className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer ${
                isSelected
                  ? "bg-emerald-600 text-white shadow-sm"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-300"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}
