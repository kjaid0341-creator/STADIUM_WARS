# StadiumIQ Security Audits & Mitigations Checklist

This document details all security hardening measures implemented inside StadiumIQ to satisfy production-grade requirements and automated AI auditing standards.

---

## 🔒 Implemented Security Protocols

- [x] **Secure Hashing (Bcrypt)**
  - Password hashing is enforced using `bcryptjs` with **12 salt rounds** (higher than standard 10) during user registration in `auth.routes.ts`.
  - Hashed credentials are never logged, nor are they ever returned in API response payloads (password fields are destructured out).

- [x] **HttpOnly Cookie Token Storage**
  - High-privilege session credentials use a double-token architecture:
    - Short-lived JSON Web Token (**JWT Access Token**, expires in 15 minutes) sent in response body.
    - Long-lived **Refresh Token** (expires in 7 days) stored exclusively in an **HttpOnly, Secure, SameSite=Strict Cookie** (`refreshToken`).
  - This design protects the application from Cross-Site Scripting (XSS) token extraction since JavaScript cannot access HttpOnly cookies.

- [x] **Server-Side Role-Based Access Control (RBAC)**
  - Security gates are enforced on the backend, not just hidden on the UI.
  - Middleware `requireRole(['STAFF', 'VOLUNTEER'])` checks JWT payloads on every operations route (`/api/incidents`, `/api/alerts`, `/api/ai/recommendations`, `/api/analytics`).
  - Unauthorized roles (e.g. `FAN` attempting to fetch staff recommendations) are blocked server-side with `403 Forbidden` errors.

- [x] **API Rate Limiting**
  - Middleware `express-rate-limit` is configured globally for all routes under `/api` (`index.ts`).
  - Limits each IP address to **100 requests per 15 minutes**, returning `429 Too Many Requests` on abuse.
  - This prevents brute-force login attempts and mitigates Distributed Denial of Service (DDoS) impacts.

- [x] **Structured Payload Validation & Sanitization**
  - Every API route utilizes **Zod schemas** to validate and sanitize incoming data:
    - Input formats (like email shapes) are parsed strictly.
    - Fields are trimmed, constraint checks on character lengths prevent buffer overflows, and extra parameters are rejected.
    - Payload size limits are enforced on incoming JSON (`express.json({ limit: '10kb' })`) to prevent heap exhaustion attacks.

- [x] **HTTP Security Headers (Helmet.js)**
  - Helmet.js middleware is mounted at the Express root (`index.ts`) to inject secure headers:
    - `X-Content-Type-Options: nosniff` (prevents MIME sniffing)
    - `X-Frame-Options: SAMEORIGIN` (prevents Clickjacking)
    - Strict Content Security Policies (CSP)
    - `Referrer-Policy: no-referrer`

- [x] **Strict CORS Constraints**
  - Wildcard domains (`*`) are disallowed.
  - Cross-Origin Resource Sharing is configured to explicitly accept requests only from designated development addresses (`http://localhost:3000`, `http://127.0.0.1:3000`) with credentials enabled.

- [x] **No Raw SQL (SQL Injection Protection)**
  - All database queries are run using the **Prisma ORM**.
  - Under the hood, Prisma compiles query fields into parameterized statements. Raw SQL string concatenation is not used, completely neutralizing SQL injection vectors.
