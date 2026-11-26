"use client";

import React, {
  useState,
  useTransition,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { itemSchema, type ItemFormData } from "@/lib/validations";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import {
  X,
  Image as ImageIcon,
  Sparkles,
  AlertCircle,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import { compressImage } from "@/lib/utils";

const MAX_IMAGES = 4;
const MAX_FILE_SIZE_MB = 5;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];

export default function DonatePage() {
  const router = useRouter();
  const supabase = createClient();
  const [isPending, startTransition] = useTransition();
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<ItemFormData>({
    title: "",
    description: "",
    category: "Clothes",
    condition: "Good",
    city: "Bengaluru",
    images: [],
  });

  // Client-side image preview / upload state
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [fileBlobs, setFileBlobs] = useState<Blob[]>([]);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Helper: validate image files before adding
  const validateImageFile = useCallback((file: File): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return "Only JPG, PNG, and WebP images are allowed.";
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      return `Image must be under ${MAX_FILE_SIZE_MB}MB.`;
    }
    return null;
  }, []);

  const handleImageChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []);
      setUploadError(null);

      // Count limit check
      const total = previewUrls.length + files.length;
      if (total > MAX_IMAGES) {
        setUploadError(
          `You can upload a maximum of ${MAX_IMAGES} images total.`
        );
        return;
      }

      const newPreviews: string[] = [];
      const newBlobs: Blob[] = [];

      for (const file of files) {
        const validationErr = validateImageFile(file);
        if (validationErr) {
          setUploadError(validationErr);
          continue;
        }

        try {
          const compressed = await compressImage(file);
          const url = URL.createObjectURL(compressed);
          newPreviews.push(url);
          newBlobs.push(compressed);
        } catch {
          setUploadError("Failed to process one of your images.");
        }
      }

      setPreviewUrls((prev) => [...prev, ...newPreviews]);
      setFileBlobs((prev) => [...prev, ...newBlobs]);
      e.target.value = ""; // reset input
    },
    [previewUrls.length, validateImageFile]
  );

  const removeImage = useCallback((index: number) => {
    // Revoke object URL to free memory
    URL.revokeObjectURL(previewUrls[index]);
    setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
    setFileBlobs((prev) => prev.filter((_, i) => i !== index));
  }, [previewUrls]);

  const updateField = useCallback(
    (key: keyof ItemFormData, value: string) => {
      setFormData((prev) => ({ ...prev, [key]: value }));
      setSubmitError(null);
      setUploadError(null);
    },
    []
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setUploadError(null);

    // Client-side Zod validation
    const parsed = itemSchema.safeParse(formData);
    if (!parsed.success) {
      setSubmitError(parsed.error.issues[0]?.message || "Invalid input");
      return;
    }

    // Must have at least one image (spec: up to 4 images - let's require at least 1 for a good listing)
    if (fileBlobs.length === 0) {
      setSubmitError("Please upload at least one image for your listing.");
      return;
    }

    startTransition(async () => {
      try {
        // Upload images to Supabase Storage
        const imageUrls: string[] = [];
        for (let i = 0; i < fileBlobs.length; i++) {
          const blob = fileBlobs[i];
          const fileExt = blob.type === "image/webp" ? "webp" : "jpg";
          const fileName = `${Date.now()}-${i}.${fileExt}`;
          const filePath = `item-images/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from("item-images")
            .upload(filePath, blob, {
              cacheControl: "3600",
              upsert: false,
            });

          if (uploadError) {
            throw new Error(uploadError.message);
          }

          const { data: urlData } = supabase.storage
            .from("item-images")
            .getPublicUrl(filePath);
          imageUrls.push(urlData.publicUrl);
        }

        // Create the item listing
        const { error: dbError } = await supabase.from("items").insert({
          donor_id: (await supabase.auth.getUser()).data.user?.id,
          title: formData.title,
          description: formData.description,
          category: formData.category,
          condition: formData.condition,
          city: formData.city,
          images: imageUrls,
          status: "Available",
        });

        if (dbError) throw new Error(dbError.message);

        setSubmitSuccess(true);
        // Revoke all blob URLs
        previewUrls.forEach((url) => URL.revokeObjectURL(url));
      } catch (err) {
        setSubmitError(err instanceof Error ? err.message : "Failed to create listing. Please try again.");
      }
    });
  };

  if (submitSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
        <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-10 text-center shadow-xl">
          <div className="w-20 h-20 rounded-2xl bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
            Listing Created!
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-8">
            Your item is now live on GiveLoop. Donors can find it and send requests.
          </p>
          <div className="flex flex-col gap-3">
            <Button
              onClick={() => router.push("/dashboard")}
              className="w-full py-3"
            >
              Go to My Dashboard
            </Button>
            <Button
              variant="outline"
              onClick={() => router.push("/")}
              className="w-full py-3"
            >
              Browse More Listings
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Donate an Item
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Share something you no longer need with someone who does. Free and
            simple.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Input
                  label="Item Title"
                  placeholder="e.g. Lenovo ThinkPad T480 Laptop"
                  value={formData.title}
                  onChange={(e) => updateField("title", e.target.value)}
                  error={
                    submitError?.includes("Title") ? submitError : undefined
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Input
                  label="Category"
                  value={formData.category}
                  onChange={(e) => updateField("category", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Input
                  label="Condition"
                  value={formData.condition}
                  onChange={(e) => updateField("condition", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2 lg:col-span-2">
                <Input
                  label="City"
                  placeholder="e.g. Bengaluru"
                  value={formData.city}
                  onChange={(e) => updateField("city", e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Description
                </label>
                <textarea
                  placeholder="Tell us about the item — condition, any marks, why you're giving it away..."
                  value={formData.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  required
                  minLength={10}
                  className="w-full rounded-lg border bg-white dark:bg-slate-900 px-3.5 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors focus:outline-none focus:ring-2 border-slate-300 dark:border-slate-700 focus:border-emerald-500 focus:ring-emerald-200 dark:focus:ring-emerald-950"
                />
                {submitError?.includes("Description") && (
                  <p className="text-xs text-rose-500 font-medium">{submitError}</p>
                )}
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Photos ({previewUrls.length}/{MAX_IMAGES})
              </h3>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Max {MAX_IMAGES} images • {MAX_FILE_SIZE_MB}MB each
              </span>
            </div>

            {uploadError && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{uploadError}</span>
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {previewUrls.map((url, idx) => (
                <div
                  key={idx}
                  className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800"
                >
                  <img src={url} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 dark:bg-slate-800/90 text-rose-500 hover:bg-rose-500 hover:text-white transition-colors"
                    aria-label="Remove image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {previewUrls.length < MAX_IMAGES && (
                <label
                  className="aspect-square rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/10 transition-colors"
                >
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/jpg"
                    multiple
                    onChange={handleImageChange}
                    className="sr-only"
                  />
                  <div className="flex flex-col items-center justify-center">
                    <ImageIcon className="w-6 h-6 text-slate-400 dark:text-slate-500" />
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Add Photo
                    </span>
                  </div>
                </label>
              )}
            </div>

            {fileBlobs.length > 0 && (
              <p className="text-xs text-slate-500 dark:text-slate-400 ml-1">
                {fileBlobs.length} image(s) ready to upload.
              </p>
            )}
          </div>

          {/* Error */}
          {submitError && (
            <div className="flex items-center gap-2 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span className="text-sm">{submitError}</span>
            </div>
          )}

          {/* Submit */}
          <Button
            type="submit"
            className="w-full py-3.5 text-lg font-semibold shadow-md shadow-emerald-600/20"
            disabled={isPending || fileBlobs.length === 0}
          >
            {isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                Creating Listing...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 mr-2" />
                Publish Giveaway
              </>
            )}
          </Button>
        </form>

        {/* Helper text */}
        <p className="mt-6 text-xs text-slate-500 dark:text-slate-400 text-center">
          Images are compressed before upload for faster loading. Your contact
          details stay private until a request is accepted.
        </p>
      </div>
    </div>
  );
}
