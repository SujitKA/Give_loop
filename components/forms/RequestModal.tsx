"use client";

import React, { useState, useTransition } from "react";
import { createItemRequestAction } from "@/lib/actions/requests";
import { Button } from "@/components/ui/Button";
import { Send, CheckCircle2, AlertCircle, X, Sparkles } from "lucide-react";
import type { Item } from "@/types/database";

interface RequestModalProps {
  item: Item;
  isOpen: boolean;
  onClose: () => void;
}

export function RequestModal({ item, isOpen, onClose }: RequestModalProps) {
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage(null);

    const formData = new FormData(e.currentTarget);
    formData.set("itemId", item.id);

    startTransition(async () => {
      const result = await createItemRequestAction(null, formData);
      if (result?.error) {
        setErrorMessage(result.error);
      } else {
        setIsSuccess(true);
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {isSuccess ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Request Sent Successfully!
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-sm mx-auto leading-relaxed">
              The donor ({item.donor?.full_name || "the owner"}) has received your request.
              Once accepted, their contact information will appear in your Dashboard.
            </p>
            <div className="pt-2">
              <Button onClick={onClose} className="w-full">
                Close & Return
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Direct Request</span>
              </div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                Request &quot;{item.title}&quot;
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Let the donor know how you plan to use this item and when you can pick it up.
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
                  htmlFor="request-message"
                  className="block text-sm font-medium text-slate-700 dark:text-slate-300"
                >
                  Your message to donor
                </label>
                <textarea
                  id="request-message"
                  name="message"
                  rows={4}
                  required
                  placeholder="Hi! I am a student and need this for my upcoming semester. I can collect it from your location anytime this weekend..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 p-3.5 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                />
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Minimum 10 characters</span>
                  <span>{message.length}/500</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                🔒 <strong>Privacy note:</strong> Your phone number and email will only be
                revealed to the donor if they click &quot;Accept&quot; on your request.
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
                  isLoading={isPending}
                  className="gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send Request
                </Button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
