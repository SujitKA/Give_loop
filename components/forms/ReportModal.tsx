"use client";

import React, { useState, useTransition } from "react";
import { createReportAction } from "@/lib/actions/requests";
import { Button } from "@/components/ui/Button";
import { Flag, CheckCircle2, AlertCircle, X } from "lucide-react";

interface ReportModalProps {
  itemId: string;
  itemTitle: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ReportModal({ itemId, itemTitle, isOpen, onClose }: ReportModalProps) {
  const [reason, setReason] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    const formData = new FormData(e.currentTarget);
    formData.set("itemId", itemId);

    startTransition(async () => {
      const result = await createReportAction(null, formData);
      if (result?.error) {
        setErrorMessage(result.error);
      } else {
        setIsSuccess(true);
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Report Submitted
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-sm mx-auto leading-relaxed">
              Thank you for keeping GiveLoop safe. Our automated moderation flag has been
              recorded for admin review.
            </p>
            <div className="pt-2">
              <Button onClick={onClose} className="w-full">
                Close
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400">
                <Flag className="w-3.5 h-3.5" />
                <span>Safety & Moderation</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Report Listing
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Why are you reporting &quot;{itemTitle}&quot;?
              </p>
            </div>

            {errorMessage && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="report-reason"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Reason for report
                </label>
                <textarea
                  id="report-reason"
                  name="reason"
                  rows={3}
                  required
                  placeholder="e.g. This item appears to be broken or commercial advertisement..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 p-3.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-colors"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isPending}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="danger"
                  isLoading={isPending}
                >
                  Submit Report
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
