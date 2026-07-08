# StadiumIQ — Executive Summary & Project Differentiators

## 🚀 Overview
**StadiumIQ** is a full-stack, production-ready smart stadium operations and fan navigation platform tailored for the FIFA World Cup 2026. Built as a high-performance TypeScript monorepo (`Vite + React` client & `Express + Node` server), it resolves complex logistical challenges around fan wayfinding, language localization, safety incident management, and real-time gate congestion control.

---

## 🎯 Key Differentiators

1. **Dual-Mode GenAI Layer**: Includes dynamic prompts for multilingual wayfinding Q&A (supporting English, Spanish, and Hindi) and crowd-flow operational recommendations. It implements a smart, zero-dependency mock fallback engine that guarantees offline robustness if LLM API keys are not supplied.
2. **Real-time Telemetry & Map Routing**: Uses a simulated crowd sensor time-series network feeding live metrics through WebSockets (Socket.io). Fans get access to an interactive SVG map that highlights personalized routes from gates to seats, while staff watch a live occupancy heatmap.
3. **Enterprise Security Standards**: Features a robust auth cycle with bcrypt password hashing (12 rounds) and split JWT sessions: short-lived access tokens combined with HttpOnly, SameSite cookies for refresh validation. Input parsing via Zod schemas, Helmet security headers, and rate-limiting are fully implemented.
4. **Resilient Architecture**: Uses a lightweight custom state-router on the client, rendering the app immune to routing library version conflicts. Relies on Prisma ORM connecting to a local SQLite database that mirrors PostgreSQL schemas.

---

## 🚧 Future Extensions & Roadmaps
- **Active Wayfinding GPS**: Integrate Indoor Positioning Systems (IPS) via Bluetooth Beacons for automated blue-dot fan navigation.
- **Ticketing / POS Integrations**: Connect with digital ticketing wallet APIs and food concession point-of-sale systems to dynamically display live concession wait times.
- **Predictive ML Models**: Transition from reactive AI recommendations to predictive ML forecasting, projecting crowd arrivals based on incoming bus and light rail schedules.
