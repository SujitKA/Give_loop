import type { Item } from "@/types/database";

export const SAMPLE_ITEMS: Item[] = [
  {
    id: "a1111111-1111-1111-1111-111111111111",
    donor_id: "11111111-1111-1111-1111-111111111111",
    title: "Lenovo ThinkPad T480 (Core i5, 16GB RAM, 256GB SSD)",
    description:
      "Upgraded to a work laptop so giving this away. Fully functional ThinkPad with Linux Mint installed. Excellent battery life, charger included. Great for coding, web development, and college projects.",
    category: "Laptops",
    condition: "Good",
    city: "Bengaluru",
    images: [
      "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
    ],
    status: "Available",
    is_reported: false,
    created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    donor: {
      id: "11111111-1111-1111-1111-111111111111",
      full_name: "Aravind Sharma",
      city: "Bengaluru",
      avatar_url:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80",
      phone: "+91 98765 43210",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
  {
    id: "a2222222-2222-2222-2222-222222222222",
    donor_id: "22222222-2222-2222-2222-222222222222",
    title: "CLRS Introduction to Algorithms (4th Edition)",
    description:
      "Hardcover edition of Cormen, Leiserson, Rivest, and Stein. Finished my Algorithms coursework. No pencil markings inside, spine is intact like new. Ideal for 2nd or 3rd year CS students or GATE prep.",
    category: "Textbooks",
    condition: "Like new",
    city: "Bengaluru",
    images: [
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80",
    ],
    status: "Available",
    is_reported: false,
    created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    donor: {
      id: "22222222-2222-2222-2222-222222222222",
      full_name: "Priya Nair",
      city: "Bengaluru",
      avatar_url:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80",
      phone: "+91 98450 12345",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
  {
    id: "a3333333-3333-3333-3333-333333333333",
    donor_id: "11111111-1111-1111-1111-111111111111",
    title: "Ergonomic Mesh Study Chair with Adjustable Lumbar",
    description:
      "Giving away my ergonomic desk chair because I am relocating. Breathable mesh backrest, hydraulic height adjustment works smoothly, solid 5-wheel base. Clean and sanitized.",
    category: "Furniture",
    condition: "Good",
    city: "Bengaluru",
    images: [
      "https://images.unsplash.com/photo-1580481077195-c328a37db719?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=800&q=80",
    ],
    status: "Available",
    is_reported: false,
    created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    donor: {
      id: "11111111-1111-1111-1111-111111111111",
      full_name: "Aravind Sharma",
      city: "Bengaluru",
      avatar_url:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80",
      phone: "+91 98765 43210",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
  {
    id: "a4444444-4444-4444-4444-444444444444",
    donor_id: "44444444-4444-4444-4444-444444444444",
    title: "Men's Winter Puffer Down Jacket (Size L, Navy Blue)",
    description:
      "Very warm insulated puffer jacket, worn only during one trip to Himachal. Water-resistant outer shell with detachable hood. Freshly dry-cleaned.",
    category: "Clothes",
    condition: "Like new",
    city: "Delhi",
    images: [
      "https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&w=800&q=80",
    ],
    status: "Available",
    is_reported: false,
    created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    donor: {
      id: "44444444-4444-4444-4444-444444444444",
      full_name: "Sneha Patel",
      city: "Delhi",
      avatar_url:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&h=200&q=80",
      phone: "+91 99887 76655",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
  {
    id: "a5555555-5555-5555-5555-555555555555",
    donor_id: "33333333-3333-3333-3333-333333333333",
    title: "Acer 24-inch Full HD IPS Borderless Monitor",
    description:
      "75Hz refresh rate with HDMI and VGA ports. No dead pixels or scratches. Includes original power adapter and HDMI cable. Perfect dual monitor setup for students.",
    category: "Laptops",
    condition: "Like new",
    city: "Mumbai",
    images: [
      "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80",
    ],
    status: "Available",
    is_reported: false,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    donor: {
      id: "33333333-3333-3333-3333-333333333333",
      full_name: "Rohan Verma",
      city: "Mumbai",
      avatar_url:
        "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&h=200&q=80",
      phone: "+91 91234 56789",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
  {
    id: "a6666666-6666-6666-6666-666666666666",
    donor_id: "11111111-1111-1111-1111-111111111111",
    title: "Operating System Concepts (10th Dinosaur Edition)",
    description:
      "Silberschatz, Galvin, and Gagne. Complete textbook covering process synchronization, memory management, and file systems. Helpful for university exams and technical interviews.",
    category: "Textbooks",
    condition: "Good",
    city: "Bengaluru",
    images: [
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80",
    ],
    status: "Available",
    is_reported: false,
    created_at: new Date(Date.now() - 27 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    donor: {
      id: "11111111-1111-1111-1111-111111111111",
      full_name: "Aravind Sharma",
      city: "Bengaluru",
      avatar_url:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80",
      phone: "+91 98765 43210",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
  {
    id: "a7777777-7777-7777-7777-777777777777",
    donor_id: "22222222-2222-2222-2222-222222222222",
    title: "Minimalist Wooden Study Desk (120cm x 60cm)",
    description:
      "Sturdy engineered wood study desk with black metal legs. Fits two monitors and a laptop easily. Minor cosmetic scuffs on one corner, otherwise rock solid.",
    category: "Furniture",
    condition: "Good",
    city: "Bengaluru",
    images: [
      "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80",
    ],
    status: "Available",
    is_reported: false,
    created_at: new Date(Date.now() - 30 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    donor: {
      id: "22222222-2222-2222-2222-222222222222",
      full_name: "Priya Nair",
      city: "Bengaluru",
      avatar_url:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&h=200&q=80",
      phone: "+91 98450 12345",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
  {
    id: "a8888888-8888-8888-8888-888888888888",
    donor_id: "33333333-3333-3333-3333-333333333333",
    title: "Classic Levi's Denim Jacket (Unisex, Size M)",
    description:
      "Authentic blue denim jacket. Very durable, clean, washed and sanitized. No tears or stains. Free to anyone who will make good use of it.",
    category: "Clothes",
    condition: "Good",
    city: "Mumbai",
    images: [
      "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=800&q=80",
    ],
    status: "Available",
    is_reported: false,
    created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString(),
    donor: {
      id: "33333333-3333-3333-3333-333333333333",
      full_name: "Rohan Verma",
      city: "Mumbai",
      avatar_url:
        "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&h=200&q=80",
      phone: "+91 91234 56789",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  },
];
