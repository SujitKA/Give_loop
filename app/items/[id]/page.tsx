import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getItemById } from "@/lib/data/items";
import { createClient } from "@/lib/supabase/server";
import { ItemDetailView } from "@/components/items/ItemDetailView";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const item = await getItemById(id);

  if (!item) {
    return {
      title: "Item Not Found | GiveLoop",
    };
  }

  return {
    title: `${item.title} (Free Giveaway in ${item.city}) | GiveLoop`,
    description: item.description.slice(0, 160),
    openGraph: {
      title: `${item.title} - Free on GiveLoop`,
      description: item.description.slice(0, 160),
      images: item.images.length > 0 ? [item.images[0]] : [],
    },
  };
}

export default async function ItemPage({ params }: PageProps) {
  const { id } = await params;
  const item = await getItemById(id);

  if (!item) {
    notFound();
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <ItemDetailView item={item} currentUserId={user?.id ?? null} />;
}
