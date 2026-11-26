# Demo Script: GiveLoop (5 minutes)

## 0:00 - 0:30: Introduction
- **Goal:** Set the context.
- **Script:** "Hello, this is GiveLoop, a community-driven platform designed to reduce waste by connecting people who have usable items to donate with those in need. It's built for students, but it's designed to scale. The core idea is circular economy: giving old clothes, textbooks, or laptops a second life."

## 0:30 - 1:30: Browse & Search
- **Goal:** Demonstrate core UX.
- **Action:**
    1. Show the homepage with item cards (use sample data).
    2. Type "laptop" in the search bar.
    3. Filter by category "Laptops" and City "Bengaluru".
- **Script:** "Here's the browse page. We've implemented search and filtering to make it easy to find what you need. Notice how fast it is—we're using lazy loading and Next.js server components for performance."

## 1:30 - 2:30: Item Detail & Request
- **Goal:** Show interaction flow.
- **Action:**
    1. Click on a laptop item to see the detail page.
    2. Show the image gallery and condition badge.
    3. Click "Request Item," enter a message, and submit.
- **Script:** "On the detail page, you get all the info about the item's condition and the donor. If I'm interested, I can request it directly. This request is sent securely, and the donor is notified."

## 2:30 - 3:30: Donor Dashboard (Accepting Request)
- **Goal:** Show backend/auth logic.
- **Action:**
    1. Switch to "My Dashboard" (as the donor).
    2. Show the pending request.
    3. Click "Accept."
    4. Show the item status change to "Reserved" and contact info appear.
- **Script:** "As the donor, I can manage my requests in the dashboard. When I accept a request, the item's status automatically updates to 'Reserved' so no one else requests it, and the requester gets my contact details."

## 3:30 - 4:30: Donate Flow
- **Goal:** Show creation logic.
- **Action:**
    1. Navigate to "Donate."
    2. Fill in title, description, and upload sample images.
    3. Submit.
- **Script:** "Donating is just as easy. The form includes validation to ensure we get good descriptions and clear images. We use Zod on both client and server to keep data clean, and images are stored securely via Supabase."

## 4:30 - 5:00: Wrap-up & Viva Defense
- **Goal:** Final impression.
- **Script:** "GiveLoop balances usability with strict security. We've used RLS to protect user data and ensured everything is responsive. This project was a great dive into full-stack development and security best practices."
