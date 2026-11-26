# Viva Notes: GiveLoop Project

## Architecture & Tech Stack
1. **Q: Why Next.js (App Router)?**
   - A: For better performance with Server Components, built-in SEO capabilities, and simpler routing architecture compared to pages router.

2. **Q: What is Supabase and why use it?**
   - A: A backend-as-a-service built on Postgres. It provides instant Auth, database, storage, and RLS without needing a custom Node.js server.

3. **Q: Explain the role of TypeScript.**
   - A: Provides static typing to catch errors during development, leading to cleaner, more maintainable code, essential for a full-stack app.

4. **Q: What is Tailwind CSS?**
   - A: A utility-first CSS framework that allows building responsive UIs quickly without leaving the HTML (JSX).

5. **Q: How are you managing environment variables?**
   - A: Using `.env.local` for local development (not committed) and Vercel's environment settings for production to keep secrets like Supabase service keys secure.

## Database & RLS
6. **Q: What is Row Level Security (RLS)?**
   - A: Database-level security policies that ensure users can only access rows they are authorized to see or modify, independent of the frontend application code.

7. **Q: How does RLS work in GiveLoop?**
   - A: We check `auth.uid()` against column values like `donor_id` or `requester_id` to permit operations on `items` or `item_requests` tables.

8. **Q: Why use Zod?**
   - A: It enforces runtime type-checking for form inputs on both client and server, preventing bad data from entering the database.

9. **Q: Explain the relationship between items and profiles.**
   - A: A one-to-many relationship: One `profile` (donor) can have many `items`. Linked via the `donor_id` foreign key.

10. **Q: How do you handle image storage?**
    - A: Using Supabase Storage buckets with RLS policies that restrict uploads to authenticated users and specific file types/sizes.

## Features & Flow
11. **Q: How does the request flow work?**
    - A: Requester submits a message -> row created in `item_requests` -> donor sees it on their dashboard -> donor clicks Accept -> `status` updates to 'Reserved' via Supabase RPC or update, revealing contact info.

12. **Q: How do you manage user authentication?**
    - A: Supabase Auth handles the complexity. It generates a JWT, which the middleware uses to protect routes and Supabase SDK verifies for DB access.

13. **Q: What is the purpose of the dashboard?**
    - A: It centralizes user interactions, allowing them to manage their donations and requests in one place, improving UX.

14. **Q: How do you handle "empty states"?**
    - A: By conditionally rendering messages or UI components when arrays returned from the database are empty, ensuring the user is never staring at a blank screen.

15. **Q: How are listings protected from spam?**
    - A: By requiring authentication for requests/reports and implementing server-side validation and database-level constraints.

## Quality & Security
16. **Q: What is the difference between client-side and server-side validation?**
    - A: Client-side provides instant UX feedback; server-side is the final security gate that *must* exist to prevent malicious bypass.

17. **Q: Why are skeletons used?**
    - A: They improve perceived performance by showing the structure of the page while data is still fetching, making the app feel faster.

18. **Q: What does SEO metadata do?**
    - A: It helps search engines understand the page content (title, description) and allows social platforms to generate nice previews (Open Graph tags).

19. **Q: How is dark mode implemented?**
    - A: Using Tailwind's `dark:` classes, toggled by updating a class or data-attribute on the `<html>` or `<body>` tag.

20. **Q: What tests are you using?**
    - A: Vitest for unit tests (functions, hooks) and Playwright for e2e tests (signing up, donating, requesting).

## Future Improvements & Viva Defense
21. **Q: What are the biggest security risks in this app?**
    - A: Exposing the service role key, misconfigured RLS policies, and XSS in user-submitted descriptions (handled by sanitization).

22. **Q: How would you scale this?**
    - A: Database indexing for search/filter performance, CDN for image serving, and potential migration to microservices if logic grows complex.

23. **Q: Why did you choose this tech stack?**
    - A: High development velocity (essential for a short deadline), strong typing, built-in security, and excellent community support.

24. **Q: What was the hardest part?**
    - A: Implementing RLS policies correctly to ensure users could only access their own specific request threads.

25. **Q: What would you do differently next time?**
    - A: Maybe start with a more robust state management library if the app grows, and implement real-time notifications via Supabase Realtime earlier.
