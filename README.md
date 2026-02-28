# Smart Energy Monitor

Minimalist monochrome app to track energy usage, view breakdowns, and get threshold alerts. Built with Next.js (App Router), Clerk, TailwindCSS, and Chart.js.

## Features

- **Auth** – Sign in / sign up via Clerk (optional: app works in demo mode without keys)
- **Data entry** – Add date + units consumed
- **Dashboard** – Line chart (daily consumption), bar chart (weekly total), stats (total, avg/day, projected monthly bill)
- **Threshold alerts** – Alerts when any entry exceeds 50 units
- **Trend comparison** – “Usage Increasing” or “Usage Improving” when last 3 vs previous 3 entries differ by >20%
- **Anomaly detection** – Spike (day > 1.5× average) and “Consistent Rise” (3 consecutive increases)
- **Firebase Firestore** – Energy entries are stored per account (Clerk user ID); data persists across sessions.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Without Clerk keys, use **Dashboard** for demo mode (no auth).

### Environment variables

Copy `.env.example` to `.env.local` and fill in:

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key ([dashboard.clerk.com](https://dashboard.clerk.com)) |
| `CLERK_SECRET_KEY` | Clerk secret key |
| Firebase client (optional) | `NEXT_PUBLIC_FIREBASE_*` – web app config from Firebase Console → Project Settings |
| **Firebase server** (for saving data) | See **Firebase service account** below |

**Auth (Clerk):** Sign in/sign up and **Dashboard** will be protected.

**Data (Firebase):** The API needs a **Firebase service account key** (not the web app config). Set **one** of:

- **Option A – Key file (recommended):**  
  1. [Firebase Console](https://console.firebase.google.com) → your project → **Project settings** (gear) → **Service accounts**.  
  2. Click **Generate new private key**. Save the JSON file (e.g. as `firebase-service-account.json` in the project root).  
  3. In `.env` or `.env.local` add:  
     `GOOGLE_APPLICATION_CREDENTIALS=./firebase-service-account.json`  
  4. Restart the dev server (`npm run dev`).

- **Option B – JSON in env:**  
  1. Same steps 1–2 as above.  
  2. Minify the JSON to one line and set in `.env.local`:  
     `FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"...",...}`  
  (Escape double quotes inside the value or use a tool to minify.)

Use `.env` or `.env.local` in the project root; restart the server after changing env. You may need to create a Firestore composite index (Firebase will show a link in the error on first use) for `energyEntries` with `userId` (Ascending) and `date` (Ascending).

## Routes

| Route        | Description                    |
| ------------ | ------------------------------ |
| `/`          | Landing (sign in/up or dashboard link) |
| `/dashboard` | Protected dashboard (charts, form, alerts) |
| `/sign-in`   | Clerk sign-in                  |
| `/sign-up`   | Clerk sign-up                  |

## Tech stack

- **Next.js 16** (App Router)
- **Clerk** – Auth
- **Firebase (Firestore)** – Persist energy entries per user
- **TailwindCSS** – Styling (black/white/gray theme)
- **Chart.js + react-chartjs-2** – Line and bar charts

Data is stored in Firebase Firestore per account (user). Projected monthly bill uses rate = ₹6/unit.
