"use server";

import { createClient } from "@/lib/supabase/server";
import { requestSchema, reportSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export interface RequestActionResult {
  error?: string;
  success?: boolean;
}

export async function createItemRequestAction(
  prevState: RequestActionResult | null,
  formData: FormData
): Promise<RequestActionResult> {
  const itemId = formData.get("itemId") as string;
  const message = formData.get("message") as string;

  const validation = requestSchema.safeParse({ message });
  if (!validation.success) {
    return { error: validation.error.issues[0]?.message || "Invalid request message" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in to request an item" };
  }

  // Check if item exists and user is not donor
  const { data: item } = await supabase
    .from("items")
    .select("donor_id, status")
    .eq("id", itemId)
    .single();

  if (item && item.donor_id === user.id) {
    return { error: "You cannot request your own donation" };
  }

  if (item && item.status !== "Available") {
    return { error: "This item is no longer available" };
  }

  // Insert request
  const { error } = await supabase.from("item_requests").insert({
    item_id: itemId,
    requester_id: user.id,
    message: message.trim(),
    status: "Pending",
  });

  if (error) {
    if (error.code === "23505") {
      return { error: "You have already sent a request for this item" };
    }
    return { error: error.message };
  }

  revalidatePath(`/items/${itemId}`);
  revalidatePath("/dashboard");
  return { success: true };
}

export async function createReportAction(
  prevState: RequestActionResult | null,
  formData: FormData
): Promise<RequestActionResult> {
  const itemId = formData.get("itemId") as string;
  const reason = formData.get("reason") as string;

  const validation = reportSchema.safeParse({ reason });
  if (!validation.success) {
    return { error: validation.error.issues[0]?.message || "Invalid report reason" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "You must be signed in to submit a report" };
  }

  const { error } = await supabase.from("reports").insert({
    item_id: itemId,
    reporter_id: user.id,
    reason: reason.trim(),
  });

  if (error) {
    if (error.code === "23505") {
      return { error: "You have already reported this listing" };
    }
    return { error: error.message };
  }

  revalidatePath(`/items/${itemId}`);
  return { success: true };
}
