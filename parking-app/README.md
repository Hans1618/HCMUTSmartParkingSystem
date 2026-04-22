# HCMUT Smart Parking

A React + Vite prototype of a campus parking management app for Ho Chi Minh City University of Technology (HCMUT). It showcases three complete user journeys — **University Member**, **Visitor / Temporary User**, and **Administrator / Operator** — inside a mobile phone frame demo.

Built for the CNPM (Software Engineering) coursework with an editorial-grade design system called **"The Academic Pulse"**.

![Stack](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Router](https://img.shields.io/badge/React%20Router-7-CA4245?logo=reactrouter&logoColor=white)
![Icons](https://img.shields.io/badge/Lucide-icons-000)

---

## Features

### Visitor / Temporary User flow
`Temporary Entry → Temporary Ticket → Assigned Zone → Check-out → Payment`

- `/visitor/entry` — Collects vehicle type (motorcycle / car / bicycle), license plate, phone, and visit purpose. Previews the hourly rate, entry fee, and daily cap for the selected vehicle.
- `/visitor/ticket` — Issues a temporary ticket with a ticket number, a decorative QR pattern, zone + spot assignment, live session timer, validity window, and live-pricing summary.
- `/visitor/checkout` — Auto-computes duration and fee (entry fee + hourly), caps at the daily maximum.
- `/visitor/payment` — Choose from MoMo, credit/debit card, or cash at gate. Confirms with an animated receipt and returns the visitor to a fresh entry.

### Administrator / Operator flow
`Login → Admin Dashboard → Policy Management → Pricing / Privilege Configuration → Logs / Audit / Alerts`

- `/admin` — Operations overview: parked vehicles, occupancy %, estimated revenue, active alert count, navigation tiles, and a compact recent-alerts panel.
- `/admin/policies` — Searchable, category-filterable (Pricing / Access / Security) list of parking policies with per-policy enable/disable toggles. Each toggle emits an audit log entry.
- `/admin/pricing` — Live editors for per-zone hourly rates, plus role-based privileges (discount %, monthly cap, reserved window) for Members, Staff, and Visitors.
- `/admin/logs` — Unified feed of audit events, operator alerts, and system logs. Tabs (All / Alerts / Audit / Logs), severity colour-coding (info / warning / critical), free-text search, and one-click acknowledgement of alerts.

### University Member flow (pre-existing, refined)
`Login → Dashboard → Find Parking → Check-in → Active Session → Check-out → Billing → Account`

- Role-based routing: every route is gated to the correct role; protected routes bounce back to `/` when the user is not authorised.
- Role-aware navigation: the bottom bar reshapes itself per role (Home/Park/Billing/Account for members, Entry/Profile/Exit or Ticket/Check-out/Profile for visitors, Overview/Policies/Pricing/Logs for admins).

---

## Design system — "The Academic Pulse"

Implemented across `src/index.css` and page-level CSS:

- **No-line rule**: boundaries are created by shifting surface tiers (`surface`, `surface-container-low`, `surface-container-lowest`) instead of 1px borders.
- **HCMUT palette**: deep blue `#004d8a` as primary, heritage gold `#7f5700` as secondary, academic teal `#005078` for availability signals.
- **Typography**: `Manrope` for editorial headlines, `Inter` for body and data labels.
- **Ambient depth**: shadows use `on-surface` at 6% opacity + 24px blur; buttons use a 135° blue gradient; map overlays use glassmorphism with a 20px backdrop-blur.
- **Status chips** use `sm` (0.125rem) radius for a technical feel, while buttons stay `xl` (0.75rem) for editorial weight.

See `DESIGN.md` in the parent folder for the full specification.

---

## Project structure

```
parking-app/
├── public/                    Campus map, logo, favicon, icons
├── src/
│   ├── App.jsx               Router with role-based ProtectedRoute
│   ├── main.jsx
│   ├── index.css             Design tokens, typography, components
│   ├── components/
│   │   ├── Navbar.jsx        Role-aware TopBar + BottomNav
│   │   ├── PhoneFrame.jsx    Mobile demo frame
│   │   ├── ParkingCard.jsx
│   │   ├── StatusChip.jsx
│   │   ├── SessionTimer.jsx
│   │   └── TransactionItem.jsx
│   ├── context/
│   │   └── AppContext.jsx    Global state: user, zones, sessions,
│   │                         visitor ticket/receipt, policies,
│   │                         privileges, audit logs
│   ├── data/
│   │   └── mockData.js       Users, zones, visitor rates, policies,
│   │                         privileges, audit logs, helpers
│   └── pages/
│       ├── LoginPage.jsx     Role selector (Member / Visitor / Admin)
│       ├── DashboardPage.jsx
│       ├── ParkingAvailabilityPage.jsx
│       ├── CheckInPage.jsx / ActiveSessionPage.jsx / CheckOutPage.jsx
│       ├── BillingPage.jsx / AccountPage.jsx
│       ├── VisitorEntryPage.jsx      ──┐
│       ├── VisitorTicketPage.jsx       │ Visitor flow
│       ├── VisitorCheckoutPage.jsx     │
│       ├── VisitorPaymentPage.jsx    ──┘
│       ├── AdminDashboardPage.jsx    ──┐
│       ├── AdminPoliciesPage.jsx       │ Admin flow
│       ├── AdminPricingPage.jsx        │
│       └── AdminLogsPage.jsx         ──┘
└── vite.config.js
```

---

## Running locally

Prerequisites: Node.js 18+ and npm.

```bash
cd parking-app
npm install
npm run dev          # Vite dev server on http://localhost:5173
npm run build        # Production build into dist/
npm run preview      # Preview the production build
npm run lint         # ESLint
```

Open `http://localhost:5173` and pick a role on the login screen.

| Role | Lands on | Mocked account |
|---|---|---|
| University Member | `/dashboard` | Nguyen Van A (2212345) |
| Visitor / Temporary | `/visitor/entry` | Tran Thi B (no account) |
| Administrator / Operator | `/admin` | Le Van C (ADMIN-001) |

All data is stored in-memory (see `src/data/mockData.js` and `src/context/AppContext.jsx`) — refreshing the page resets the session.

---

## Tech stack

- **React 19** with function components and hooks
- **Vite 8** for dev server and production bundling
- **React Router 7** for client-side routing with role guards
- **lucide-react** for the icon set
- Pure CSS modules per page — no UI library, no CSS-in-JS

---

## Notable design decisions

- State lives in a single `AppContext` to keep the MVP simple; there is no backend or persistence layer. Visitor and admin actions mutate the same in-memory store and are intentionally ephemeral.
- Role-based routing uses a single `ProtectedRoute` component that accepts an optional `allow` array so each route declares which roles can access it.
- The visitor ticket includes a purely decorative SVG "QR" pattern seeded from the ticket ID so every ticket looks unique without pulling in a QR library.
- Every admin mutation (policy toggle, rate change, privilege update) appends a new entry to the audit log — this makes the Logs screen come alive as the operator interacts with the system.

---

## Screens at a glance

- **Login** — Editorial role picker with HCMUT gradient and staggered animation.
- **Member Dashboard** — Greeting, active session banner, dual stat cards (availability + balance), quick actions, recommended zone.
- **Visitor Ticket** — Punch-notched ticket card with QR, timer ring, and live rate summary.
- **Admin Dashboard** — Three stat tiles + operations tiles + alert feed.
- **Admin Logs** — Colour-coded severity rail, tabbed filters, acknowledge buttons.

---

## License

Internal coursework project. Not licensed for production use.
