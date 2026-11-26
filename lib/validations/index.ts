import { z } from "zod";

export const CATEGORIES = [
  "Clothes",
  "Furniture",
  "Textbooks",
  "Laptops",
  "Other",
] as const;

export const CONDITIONS = ["Like new", "Good", "Fair"] as const;

export const ITEM_STATUSES = ["Available", "Reserved", "Given"] as const;

export const REQUEST_STATUSES = ["Pending", "Accepted", "Declined"] as const;

export const itemSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title cannot exceed 100 characters"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description cannot exceed 2000 characters"),
  category: z.enum(CATEGORIES, {
    message: "Please select a valid category",
  }),
  condition: z.enum(CONDITIONS, {
    message: "Please select a valid condition",
  }),
  city: z
    .string()
    .min(2, "City name must be at least 2 characters")
    .max(50, "City name cannot exceed 50 characters"),
  images: z
    .array(z.string().url("Invalid image URL"))
    .max(4, "You can upload a maximum of 4 images")
    .default([]),
});

export type ItemFormData = z.infer<typeof itemSchema>;

export const requestSchema = z.object({
  message: z
    .string()
    .min(10, "Message must be at least 10 characters so the donor knows your situation")
    .max(500, "Message cannot exceed 500 characters"),
});

export type RequestFormData = z.infer<typeof requestSchema>;

export const reportSchema = z.object({
  reason: z
    .string()
    .min(10, "Please provide at least 10 characters explaining the issue")
    .max(500, "Reason cannot exceed 500 characters"),
});

export type ReportFormData = z.infer<typeof reportSchema>;

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const signupSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  city: z.string().min(2, "City must be at least 2 characters"),
  phone: z
    .string()
    .regex(/^[0-9+\-\s()]{7,20}$/, "Please enter a valid phone number")
    .optional()
    .or(z.literal("")),
});

export type SignupFormData = z.infer<typeof signupSchema>;
