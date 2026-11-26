import React from "react";
import { ItemCard } from "./ItemCard";
import { PackageOpen, Sparkles } from "lucide-react";
import Link from "next/link";
import type { Item } from "@/types/database";

interface ItemGridProps {
  items: Item[];
  isLoading?: boolean;
}

export function ItemGrid({ items, isLoading = false }: ItemGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden animate-pulse"
          >
            <div className="aspect-[4/3] bg-slate-200 dark:bg-slate-800" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/3" />
              <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-4/5" />
              <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full" />
              <div className="pt-2 flex justify-between">
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="w-full py-16 px-4 flex flex-col items-center justify-center text-center bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-4">
          <PackageOpen className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-1">
          No items found
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mb-6 leading-relaxed">
          We couldn&apos;t find any items matching your current search or filters. Try
          broadening your search or be the first to donate!
        </p>
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="px-4 py-2 text-sm font-medium border border-slate-200 dark:border-slate-800 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Clear Filters
          </Link>
          <Link
            href="/donate"
            className="px-4 py-2 text-sm font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            Donate an Item
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} />
      ))}
    </div>
  );
}
