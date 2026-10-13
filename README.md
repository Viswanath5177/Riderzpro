# ⚡ Riderzpro — EV Batteries & Certified Installation Platform

Riderzpro is an automotive e-commerce & certified technician marketplace connecting verified EV sellers, customers, and field installation riders with guaranteed vehicle fitment and live tracking.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Platform](https://img.shields.io/badge/Platform-Web%20%7C%20React%20%7C%20PostgreSQL-orange.svg)](#)

---

## 🚀 Key Features

1. **Guaranteed Fitment Engine**: Strictly matches EV batteries against vehicle brand, model, and year (Ather, Ola, TVS, Revolt, Hero, Chetak).
2. **Multi-Role Dashboards**:
   - **Customer**: Product discovery, cart, checkout, live rider tracking.
   - **Seller (Entrepreneur)**: Inventory management, "+ Add Product" submission, order fulfillment, weekly payouts.
   - **Rider (Technician)**: Dispatch queue, live GPS location updates, order completion.
   - **Support Admin**: Verification queue to review and approve/reject seller products and tickets.
   - **Super Admin**: Platform-wide metrics, governance, and user auditing.
3. **Database Architecture**: Clean PostgreSQL / SQLite schema unifying users, products, orders, deliveries, and support tickets.

---

## 💻 Development & Running Locally

### 1. React / TanStack Web App
```bash
npm install --legacy-peer-deps
npm run dev
```
Open [http://localhost:8080](http://localhost:8080) (or port 8081) in your browser.

### 2. Static Web Preview / Dashboards
```bash
# Start local HTTP server
python -m http.server 3000 --directory web
```

---

## 📱 Mobile App (Android & iOS via Capacitor)

The mobile version wraps the responsive SPA build inside native Capacitor shells with full offline support, hardware back button navigation, dark status bar, haptics, and custom splash screens.

### 1. Build and Sync Web Changes to Mobile
```bash
npm run build
npx cap sync
```

### 2. Open & Run in Android Studio
```bash
npx cap open android
```

### 3. Open in Xcode (macOS only)
```bash
npx cap open ios
```

---

## 🛠️ Built With

- **Frontend**: TanStack Start, React 19, TypeScript, Tailwind CSS, Lucide Icons
- **Database**: PostgreSQL / SQLite
- **Mobile**: Capacitor 8 (Status Bar, Splash Screen, Haptics, App)

---

## 📄 License

MIT © 2026 Riderzpro Technologies Pvt Ltd.

---

## 🔄 Team Workflow: How to Update & Push Changes to `main`

### 1. Pulling Your Friends' Changes Into Your Branch
When teammates merge new backend endpoints or UI screens into `main`, update your local mobile branch:
```bash
# Ensure you are on your working branch
git checkout feature/aakash-mobile

# Pull the latest changes from main
git pull origin main

# Rebuild static assets and sync to native Android & iOS
npm run build
npx cap sync
```

### 2. Pushing Your Changes Directly to `main`
To merge all your mobile work into `main` and push to GitHub:

```bash
# 1. Commit any remaining work on your branch
git add .
git commit -m "feat(mobile): your update description"

# 2. Switch to main branch
git checkout main

# 3. Pull latest main to make sure it's up to date
git pull origin main

# 4. Merge your feature branch into main
git merge feature/aakash-mobile -m "Merge mobile branch into main"

# 5. Push main to GitHub
git push origin main
```

---

## 📦 Tech Stack & Native Features
- **Frontend**: TanStack Start (SPA mode), TanStack Router, React 19, Tailwind CSS
- **Mobile Shell**: Capacitor 8 (`@capacitor/core`, `@capacitor/android`, `@capacitor/ios`)
- **Native Plugins**:
  - `@capacitor/status-bar` — Dark theme matching `#14161a`
  - `@capacitor/splash-screen` — Native animated launch screen
  - `@capacitor/app` — Hardware back button navigation
  - `@capacitor/network` — Live connection monitor & offline indicator
  - `@capacitor/haptics` — Touch vibrations on order & cart interactions
- **Store Compliance**: In-app Privacy Policy with Account Deletion (`/privacy`), Terms & Refunds (`/terms`), and Customer Support (`/support`).
