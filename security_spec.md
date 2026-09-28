# Security Specification & Threat Model: Kingsman Corporation

## 1. Data Invariants
1. **Admins Collection**: Strictly holds authorized owner accounts (e.g. `onlyindiankitchen@gmail.com`). Only verified admins can read or manage admin status. No client can assign themselves as admin.
2. **User Profiles (`clientProfiles`)**: Every client profile document ID must match `request.auth.uid`. Clients can only read and update their own private profile (`resource.data.uid == request.auth.uid`). Public queries are disabled; PII is strictly protected.
3. **Companion Applications (`companionApplications`)**: Prospective companions submit applications linked to their `request.auth.uid`. Status begins as `pending`. Applicants cannot approve themselves or alter their status; only admins can approve or reject applications.
4. **Companion Profiles (`companionProfiles`)**: Public directory profiles are strictly managed, created, published, updated, and deleted by admin only. Clients and visitors can only read published profiles (`resource.data.isPublished == true`).
5. **Booking Requests (`bookingRequests`)**: Clients can create booking requests where `incoming().clientId == request.auth.uid`. Clients can read their own bookings. Only admins can update the status (e.g. from `pending` to `approved` / `completed`) or write admin notes. Clients can cancel their own pending booking (`status: 'cancelled'`). Direct client-to-companion messaging is blocked.
6. **Internal Messages (`messages`)**: Kingsman Corporation mediates all communication. Messages can only be read by the participant (`senderId == request.auth.uid || recipientId == request.auth.uid || isAdmin()`). Direct client-to-client or client-to-companion bypass is forbidden.
7. **Reports & Safety (`reports`)**: Any authenticated user can submit a safety report where `reporterId == request.auth.uid`. Only admins can read, update status (`under_review`, `action_taken`, `closed`), or review reports.
8. **Support Tickets (`supportTickets`)**: Any user or client can submit a support ticket. Only admins can read and resolve tickets.
9. **Payments & Content Management (`payments`, `media`, `testimonials`, `siteSettings`)**: Platform fees, media assets, testimonials, and homepage settings are strictly controlled and writable by admin only. Public visitors can only read active testimonials and public site settings.

## 2. The "Dirty Dozen" Threat Payloads
1. **Payload 1 (Privilege Escalation)**: Client writes to `/admins/{uid}` with `{ role: 'admin' }`. Result: PERMISSION_DENIED.
2. **Payload 2 (Shadow Update / Ghost Field)**: Client updates their profile with `{ isVip: true, role: 'admin' }`. Result: PERMISSION_DENIED.
3. **Payload 3 (Companion Profile Injection)**: Unauthenticated or non-admin user attempts to create a document in `/companionProfiles`. Result: PERMISSION_DENIED.
4. **Payload 4 (Booking Status Tampering)**: Client attempts to update booking request status directly to `'approved'`. Result: PERMISSION_DENIED.
5. **Payload 5 (PII Scraping via Blanket Read)**: Authenticated client calls `getDocs(collection('clientProfiles'))`. Result: PERMISSION_DENIED.
6. **Payload 6 (Identity Spoofing in Messages)**: User sends message with `senderId: "other_user_id"`. Result: PERMISSION_DENIED.
7. **Payload 7 (Application Self-Approval)**: Companion applicant updates their own application to `status: "approved"`. Result: PERMISSION_DENIED.
8. **Payload 8 (Resource Poisoning / DOS)**: Attacker attempts to post a 1MB string in `shortIntro` or `message`. Result: PERMISSION_DENIED (enforced via `.size() <= 2000`).
9. **Payload 9 (ID Poisoning Attack)**: Attacker passes a 500-character malicious path ID like `../../../etc`. Result: PERMISSION_DENIED (enforced via `isValidId()`).
10. **Payload 10 (Direct Companion Messaging Bypass)**: Client attempts to create message with recipient set to companion instead of admin / company mediator. Result: PERMISSION_DENIED.
11. **Payload 11 (Testimonial Injection)**: Unauthorized user creates a fake testimonial in `/testimonials`. Result: PERMISSION_DENIED.
12. **Payload 12 (Settings Tampering)**: Non-admin alters website settings or hero video in `/siteSettings`. Result: PERMISSION_DENIED.
