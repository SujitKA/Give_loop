# Features: GiveLoop

## Implemented Features (Phase 1 Scope)

### Authentication
- **User Account Management:** Secure email + password and Google OAuth login.
- **Protected Routes:** Ensures sensitive actions (donating, requesting, dashboard management) are accessible only to authenticated users.
- **User Profiles:** Basic user information including name, city, and avatar.

### Item Management
- **Browse Page:** Grid view of items with keyword search, category filtering (Clothes, Furniture, Textbooks, Laptops, Other), condition filtering (Like new, Good, Fair), and city-based search. Sorted by newest.
- **Item Detail Page:** Comprehensive item view including image gallery, description, condition, location, donor details, and current status (Available / Reserved / Given).
- **Donate Flow:** User-friendly form to list items with title, description, category, condition, location, and photo uploads. Includes client-side image preview, validation, and compression.

### Request & Interaction Flow
- **Request Mechanism:** Logged-in users can send a request message to a donor for a specific item.
- **Donor Dashboard:** View incoming requests for listed items with the ability to Accept or Decline.
- **Status Tracking:** Accepting a request automatically transitions the item to "Reserved." Contact details are only revealed to the requester upon acceptance.
- **My Dashboard:** Dedicated space for donors to manage their listings (Edit/Delete/Mark as Given) and for requesters to track their active requests.

### Safety & Administration
- **Report System:** Users can report inappropriate listings.
- **Access Control:** Enforced via Row Level Security (RLS) to ensure data privacy (e.g., only donor and requester see conversation/contact details).
