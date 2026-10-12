# Riderzpro — EV Batteries & Parts Marketplace

Riderzpro is an electric two-wheeler battery and spare parts marketplace built with **TanStack Start**, **React 19**, **Tailwind CSS**, and **Capacitor** for Android and iOS.

---

## 🚀 Quick Start (Web Development)

1. **Install Dependencies:**
   ```bash
   npm install --legacy-peer-deps
   ```


2. **Start Local Dev Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:8080](http://localhost:8080) in your browser.

3. **Run Tests & Linting:**
   ```bash
   npm test
   npm run lint
   ```

---

## 📱 Mobile App (Android & iOS via Capacitor)

The mobile version wraps the responsive SPA build inside native Capacitor shells with full offline support, hardware back button navigation, dark status bar, haptics, and custom splash screens.

### 1. Build and Sync Web Changes to Mobile
Whenever you make changes to UI screens or code, build the static assets and sync them to native platforms:
```bash
npm run build
npx cap sync
```

### 2. Open & Run in Android Studio
```bash
npx cap open android
```
- Wait for Gradle sync to complete.
- Select your target device/emulator (or connect a physical Android phone with USB Debugging enabled).
- Click the green **Run (▶)** button.

### 3. Open in Xcode (macOS only)
```bash
npx cap open ios
```

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
