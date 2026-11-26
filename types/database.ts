export type ItemCategory =
  | "Clothes"
  | "Furniture"
  | "Textbooks"
  | "Laptops"
  | "Other";

export type ItemCondition = "Like new" | "Good" | "Fair";

export type ItemStatus = "Available" | "Reserved" | "Given";

export type RequestStatus = "Pending" | "Accepted" | "Declined";

export interface Profile {
  id: string;
  full_name: string;
  city: string;
  avatar_url?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface Item {
  id: string;
  donor_id: string;
  title: string;
  description: string;
  category: ItemCategory;
  condition: ItemCondition;
  city: string;
  images: string[];
  status: ItemStatus;
  is_reported: boolean;
  created_at: string;
  updated_at: string;
  // Optional joined profile
  donor?: Profile;
}

export interface ItemRequest {
  id: string;
  item_id: string;
  requester_id: string;
  message: string;
  status: RequestStatus;
  created_at: string;
  updated_at: string;
  // Optional joined item & profile
  item?: Item;
  requester?: Profile;
}

export interface Report {
  id: string;
  item_id: string;
  reporter_id: string;
  reason: string;
  created_at: string;
}
