# Bucc Portal Modification Log - Last Agent Summary

This document outlines all features, security refactoring, database schemas, and interface designs implemented during this session to extend and beautify the BRACU Computer Club (BUCC) portal.

---

## 1. Recruitment Tasks Pipeline
*   **Evaluation Schema Upgrade ([EvaluationData.ts](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/model/EvaluationData.ts)):**
    Extended the schema with an `assignedTasks` array containing:
    ```typescript
    assignedTasks: [
      {
        department: String,
        title: String,
        description: mongoose.Schema.Types.Mixed, // Supports BlockNote rich-text
        status: "pending" | "submitted",
        driveLink: String,
        githubLink: String,
        submittedAt: Date
      }
    ]
    ```
*   **Default Presets Management ([broadcast/page.tsx](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/app/%28portal%29/dashboard/broadcast/page.tsx)):**
    Superadmins can configure 2 default tasks per department, saved dynamically inside the `recruitment_default_tasks` key in MongoDB.
*   **Task Assignment Workspace Dialog ([evaluation-assessment.tsx](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/app/%28portal%29/dashboard/recruitment/%5BevaluationID%5D/evaluation-assessment.tsx)):**
    Replaced the cramped sidebar assignment inputs with a spacious **Dialog Modal**. It features:
    *   Department filters.
    *   Quick-select buttons for default task presets.
    *   **BlockNoteEditor** rich-text input to construct detailed instructions.
*   **Public Tasks Portal ([tasks/page.tsx](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/app/%28main%29/tasks/page.tsx)):**
    Built a secure public panel at `/tasks` where candidates:
    1.  Verify using Student ID + Phone Number.
    2.  Read instructions using a read-only instance of `BlockNoteEditor`.
    3.  Submit solutions with mandatory Google Drive link validation.
*   **Access Gating:**
    Restricted task solution visibility so reviewers only see solutions belonging to their respective department (Governing Body and R&D retain overall oversight).

---

## 2. Access Control & Permissions Refactoring
*   **Dynamic Senior Executive (SE) Access:**
    *   Modified the HOC authorization wrapper ([withAuthorization.tsx](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/util/withAuthorization.tsx)) and backend endpoints (`/api/preregmembers/` and `/api/evaluation/all`) to dynamically append `Senior Executive` roles if `allowSERecruitmentAccess` is toggled ON in the Broadcast Center.
*   **Superadmin & Press Release Access Rules:**
    *   Refactored the Press Release dashboard management page, creation/edit routes, and API handlers (`GET`, `POST`, `PATCH`, `DELETE` under `/api/press-releases`) to recognize the global `isSuperUser(user)` helper (granting R&D Leadership equal superadmin privileges to the Governing Body).
    *   Implemented the PR department pipeline:
        *   PR Senior Executives can access the page, view drafts, and create new releases.
        *   SE submissions are saved as `pending approval`.
        *   Only **Superadmins** or **PR Directors/Assistant Directors** can approve and publish the pending releases.

---

## 3. Dashboard Visual Excellence
*   **Analytics Stats Panel ([EvaluationStats.tsx](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/app/%28portal%29/dashboard/recruitment/EvaluationStats.tsx)):**
    Overhauled metrics with a tabbed overall status grid (Submitted, Accepted, Pending, Rejected) showing dynamic percentages and a horizontal progress bar breakdown of candidate shares per department.
*   **Details Workspace Overhaul ([page.tsx](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/app/%28portal%29/dashboard/recruitment/%5BevaluationID%5D/page.tsx)):**
    *   Added back-navigation links.
    *   Reorganized candidate responses into separate rounded Card panels.
    *   Created a Candidate Profile card displaying Student ID, Email, Phone, and Dates next to modern copyable SVG contact icons.
*   **Comments Maximize Dialog:**
    Converted the admin comments textarea inside the assessment sidebar to a compact `120px` scrollable preview box. Tapping the expand icon opens a large, dedicated rich-text Dialog modal that auto-syncs edits back inline.

---

