"use client";

import React, { useState } from "react";
import Image from "next/image";

interface ItemGalleryProps {
  images: string[];
  title: string;
}

export function ItemGallery({ images, title }: ItemGalleryProps) {
  const displayImages =
    images && images.length > 0
      ? images
      : [
          "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80",
        ];

  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className="space-y-3">
      {/* Main Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 shadow-sm">
        <Image
          src={displayImages[selectedIndex]}
          alt={`${title} - photo ${selectedIndex + 1}`}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>

      {/* Thumbnails (only if more than 1 image) */}
      {displayImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-1">
          {displayImages.map((img, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setSelectedIndex(idx)}
                className={`relative w-20 h-16 rounded-xl overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                  isSelected
                    ? "border-emerald-600 ring-2 ring-emerald-500/20 scale-105"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <Image
                  src={img}
                  alt={`${title} thumbnail ${idx + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
