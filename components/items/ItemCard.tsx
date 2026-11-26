import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { formatRelativeTime } from "@/lib/utils";
import { MapPin, Clock, Laptop, BookOpen, Armchair, Shirt, Package } from "lucide-react";
import type { Item } from "@/types/database";

interface ItemCardProps {
  item: Item;
}

export function ItemCard({ item }: ItemCardProps) {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Laptops":
        return <Laptop className="w-3.5 h-3.5" />;
      case "Textbooks":
        return <BookOpen className="w-3.5 h-3.5" />;
      case "Furniture":
        return <Armchair className="w-3.5 h-3.5" />;
      case "Clothes":
        return <Shirt className="w-3.5 h-3.5" />;
      default:
        return <Package className="w-3.5 h-3.5" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Available":
        return <Badge variant="success">Available</Badge>;
      case "Reserved":
        return <Badge variant="warning">Reserved</Badge>;
      case "Given":
        return <Badge variant="default">Given</Badge>;
      default:
        return null;
    }
  };

  const mainImage =
    item.images && item.images.length > 0
      ? item.images[0]
      : "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80";

  return (
    <Link
      href={`/items/${item.id}`}
      className="group flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-lg hover:border-emerald-500/50 dark:hover:border-emerald-500/50 transition-all duration-200"
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <Image
          src={mainImage}
          alt={item.title}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          priority={false}
        />
        {/* Floating Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          {getStatusBadge(item.status)}
        </div>
        <div className="absolute top-3 right-3">
          <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-black/60 text-white backdrop-blur-md">
            {item.condition}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Category Pill */}
          <div className="flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400 mb-1.5">
            {getCategoryIcon(item.category)}
            <span>{item.category}</span>
          </div>

          {/* Title */}
          <h3 className="font-semibold text-slate-900 dark:text-white line-clamp-1 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            {item.title}
          </h3>

          {/* Description snippet */}
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mt-1 leading-relaxed">
            {item.description}
          </p>
        </div>

        {/* Footer: City & Time */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1 truncate max-w-[140px]">
            <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-400" />
            <span className="truncate">{item.city}</span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{formatRelativeTime(item.created_at)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