## 4. Data Management & Traffic Analytics
*   **Wipe Recruitment Data ([manage-data/page.tsx](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/app/%28portal%29/dashboard/manage-data/page.tsx)):**
    Created a destructive admin block to drop all candidate registrations and evaluations on typing `recruitment_all`.
*   **Site Traffic Logging:**
    *   Created the **`VisitorLog` Schema ([VisitorLog.ts](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/model/VisitorLog.ts))** storing views, unique visitor counts, and a daily IP list.
    *   Created the tracking endpoint (`/api/analytics/track`) and integrated the client-side trigger **`AnalyticsTracker`** inside the main page layout ([layout.tsx](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/app/%28main%29/layout.tsx)) to record visits on landing.
*   **Analytics Landing Tab:**
    Added an **Analytics & Insights** landing view inside the Data Management Center:
    *   Displays cards for total members, pre-registrations, visitor inquiries, and estimated traffic.
    *   **Member Demographics:** Renders a custom-calculated SVG Donut chart displaying the distribution of members by department.
    *   **Website Traffic:** Renders an SVG Line/Area chart plotting page views and unique visitors with filters to toggle between **Daily**, **Monthly**, and **Yearly** views.

---

## 5. Compatibility & Structural Fixes
*   **CSS Stacking Portals ([dialog.tsx](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/components/ui/dialog.tsx)):**
    Wrapped `DialogContent` with React `createPortal` targeting `document.body` to resolve z-index bugs causing modals to open behind sticky sidebars or headers.
*   **Hiding BlockNote Upload Tab ([BlockNoteEditor.tsx](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/components/BlockNoteEditor.tsx)):**
    Injected CSS overrides to hide the "Upload Image" panel inside the media block toolbar, ensuring users can only import images via the "Embed Image" (URL) input.
*   **Compilation & Type Resolution:**
    Fixed TypeScript parameter type warnings (implicitly typed `any` variables) and JSX syntax brace mismatches.

---

## 6. Dashboard Settings, Events & Demographics (July 1 - 3, 2026)
*   **Profile Form Refetch Defenses:**
    *   Updated the `useEffect` hooks in both settings forms ([EditProfile.tsx](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/components/portal/settings/EditProfile.tsx) and [PublicProfileSettings.tsx](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/components/portal/settings/PublicProfileSettings.tsx)) to guard state population with `if (user && !formData)`. This stops Next-Auth background session refreshes from overwriting active text inputs while users are typing.
    *   Converted the free-text Gender input field to a styled dropdown `<select>` component (Male, Female, Other).
