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
