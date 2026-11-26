# GiveLoop - Project Prompt & Specification

You are a senior full-stack engineer and my mentor. I am a 2nd-year B.Tech CS&IT student, and I want to understand everything we build, so explain key decisions briefly as you go. This is a college project that will be graded with a demo and a viva, and it is also a portfolio project for recruiters.

## Project statement
Build "GiveLoop" (a placeholder name; suggest a better one if you have one), a free giveaway and donation platform where people give away clothes, old furniture, used textbooks and used laptops, and others can browse and request them.

## Tech stack
- Next.js (App Router) + TypeScript + Tailwind CSS
- Supabase: Auth (email + Google), Postgres, Storage (item images), Row Level Security
- Deploy to Vercel
- Zod for validation, Vitest for unit tests, Playwright for 2-3 key e2e tests

## Core features
1. Auth: sign up, log in, log out, protected routes, user profile (name, city, avatar)
2. Browse page: grid of item cards with search by keyword, filter by category (Clothes, Furniture, Textbooks, Laptops, Other), condition (Like new, Good, Fair), and city, plus sort by newest. Use pagination or infinite scroll.
3. Item detail page: image gallery, description, condition, location, donor info, status badge (Available / Reserved / Given)
4. Donate an item: form with title, description, category, condition, city, and up to 4 images (client-side preview, compression, size and type validation, upload to Supabase Storage)
5. Request flow: a logged-in user can send a request with a short message. The donor sees incoming requests in a dashboard and can accept or decline, and accepting marks the item Reserved. Contact details are revealed only after acceptance.
6. My Dashboard: my donations (edit, delete, mark as Given), my requests and their status
7. Report listing button and a simple admin-flag field in the database (no admin UI needed yet)
8. Responsive, mobile-first, accessible UI (semantic HTML, keyboard navigation, alt text, good contrast), with a dark mode toggle
9. Empty states, loading skeletons, and friendly error messages everywhere

## Security and quality requirements (non-negotiable)
- Enable Row Level Security on every table and write explicit policies: anyone can read available items, only owners can edit or delete their items, and only the donor and requester can see a request
- Never expose service-role keys. Use environment variables and provide a .env.example
- Validate all input on both client and server with Zod
- Storage rules: restrict file types and sizes, and allow uploads only for authenticated users
- Rate-limit or otherwise guard against spam in the request and report flows
- Don't reveal phone or email publicly

## Performance targets
- Lighthouse 90+ on Performance, Accessibility, Best Practices and SEO (mobile)
- Use next/image, lazy loading, and proper indexes on the database columns used for filtering and search
- Add SEO metadata and Open Graph tags so shared links look good on LinkedIn

## How to work
1. First, ask me any clarifying questions, then propose a short plan with the folder structure and database schema (tables, relationships, RLS policies) and wait for my approval.
2. Build in phases: (a) project setup and schema, (b) auth, (c) browse and detail, (d) donate form with upload, (e) request flow and dashboard, (f) polish, tests, Lighthouse fixes, deploy.
3. After each phase: run the app, run lint, typecheck and tests, fix errors, and tell me exactly how to verify it manually. Then make a git commit with a clear message.
4. Seed the database with 20-30 realistic sample items (use free placeholder images).
5. Explain each phase in simple terms before moving on, so I can defend the code in a viva.

## Course submission deliverables
- PROJECT_STATEMENT.md: a short statement covering the problem, objective, target users and scope
- FEATURES.md: the list of implemented features, matching exactly what is built
- PROMPT.md: a copy of this prompt
- TEST_CASES.md: exactly 20 test cases in a table (ID, feature, steps, expected result, actual result, Pass/Fail). Cover auth, validation, image upload limits, search and filters, request and accept flow, access control (RLS), report flow and dark mode. Leave "actual result" and "Pass/Fail" blank for me to fill in by manually testing every case.
- DEMO_SCRIPT.md: a 5-minute walkthrough of the full user flow
- VIVA_NOTES.md: 25 likely questions on architecture, database design, authentication, RLS and security, with simple answers
- README.md: project overview, screenshots placeholder, tech stack, features, setup steps, environment variables, database schema diagram, security decisions, and a "What I learned / future improvements" section (in-app chat, notifications, map view, admin panel)
- A LinkedIn post draft (under 150 words), only after the deploy works