*   **Advanced Event Management Features:**
    *   Modified the Create/Edit Event form to include an **Attendance Tracking** toggle (`needAttendance`) and an **Organizer Notes (Internal)** text area (`notes`), displaying them on the admin moderation cards.
    *   Created dual-handling for Featured Images allowing both file uploads and URL embeds. Whitelists ImgBB (`*.ibb.co`, `ibb.co`) and Imgur (`*.imgur.com`, `imgur.com`) inside [next.config.mjs](file:///C:/Users/Abir/Desktop/bucc-clean-history/next.config.mjs).
*   **Expansion of Project Deletions:**
    *   Modified the request listing validation to allow R&D admins (`isSuper`) to delete projects.
    *   Added a red "Delete Project" button at the top of the project edit page so project authors and admins can delete projects while editing.
*   **Cleaned Demographics & Traffic Analytics:**
    *   Substituted the buggy SVG donut chart for a responsive **Horizontal Bar Breakdown** (`DepartmentBreakdown`) component on the Data Hub page.
    *   Excluded Governing Body members from active demographics metrics.
    *   Grouped non-Governing-Body Alumni together under a unified `"Alumni"` segment in the chart and added an Alumni sub-statistic indicator.
    *   Fixed a TypeScript compilation error in `src/app/api/analytics/track/route.ts` where `NextRequest` lacked definition for the `request.ip` parameter.
 
---
 
## 7. Collapsible Sidebar, Preloader Screen, and Public Settings UI Re-architecture (July 3 - 6, 2026)
*   **Collapsible Sidebar Layout ([Sidebar.tsx](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/components/Sidebar.tsx) and [layout.tsx](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/app/%28portal%29/layout.tsx)):**
    *   Added a desktop-collapse toggle (`ChevronLeft` / `ChevronRight`) in the sidebar header next to the branding text.
    *   Adjusts width from `w-64` (expanded) to `w-16` (collapsed) smoothly.
    *   Hides navigation labels, centers icons, and auto-expands on sub-menu clicks, rendering tooltips for hovered items in the collapsed state.
*   **Desktop Header Alignment ([layout.tsx](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/app/%28portal%29/layout.tsx)):**
    *   Added `ml-auto` to the user profile and theme container in the header, aligning user details to the right on desktop layouts.
*   **Public Settings Tabbed UI ([PublicProfileSettings.tsx](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/components/portal/settings/PublicProfileSettings.tsx)):**
    *   Redesigned the single stacked settings form into a tabbed layout containing:
        1. **Basic Info**: URL slugs, Cover Photo uploads, resume links, job designations, and biographies.
        2. **Rich Content (Markdown)**: Scrollable textareas for experience, activity, education, achievements, and certifications.
        3. **Visibility Controls**: Grid of interactive privacy checkboxes and a master switch to toggle profile activation.
    *   Resolved typing errors with `DialogTrigger` and verified compiler compatibility.
*   **Destructive Data Wipe Trim Guard ([manage-data/page.tsx](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/app/%28portal%29/dashboard/manage-data/page.tsx)):**
    *   Modified matching logic in `handleFlush` to match strings case-insensitively and trim spacing (e.g. matching `"recruitment_all"` with trailing spaces or different case), eliminating collection wipe mismatches.
*   **Cleaned Press Release Grayscale Filter ([page.tsx](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/app/%28main%29/publications/press-releases/page.tsx)):**
    *   Removed the default `grayscale` CSS filter from the public press release cover photos, allowing images to render in full color by default on page load.
*   **Cinematic Preloader & Session Cache ([Preloader.tsx](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/components/public/Preloader.tsx)):**
    *   Developed a global preloader playing a logo animation, typewriter effect of the club motto `"UPGRADE YOURSELF."` across two bold, italic lines, and a smooth `001%` to `100%` digital loading bar.
    *   Integrated `sessionStorage` caching. The preloader runs only once per browser tab session, mounting/unmounting instantly on subsequent page refreshes to keep the website feeling fast.
*   **WebGL Spline Revert:**
    *   Reverted all homepage optimizations related to the WebGL Spline 3D canvas, restoring it to its exact original loading state per user preference.
 
---
 
## 8. Existing Member Registration & Multi-level Approvals (July 8, 2026)
*   **Staged Request Database Schema ([PendingMember.ts](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/model/PendingMember.ts)):**
    *   Created a staging schema to hold pending registrations before account activation.
    *   Integrates dynamic fields: Name, Student ID, Email, Phone, BUCC Department, BRACU Department, Designation, and Membership Status (Active/Alumni).
*   **Password Symmetric Encryption Safeguards ([crypto.ts](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/lib/crypto.ts)):**
    *   Implemented Node `crypto`-based AES-256-CBC symmetric encryption to store passwords securely inside the staging collection.
    *   Decrypts the credentials only when the registration request is approved to construct the account via Better Auth.
*   **Public Signup Panel ([page.tsx](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/app/%28main%29/member-registration/page.tsx)):**
    *   Designed `/member-registration` as a premium centered dashboard-card layout (fully distinct from the recruitment intake split-page). Features ambient background blur neon lights, card-grouped form categories, client-side validation, duplicate checks, and streamlined form inputs:
        *   **Alumni Status**: BUCC Department dropdown includes "Governing Body" as an option. Selecting "Governing Body" updates designations to President, VP, GS, or Treasurer; selecting other departments updates designations to Director, AD, SE, Executive, or General Member. Includes an optional checkbox to bypass G-Suite constraints and register using a personal email address (e.g. Gmail).
        *   **Current Member**: Excludes "Governing Body" from departments, limits designations strictly to Senior Executive, Executive, and General Member, and strictly enforces G-Suite verification.
*   **Administrative Approvals Tab ([page.tsx](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/app/%28portal%29/dashboard/members/page.tsx)):**
    *   Added a tab system with a live notification counter badge inside the Members Directory page for eligible reviewers.
    *   Reviewers can only see and action requests matching their authority levels.
*   **Review & Approval Modal ([MemberApprovalDialog.tsx](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/components/portal/members/MemberApprovalDialog.tsx)):**
    *   Provides inline profile editing (Name, Student ID, Designation, etc.) before approving.
    *   Triggers programmatically to register users through Better Auth, automatically dispatches a congratulations/welcome email listing login credentials, and deletes the staging document.
 
*   **API Handlers ([route.ts](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/app/api/member-registration/route.ts) & [[id]/route.ts](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/app/api/member-registration/%5Bid%5D/route.ts)):**
    *   Exposes secure routes managing submission (POST), retrieval (GET), editing/activation (PATCH), and rejection/deletion (DELETE).
*   **Sign-in Portal Integration ([page.tsx](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/app/%28main%29/login/page.tsx)):**
    *   Added a prominent "Existing BUCC Member / Alumni Registration" navigation link under the login form to redirect members to the portal signup layout.
*   **Broadcast Center Permission Restructuring:**
    *   Restricted Broadcast Center and Hero configuration access. Replaced permissive checks permitting Senior Executives and Executives with strict Executive Body verification (`isGB || ["director", "assistant director"].includes(userDesignation)`), blocking general body members from modifying global alerts, announcements, recruitment configurations, or hero slides.
*   **Members Directory Permission Restructuring:**
    *   Restricted Members Directory access ([page.tsx](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/app/%28portal%29/dashboard/members/page.tsx)) and sidebar navigation link visibility ([Sidebar.tsx](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/components/Sidebar.tsx)) to Governing Body (GB) and Executive Body (Directors / Assistant Directors) members. Senior Executives are now excluded from viewing the active member roster.
*   **MongoClient Connection Caching Pattern ([auth.ts](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/lib/auth.ts)):**
    *   Cached the `MongoClient` connection globally in development mode. Prevents Next.js hot-reloads from repeatedly instantiating separate connection pools, solving the `MongoTopologyClosedError` for authentication and session endpoints.
*   **Blogs and Press Releases Dashboard & API Scoping ([blogs/page.tsx](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/app/%28portal%29/dashboard/blogs/page.tsx), [press-releases/page.tsx](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/app/%28portal%29/dashboard/press-releases/page.tsx), [api/press-releases/route.ts](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/app/api/press-releases/route.ts)):**
    *   Restricted the backend query for non-moderators (such as Senior Executives) to only return press releases they authored themselves (matching the blog API scoping).
    *   Kept the status filter tabs ("All", "Published", "Pending Approval", "Drafts") visible for all users. These tabs now filter the user's own submissions for regular writers, and moderate all submissions for Governing Body (GB) and Executive Body (EB) moderators.
*   **Profile Slug Uniqueness Index Fix ([route.ts](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/app/api/member/route.ts)):**
    *   Replaced setting `profileSlug` to `null` with MongoDB's `$unset` operator when members clear their custom profile URLs. This fully deletes the field from the document, allowing MongoDB's `sparse: true` index to ignore it and preventing `E11000 duplicate key` validation errors on profile updates.
*   **Designations List Cleanup ([designations.ts](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/constants/designations.ts)):**
    *   Removed the `"Advisor"` and `"Alumni"` designations from the global designations constant registry. This completely excludes advisors (faculty members) and alumni status definitions from student member designations dropdowns (such as edit and approval dialogs), while keeping Alumni as a core membership status dropdown choice.
*   **Probation Membership Status Removal ([MemberEditDialog.tsx](file:///C:/Users/Abir/Desktop/bucc-clean-history/src/components/portal/members/MemberEditDialog.tsx)):**
    *   Removed the `"Probation"` selection option from the member status dropdown inside the profile editor, limiting status categories strictly to Active, Inactive, and Alumni.
