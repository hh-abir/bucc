# BUCC Web Portal - Definitive Project Documentation

**Date:** June 15, 2026  
**Status:** v2 Advanced Rebuild / Feature Implementation Phase  

This document serves as the foundational technical guide for the BRAC University Computer Club (BUCC) Web Portal. It covers the full architectural stack, implementation details, and development standards.

---

## 1. Project Overview
The BUCC Web Portal is a comprehensive platform designed to manage club operations, showcase public activities (events, blogs, press releases), and provide an internal dashboard for members and leadership. It serves two primary audiences:
- **Public:** Prospective members, current students, and university faculty.
- **Internal:** Registered club members and the Governing Body.

### Design Mandate: Anthropic Minimalist
- **Visuals:** Monochrome-focused, sharp borders, high whitespace.
- **Typography:** Serif headings for authority, Sans-serif for data.
- **Interactivity:** Subtle transitions, grayscale-to-color hovers, no bouncy animations.

---

## 2. Technical Stack

### Core Frameworks
- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Turbopack).
- **Library:** [React 19](https://react.dev/).
- **Language:** TypeScript (Strict Mode).

### Data & Persistence
- **Database:** MongoDB.
- **ORM/ODM:** [Mongoose](https://mongoosejs.com/) (Master ODM for structured models).
- **Direct Driver:** `mongodb` (primarily for Better Auth adapter integration).

### Authentication & Authorization
- **Auth Provider:** [Better Auth](https://better-auth.com/) with MongoDB Adapter.
- **Data Unity:** Mongoose `User` model and Better Auth both target the singular **`user`** collection.
- **Authorization:** Role-Based Access Control (RBAC) defined in `src/lib/permissions.ts`.

### Styling & UI
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) (Anthropic Minimalist Design).
- **Theming:** `next-themes` (v0.4.4+ for React 19 compatibility).
- **Animations:** [Framer Motion](https://www.framer.com/motion/).
- **Icons:** [Lucide React](https://lucide.dev/).
- **Components:** Radix UI primitives and custom-built minimalist components (e.g., `MultipleSelector`).

### Infrastructure & Tools
- **Media Storage:** [Cloudinary](https://cloudinary.com/).
- **Form Handling:** TanStack Form & Zod.
- **Data Fetching:** TanStack Query (React Query) v5.
- **Logging:** Local `debug.log` and standard console streams.

---

## 3. Directory Structure

```text
C:\Users\Abir\Desktop\bucc\
├── public/                # Static assets
│   ├── assets/            # Official SVGs (bucc-logo.svg, bucc-icon.svg)
│   └── images/            # Department, events, and people photos
├── src/
│   ├── app/               # Next.js App Router (Routing & Pages)
│   │   ├── (main)/        # Public routes (Homepage, Blogs, Events, Publications)
│   │   ├── (portal)/      # Internal dashboard (Members, Broadcast, Manage Data)
│   │   └── api/           # Backend API handlers (Config, Auth, Member)
│   ├── components/        # Reusable UI components
│   │   ├── ui/            # Basic primitives & Announcement Bar
│   │   ├── portal/        # Dashboard specific modules (Profile, Broadcast)
│   │   └── home/          # Public landing page sections
│   ├── constants/         # Static data (Executive Body, Skills, Departments)
│   ├── helpers/           # Utility functions (Mailer, Config Store)
│   ├── lib/               # Core configurations (Auth, DB, Permissions)
│   ├── model/             # Mongoose schemas (User, GlobalBanner, Event, etc.)
│   ├── schemas/           # Zod validation schemas
│   ├── types/             # Global TypeScript definitions
│   └── util/              # Shared providers and context wrappers
├── next.config.mjs        # Next.js configuration
├── tailwind.config.ts     # Tailwind theme and plugin setup
└── package.json           # Dependencies and scripts
```

---

## 4. Core Architecture

### Database (MongoDB + Mongoose)
- **Connection:** Handled via `src/lib/dbConnect.ts` with connection pooling and graceful shutdown.
- **The "One Source of Truth" Model:** We have unified Member Profiles and Authentication into the singular **`user`** collection.
  - **System Managed:** Name, Email (G-Suite), Student ID, BUCC Department, Designation.
  - **Personal Details:** Phone, Personal Email, Emergency Contact, Blood Group, Socials, Skills.
  - **Auth Integration:** Mirrored Better Auth schema with 15+ custom BUCC fields.

### Recruitment Gatekeeper System
- **Master Config:** `AppConfig` model manages `isRegistrationOpen` and `isEvaluationOpen` states.
- **Server-Side Gating:** All recruitment POST APIs verify gating status before processing.
- **Public Placeholders:** `IntakeInactive` component displays custom closure messages and live countdown timers.

### Hierarchical Access Control (RBAC)
- **Logic:** Centralized in `src/lib/permissions.ts`.
- **Governing Body (GB):** Global visibility. Access to Data Hub, Global Alerts, and Recruitment Toggles.
- **Directors/ADs:** Departmental silos. Manage members within their own department.
- **EB (Senior/Executive):** Access to internal Announcements and PR tools.
- **General Member:** Access to personal profile and ID card.

---

## 5. Feature Implementation Details

### Communications Command Center
- **Broadcast Center (`/dashboard/broadcast`):** Unified portal for administrative alerts.
  - **Global Announcement Bar:** GB-controlled inverted-color banner (`bg-foreground text-background`) at the top of all public pages. Supports session-aware dismissal.
  - **Member Notices:** Real-time internal broadcasting with history management and GB delete powers.
  - **Recruitment Pulse:** Real-time toggles for Registration and Evaluation with customizable countdowns.

### Official Branding Logic
- **Theme Awareness:** Uses `dark:invert dark:hue-rotate-180` to preserve the official **BUCC Blue** color in dark mode while ensuring high-contrast visibility.
- **Asset Distribution:** 
  - **Full Logo:** Used in public Navbar for authority.
  - **Icon:** Used in Sidebar and recruitment placeholders for professional minimalism.

### Public Events Hub
- **Categorization:** Automatically splits events into **Upcoming** (High visibility, Color) and **Past Archive** (Grid-based, Grayscale) based on live clock data.
- **Sorting:** Upcoming (Soonest first), Past (Most recent first).
- **Asset Uploads:** Event forms support direct file uploads (via Cloudinary) alongside URL embedding. Whitelists ImgBB and Imgur domains for secure remote rendering.
- **Organizer Workflow:** Supports custom attendance tracking requirements (`needAttendance`) and internal coordinator guidelines (`notes`) displayed directly on admin cards.

### Profile & Settings
- **Strict Data Gating:** Official records (Name, ID, Dept, Join Dates) are **Read-Only** for members to maintain data integrity.
- **Input Refetch Fix:** Verifies state presence (`if (user && !formData)`) before populating inputs to block background session refreshes from overwriting unsaved inputs.
- **Structured Fields:** Converts the free-text Gender input to a structured select dropdown (Male, Female, Other).
- **Photo Workflow:** "Select -> Preview -> Confirm & Save" sequence integrated with Cloudinary via internal upload APIs.

### Public Pages & Presentation
- **Hero Section:** Dynamically configurable from the dashboard. Overlaps with an **Auto-hide Navbar** (glassmorphism effect in both themes) for an immersive full-screen experience.
- **Project Showcase (`/projects`):** A high-end gallery for member projects. Features a cinematic detail view utilizing read-only `BlockNote` for rich case studies and strict external-link validation for assets.
- **Publications (`/blogs`, `/publications/press-releases`):** Premium, card-based grids with split-layout detail pages (Cover image top, Title/Content left, Summary/Related right).
- **About BUCC (`/about`, `/history`, `/advisors`):** Comprehensive public documentation of the club's 2001 legacy, core values, mission, structured ecosystem, and faculty leadership.
- **Contact & FAQ (`/contact`, `/faq`):** Interactive contact form linking directly to the backend Inquiry system. Animated accordion FAQ page built with `framer-motion`.

### Internal Operations & Management
- **Inquiry Management (`/dashboard/inquiries`):** Secure dashboard for GB, HR, and R&D to read, archive, and delete messages submitted via the public contact form.
- **Project Moderation (`/dashboard/projects`):** Dual-path system. Members can submit projects (`pending`). Admins (GB, HR, R&D) can review, edit, approve, or directly add new projects to the public gallery. Includes live-preview capability for external image URLs. Enables R&D leaders (`isSuper`) to delete projects from the requests registry, and provides a direct "Delete Project" button on the Edit page for authors/admins.
- **Visual Identity Config (`/dashboard/broadcast/hero-config`):** GB and R&D can manage the homepage Hero Carousel slides via a drag-and-drop interface, updating the public site in real-time.
- **System Metrics & Charts:** Member Demographics are displayed as a horizontal bar breakdown (replacing the buggy SVG donut chart). Excludes Governing Body members from active metrics, groups non-Governing-Body Alumni together under a unified `"Alumni"` segment, and lists specific sub-statistics.

---

## 6. Legacy Removal & Migration Notes
- **MemberInfo & UserAuth:** Purged and merged into the unified `User` model.
- **Attendee/Interviewee Tracking:** Completely removed from Model, API, and UI per user request.
- **Redis & Drizzle:** Completely removed in favor of MongoDB/Mongoose.
- **Old AI (Nimbus+):** Disabled (410 Gone).

---

## 7. Development Guidelines
- **Security:** Always verify `isGoverningBody` for data-sensitive operations.
- **UI/UX:** Always prioritize whitespace and typography. Apply hue-preserving inversion for brand assets.
- **Next.js 16:** Always use `await params` in server components and API handlers.
- **Integrity:** Every recruitment-related POST handler MUST check the `AppConfig` gating status.

---

## 8. Maintenance & Pending Work
1. **Static Pages:** Finalize History, Alumni, and Gallery content.
2. **SEO Audit:** Complete for v2 public launch.
3. **Legacy Clean-up:** Final removal of any remaining `MemberInfo` references in legacy helpers.
4. **Member Approvals:** Refine the GB approval dashboard for new registrations.
