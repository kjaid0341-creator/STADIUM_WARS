# StadiumIQ — 2-Minute Demo Walkthrough Script

Follow these steps to demonstrate StadiumIQ to judges, showing off its GenAI capabilities, real-time WebSocket features, and security mitigations in under 2 minutes.

---

## 🎬 Demo Steps

### Phase 1: Onboarding & Signup (0:00 - 0:25)
* **Step 1:** Open [http://localhost:3000](http://localhost:3000). You'll land on the secure Login screen.
* **Step 2:** Click **"Sign Up Here"** to go to the Register page.
* **Step 3:** Enter details:
  - Name: `Alex Green`
  - Email: `alex@fan.com`
  - Role: Select **"Fan"**
  - Language: Select **"Español"**
* **Step 4:** Click **"Create Account"**. The app immediately registers you, hashes the password with 12 rounds of bcrypt, logs you in, and redirects you to the Fan Portal.

### Phase 2: Fan Portal & AI Chat (0:25 - 0:55)
* **Step 5 (Multilingual AI Assistant):** Notice that because your language is Spanish, the AI Chat assistant greets you in Spanish: *"¡Bienvenido al Mundial FIFA 2026!..."*
* **Step 6:** Click the suggested query button **"Baño Accesible"**. The chat immediately submits a query and the GenAI engine returns precise directions in Spanish (*"...en el Pasillo A, al lado de la Sección 104..."*).
* **Step 7 (Interactive Map & Routing):** Click the **"My Ticket"** tab at the top. You'll see a mock ticket for Match 18 (Section 104, Row G, Seat 18).
* **Step 8:** Click **"Route from entrance to Seat"**. The app switches to the Map tab and highlights a green dotted route from Gate 5 directly to Section 104 on the interactive SVG map.
* **Step 9:** Click the profile icon in the top right, change the language to **"English"**, and click **"Save Settings"** to sync your preferences. Go back to the dashboard.

### Phase 3: Staff Operations Dashboard (0:55 - 1:35)
* **Step 10:** Click the logout button and log in with a Staff account (e.g. create a staff account via Register: Role="Staff / Admin", Name="Director", Email="director@stadium.iq").
* **Step 11 (Real-time Telemetry):** You'll land on the **Staff Operations Centre**. Watch the **Live Crowd Sensors Feed** grid: the numbers fluctuate dynamically every 5 seconds as WebSocket events stream live sensor updates. Zones operating over capacity show as Red or Amber.
* **Step 12 (GenAI Operations Recommendations):** Look at the **StadiumIQ GenAI Ops** panel on the right. Click **"Re-Analyze"**. The GenAI engine will read the live counts, analyze bottlenecks, and output structured operational advice (e.g. redirecting traffic from Gate 5 to Gate 12).
* **Step 13 (Incident Logger & WebSocket Broadcast):** Switch to the **Incident Registry** view. Fill in the incident form:
  - Category: `Medical Emergency`
  - Severity: `High`
  - Location: `Section 104 concourse`
  - Description: `Fan heat exhaustion. Requiring medic cart.`
  Click **"File Official Report"**. The incident is immediately saved and pushes live.
* **Step 14 (Broadcasting Center):** Go back to the Operations view. In the Broadcasting Center input, type: `Emergency Alert: North Transport links delayed. Use East gates.` Click **"Publish"**.

### Phase 4: Verification of Real-time Alert (1:35 - 2:00)
* **Step 15:** Open a new browser window/tab in incognito mode at [http://localhost:3000](http://localhost:3000), log in with the Fan account `alex@fan.com` created in Phase 1.
* **Step 16:** Look at the top of the Fan screen. The emergency alert banner showing `"Emergency Alert: North Transport links..."` is displayed in a bright colored banner at the top, pushed live via WebSocket from the staff dashboard!
