# Smart Energy Monitor – DevPlay26
Theme: Minimalist + Monochrome  
Stack: Next.js (App Router) + Clerk Auth + TailwindCSS + Chart.js  

---

## 🧠 PROJECT GOAL

Build a Smart Energy Monitor that:

1. Authenticates users
2. Allows energy data input
3. Displays breakdown dashboard (line + bar chart)
4. Sends threshold alerts
5. Implements rule-based anomaly detection
6. Includes trend comparison logic

Must be demo-ready in 2 hours.
Focus: Clean UI + Working logic > Perfection.

---

# ⏳ EXECUTION PLAN (2 HOUR SPRINT)

---

## ✅ PHASE 1 — Setup (15 min)

### 1. Create project
npx create-next-app@latest smart-energy-monitor
- App Router: YES
- TypeScript: YES
- Tailwind: YES
- src directory: YES

### 2. Install dependencies

npm install @clerk/nextjs chart.js react-chartjs-2

### 3. Setup Clerk
- Create Clerk app
- Add keys to `.env.local`
- Wrap app with ClerkProvider in layout.tsx
- Add SignIn / SignUp pages
- Protect dashboard route

Routes:
- / → landing
- /dashboard → protected
- /sign-in
- /sign-up

---

## 🎨 PHASE 2 — UI Foundation (20 min)

Theme:
- Black background
- White/gray text
- No bright colors
- Thin borders
- Subtle shadows
- Font: Inter

Tailwind palette:
- bg-black
- text-white
- text-gray-400
- border-gray-800

Create:

components/
- Navbar.tsx
- EnergyForm.tsx
- EnergyCharts.tsx
- AlertBox.tsx

---

## 📊 PHASE 3 — Data Model (10 min)

Use local state (no DB, save time).

EnergyEntry:
{
  date: string
  units: number
}

Use useState to store entries.

---

## 🧩 PHASE 4 — Core Features (45 min)

---

### 🔹 1. Data Input (EnergyForm)

Inputs:
- Date
- Units Consumed

On submit:
- Push to entries array
- Reset form

Validation:
- Units > 0
- Required fields

---

### 🔹 2. Breakdown Dashboard (EnergyCharts)

Use Chart.js

Charts:

1. Line Chart → Daily Consumption
2. Bar Chart → Weekly Total

Compute:
- Total consumption
- Average consumption

Display stats cards:
- Total Units
- Avg Per Day

---

### 🔹 3. Threshold Alerts

Define:
const THRESHOLD = 50

If any entry.units > THRESHOLD:
Show AlertBox:
“High consumption detected on [date]”

---

### 🔹 4. Trend Comparison Algorithm

Logic:
- Compare last 3 entries avg
- Compare previous 3 entries avg
- If increase > 20% → show "Usage Increasing"
- If decrease > 20% → show "Usage Improving"

---

### 🔹 5. Rule-Based Anomaly Detection

Rules:

Rule 1:
If current day > 1.5 × average → anomaly

Rule 2:
If 3 consecutive increases → anomaly

Return:
{
  date,
  type: "Spike" | "Consistent Rise"
}

Display in dashboard under:
“Anomaly Insights”

---

## 📈 PHASE 5 — Advanced Polish (20 min)

- Add subtle hover effects
- Add glass-like card containers
- Add loading states
- Smooth transitions

Optional if time:
- Dark mode toggle (monochrome variation)

---

# 🧠 FILE STRUCTURE

src/

app/
- layout.tsx
- page.tsx
- dashboard/page.tsx
- sign-in/[[...sign-in]]/page.tsx
- sign-up/[[...sign-up]]/page.tsx

components/
- Navbar.tsx
- EnergyForm.tsx
- EnergyCharts.tsx
- AlertBox.tsx

lib/
- analytics.ts (trend + anomaly logic)

---

# 🧮 analytics.ts

Functions to implement:

1. calculateTotal(entries)
2. calculateAverage(entries)
3. compareTrend(entries)
4. detectAnomalies(entries)

Keep pure functions.

---

# 🎯 DEMO SCRIPT

1. Login
2. Add multiple entries
3. Show chart updates
4. Trigger threshold alert
5. Show anomaly detection
6. Explain rule-based logic

---

# ⚠️ TIME MANAGEMENT RULES

- No database
- No complex animations
- No over-design
- Working logic > styling
- If stuck > simplify

---

# 🧠 EXTRA INTELLIGENCE (If time allows)

Add:
“Projected Monthly Bill”

Formula:
avgDaily × 30 × ratePerUnit

Hardcode rate = 6

---

# 🏁 FINAL CHECKLIST

[ ] Auth working  
[ ] Dashboard protected  
[ ] Data entry works  
[ ] Line chart renders  
[ ] Bar chart renders  
[ ] Threshold alert works  
[ ] Trend comparison works  
[ ] Anomaly detection works  
[ ] Clean monochrome UI  

---

END.