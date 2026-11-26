"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ItemGallery } from "@/components/items/ItemGallery";
import { RequestModal } from "@/components/forms/RequestModal";
import { ReportModal } from "@/components/forms/ReportModal";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatRelativeTime, formatDate } from "@/lib/utils";
import {
  MapPin,
  Clock,
  Flag,
  Share2,
  Check,
  ChevronRight,
  User as UserIcon,
  Sparkles,
  Lock,
} from "lucide-react";
import type { Item } from "@/types/database";

interface ItemDetailViewProps {
  item: Item;
  currentUserId?: string | null;
}

export function ItemDetailView({ item, currentUserId }: ItemDetailViewProps) {
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const isOwner = currentUserId && currentUserId === item.donor_id;
  const isAvailable = item.status === "Available";

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const donorName = item.donor?.full_name || "Community Member";
  const donorInitial = donorName[0]?.toUpperCase() || "U";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <Link href="/" className="hover:underline">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href={`/?category=${item.category}`} className="hover:underline">
          {item.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 dark:text-white font-medium truncate max-w-[200px]">
          {item.title}
        </span>
      </nav>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left Column: Gallery */}
        <div className="lg:col-span-7">
          <ItemGallery images={item.images} title={item.title} />
        </div>

        {/* Right Column: Details & Actions */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Status & Badges */}
            <div className="flex flex-wrap items-center gap-2">
              {item.status === "Available" && <Badge variant="success">Available</Badge>}
              {item.status === "Reserved" && <Badge variant="warning">Reserved</Badge>}
              {item.status === "Given" && <Badge variant="default">Given Away</Badge>}
              <Badge variant="outline">{item.category}</Badge>
              <Badge variant="info">Condition: {item.condition}</Badge>
            </div>

            {/* Title */}
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {item.title}
            </h1>

            {/* Metadata (City & Date) */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-1">
              <span className="flex items-center gap-1.5 font-medium">
                <MapPin className="w-4 h-4 text-emerald-600" />
                {item.city}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                Listed {formatRelativeTime(item.created_at)} ({formatDate(item.created_at)})
              </span>
            </div>

            <div className="border-t border-slate-100 dark:border-slate-800 my-4" />

            {/* Description */}
            <div className="space-y-2">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Item Description
              </h2>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {item.description}
              </p>
            </div>

            {/* Donor Profile Card */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm">
                  {donorInitial}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                    Donated by {donorName}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Location: {item.donor?.city || item.city}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200/50 dark:border-slate-800/50">
                <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>Contact details are shared only after donor accepts your request.</span>
              </div>
            </div>
          </div>

          {/* Action Area */}
          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            {isOwner ? (
              <div className="space-y-2">
                <p className="text-xs text-slate-500 text-center">
                  You are the donor of this item listing.
                </p>
                <Link href="/dashboard" className="w-full block">
                  <Button variant="outline" className="w-full py-3">
                    Manage in My Dashboard
                  </Button>
                </Link>
              </div>
            ) : isAvailable ? (
              currentUserId ? (
                <Button
                  onClick={() => setRequestModalOpen(true)}
                  className="w-full py-3.5 text-base gap-2 shadow-md shadow-emerald-600/20"
                >
                  <Sparkles className="w-4 h-4" />
                  Request This Item
                </Button>
              ) : (
                <Link
                  href={`/login?redirectTo=/items/${item.id}`}
                  className="w-full block"
                >
                  <Button className="w-full py-3.5 text-base gap-2">
                    <UserIcon className="w-4 h-4" />
                    Sign In to Request Item
                  </Button>
                </Link>
              )
            ) : item.status === "Reserved" ? (
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 text-center space-y-1">
                <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                  Currently Reserved
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-400">
                  The donor has accepted a request and this item is pending pickup.
                </p>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center space-y-1">
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Item Given Away
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  This item has already found a new home. Check out other listings!
                </p>
              </div>
            )}

            {/* Utility buttons: Share & Report */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-600 font-medium">Link Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share Giveaway</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setReportModalOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 transition-colors cursor-pointer"
              >
                <Flag className="w-3.5 h-3.5" />
                <span>Report Listing</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <RequestModal
        item={item}
        isOpen={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
      />

      <ReportModal
        itemId={item.id}
        itemTitle={item.title}
        isOpen={reportModalOpen}
        onClose={() => setReportModalOpen(false)}
      />
    </div>
  );
}
