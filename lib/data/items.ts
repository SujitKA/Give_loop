import { createClient } from "@/lib/supabase/server";
import { SAMPLE_ITEMS } from "@/lib/sample-data";
import type { Item } from "@/types/database";

export interface ItemFilters {
  category?: string;
  condition?: string;
  city?: string;
  q?: string;
  sort?: "newest" | "oldest";
}

export async function getItems(filters: ItemFilters = {}): Promise<Item[]> {
  try {
    const supabase = await createClient();

    let query = supabase
      .from("items")
      .select("*, donor:profiles(*)");

    if (filters.category && filters.category !== "all") {
      query = query.eq("category", filters.category);
    }

    if (filters.condition && filters.condition !== "all") {
      query = query.eq("condition", filters.condition);
    }

    if (filters.city && filters.city !== "all") {
      query = query.eq("city", filters.city);
    }

    if (filters.q) {
      const searchTerm = filters.q.trim();
      query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
    }

    const isAscending = filters.sort === "oldest";
    query = query.order("created_at", { ascending: isAscending });

    const { data, error } = await query;

    if (!error && data && data.length > 0) {
      return data as Item[];
    }
  } catch {
    // If Supabase fetch fails (e.g. offline dev or unseeded db), proceed to fallback
  }

  // Graceful fallback: Filter sample data in-memory
  let result = [...SAMPLE_ITEMS];

  if (filters.category && filters.category !== "all") {
    result = result.filter(
      (item) => item.category.toLowerCase() === filters.category?.toLowerCase()
    );
  }

  if (filters.condition && filters.condition !== "all") {
    result = result.filter(
      (item) => item.condition.toLowerCase() === filters.condition?.toLowerCase()
    );
  }

  if (filters.city && filters.city !== "all") {
    result = result.filter(
      (item) => item.city.toLowerCase() === filters.city?.toLowerCase()
    );
  }

  if (filters.q) {
    const queryLower = filters.q.toLowerCase();
    result = result.filter(
      (item) =>
        item.title.toLowerCase().includes(queryLower) ||
        item.description.toLowerCase().includes(queryLower)
    );
  }

  if (filters.sort === "oldest") {
    result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  } else {
    result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  return result;
}

export async function getItemById(id: string): Promise<Item | null> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("items")
      .select("*, donor:profiles(*)")
      .eq("id", id)
      .single();

    if (!error && data) {
      return data as Item;
    }
  } catch {
    // Fallback
  }

  return SAMPLE_ITEMS.find((item) => item.id === id) || null;
}
