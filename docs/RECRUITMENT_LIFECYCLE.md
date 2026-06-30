# Recruitment Lifecycle & Gating

The recruitment process is the most critical pipeline in the BUCC portal. It is modeled as a strict state machine, heavily governed by administrative toggles.

## The State Machine

1. **Phase 1: Registration (`/registration`)**
   - **Actor:** Prospective Member.
   - **Action:** Submits basic details (Name, ID, G-Suite, Dept preferences).
   - **Output:** Document created in the `PreRegMember` collection.

2. **Phase 2: Written Evaluation (`/evaluation`)**
   - **Actor:** Pre-Registered Member.
   - **Action:** Verifies identity using ID/Phone, then completes a dynamic JSON-driven questionnaire.
   - **Output:** Document created in the `EvaluationData` collection (Status: `Submitted`).

3. **Phase 3: Interview Assessment (`/dashboard/evaluation`)**
   - **Actor:** Department Directors / HR.
   - **Action:** Reviews the written submission, conducts an interview, and logs numerical scores + comments.
   - **Transition:** Saving the assessment changes the applicant's status to `Accepted`, `Rejected`, or `Pending`. They are immediately removed from the active interview queue.

4. **Phase 4: Onboarding (`/dashboard/registration`)**
   - **Actor:** Department Directors / GB.
   - **Action:** Reviews 'Accepted' members. The system generates a secure password. Clicking 'Finalize' creates the official Better Auth `user` account and dispatches the welcome email via Nodemailer.

---

## The Gatekeeper System

To prevent out-of-cycle applications, the system utilizes a centralized "Gatekeeper".

### Administrative Controls (`/dashboard/broadcast`)
The "Recruitment Pulse" card allows GB, HR, and R&D leadership to manipulate the `AppConfig` database record for `recruitment_config`.
- **Toggles:** Independently open/close Registration and Evaluation.
- **Countdowns:** If closed, admins can set a `targetDate`.
- **Messages:** Admins can define exactly what the closed page should say.

### Enforcement

1. **UI Layer (`IntakeInactive.tsx`):**
   - If a page is closed, the Next.js page component abandons the form render and instead mounts the `IntakeInactive` component.
   - This component displays the custom closure message and a live ticking countdown clock.

2. **API Layer (`/api/preregister` & `/api/evaluation`):**
   - The frontend is not trusted. 
   - Every `POST` request to these endpoints forces a server-side read of the `AppConfig`.
   - If the switch is off, the server aborts the transaction and returns a `403 Forbidden`, effectively sealing the database against direct curl/Postman attacks.
