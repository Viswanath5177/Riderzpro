# Riderzpro Mobile App

A customer mobile application for the **Riderzpro** Delhi marketplace of Car & Bike Accessories and EV two-wheelers.

Engineered with:
- **Blinkit-style** fast discovery: location-first header with Delhi pincode validation, ETA chips, instant quantity steppers, and sticky animated cart bar.
- **Zomato-style** fulfillment: live multi-vendor tracking simulator, order status timeline, reorders, item ratings, and invoice sharing.
- **Visual Design**: Strict match to the high-converting food-delivery aesthetic — 30% top gradient hero with curved mask, brand wordmark, overlapping rounded sheet (radius 28), pill buttons with horizontal brand gradients, soft filled text fields with leading icons, and micro-animations.

---

## Architecture & Directory Structure

```
lib/
  app/
    app.dart                 # Root ProviderScope, theme listener, router setup
    router.dart              # Declarative GoRouter configuration (auth, shell, tabs)
    router.g.dart            # Generated route constants & helpers
    theme/
      brand_colors.dart      # Vibrant orange/coral primary, slate accents, light/dark tokens
      app_theme.dart         # Material 3 light and dark theme definitions
      app_theme_extension.dart # Custom extensions for shadows, card borders, gradients
  core/
    env/config.dart          # Environment config (API_URL, LOGISTICS_URL, USE_MOCKS)
    geo.dart                 # Haversine distance, Delhi bounds, coordinates
    haptics.dart             # Haptic feedback wrapper for tactile UI interactions
    money.dart               # Currency formatting in Indian Rupees (₹) and paise
    pincode.dart             # Delhi pincode validator (110001-110099) & messaging
  data/
    api/                     # Dio REST clients with auth interceptors & custom error mapping
    local/catalog_loader.dart# Offline JSON catalog loader with fallback
    models/                  # Product, EV, and Vendor domain models
    mocks/                   # Offline mock fixtures and Delhi route tracking simulator
    orders/normalize_order.dart # Single normalization function for camelCase and snake_case
  domain/
    fitment.dart             # Guaranteed vehicle fitment engine (Universal / Model matching)
    order_status.dart        # 6-step timeline map, terminal states, chip colors, cancel rule
    pricing.dart             # Delivery fee (40 + 12*km), ETA minutes, 18% GST (CGST+SGST)
  features/
    assistant/               # AI conversational support with voice speech-to-text
    auth/                    # OTP & Social sign-in matching reference mockup
    cart/                    # Multi-vendor grouped cart, delivery fees, installation addons
    checkout/                # Address picker, slot selector, Razorpay & COD integration
    ev_browse/               # EV two-wheeler catalog with range, top speed, charging specs
    garage/                  # Customer vehicle garage with active fitment filter
    home/                    # Hero banners, quick categories, department grids, flash deals
    notifications/           # Delivery updates, offers, and garage alerts
    onboarding/              # Visual intro walkthrough
    orders/                  # Order history, detailed item snapshots, reorder action
    product/                 # Image gallery, fitment pill, seller selector, specs
    profile/                 # Account management, saved addresses, theme toggle
    search/                  # Instant search with recent queries, brand filters, sort options
    shell/                   # Bottom navigation shell with badge notifications
    tracking/                # Live map, polyline route, driver info, WebSocket updates
  shared/
    widgets/                 # PillButton, RzpTextField, ProductCard, QtyStepper, StatusChip
test/
  unit/                      # Pricing, pincode, fitment, catalog visibility, normalizeOrder tests
  widget/                    # Auth screen layout and validation widget tests
```

---

## Getting Started

### 1. Prerequisites
- **Flutter SDK**: 3.19+ (Dart 3.0+)
- **Python**: 3.10+ (for catalog compilation)

### 2. Compile the Catalog & Bundle Assets
Run the compilation tool to transform the catalog datasets and copy images:
```bash
python tools/build_catalog.py
```
This generates `assets/data/catalog.json` and copies all brand marks, product images, and mock fixtures.

### 3. Fetch Dependencies
```bash
flutter pub get
```

### 4. Run the Application

#### Offline / Mock Mode (Default)
Runs entirely locally with simulated Delhi tracking and pre-bundled catalogs:
```bash
flutter run
```
Or explicitly:
```bash
flutter run --dart-define=USE_MOCKS=true
```

#### Live Mode
Connect to live backend services:
```bash
# Connecting to local backend on desktop/iOS
flutter run --dart-define=USE_MOCKS=false --dart-define=API_URL=http://localhost:8080 --dart-define=LOGISTICS_URL=http://localhost:8000

# Connecting from Android Emulator (uses 10.0.2.2 host alias)
flutter run --dart-define=USE_MOCKS=false --dart-define=API_URL=http://10.0.2.2:8080 --dart-define=LOGISTICS_URL=http://10.0.2.2:8000
```

---

## Running Automated Tests

Run the full suite of unit and widget tests:
```bash
flutter test
```

### Verified Test Cases:
1. `test/unit/pricing_test.dart`:
   - Delivery fee per vendor: `round(40 + km * 12)` rupees.
   - ETA minutes: `round(prepMins + (km / 22) * 60 + 5)`.
   - GST 18% with exact split into 9% CGST and 9% SGST.
   - Multi-vendor cart breakdown calculation.
2. `test/unit/pincode_test.dart`:
   - Validates 6-digit regex and Delhi range `110001-110099`.
   - Exact error messages for invalid format, out of area, and serviceable areas.
3. `test/unit/fitment_test.dart`:
   - Universal fitment.
   - Exact/partial model matching (e.g. Royal Enfield Hunter 350, Activa 6G).
   - Incompatible alert handling.
   - Unknown confirmation status for unlisted models.
4. `test/unit/catalog_visibility_test.dart`:
   - Filters out `Planned` and `Held back` items from customer visibility.
5. `test/unit/normalize_order_test.dart`:
   - Seamless normalization of camelCase and snake_case API payloads.
   - Safe parsing of unknown statuses without runtime exceptions.
6. `test/unit/order_status_test.dart`:
   - Timeline mapping (Placed -> Packed -> Rider Assigned -> In Transit -> Out for Delivery -> Delivered).
   - Cancellation restriction after `PICKED_UP`.
   - Rider detail visibility only from `RIDER_ASSIGNED` onward.
7. `test/unit/tracking_reconnect_test.dart`:
   - WebSocket exponential reconnect and automatic fallback to 10s REST polling.
8. `test/widget/auth_validation_test.dart`:
   - Renders visual gradient hero, brand title, rounded card sheet.
   - Tests inline validation states for invalid phone/email inputs.

---

## Payment & Push Notification Setup

### Razorpay (Test Mode)
The app uses `razorpay_flutter` in test mode:
1. Place your Razorpay test key in `.env` or pass via `--dart-define=RAZORPAY_KEY=rzp_test_xxxx`.
2. Handled via `POST /api/payments/create-order` and `POST /api/payments/verify`.
3. Offline mock automatically falls back to simulated payment confirmation.

### Firebase Cloud Messaging
1. Add `google-services.json` to `android/app/` and `GoogleService-Info.plist` to `ios/Runner/`.
2. Push notifications for order status updates, approaching delivery rider (<=500m), and flash promotions are wired via `firebase_messaging`.

---

## Backend TODOs (Mobile Parity)

The mobile client is built to production standards; the following backend enhancements will complete full live integration:
1. **Token Authentication for Mobile**:
   - Return a JWT bearer token in the body of `POST /api/auth/verify-code` (under `token` or `sessionToken`) in addition to web cookies, allowing `flutter_secure_storage` to persist tokens across app restarts.
2. **Session-based Customer Scoping**:
   - Migrate `/api/cart` and `/api/wishlist` from query parameter scoping (`customer_id=...`) to token-authenticated session context (`req.user.id`).
3. **Live `POST /api/orders` Contract**:
   - Ensure the server computes final delivery fees, stock reservations, and tax on checkout submission, returning `{ id, orderNumber, totalPaise, status: "PLACED" }`.
4. **PDF Invoice Endpoint**:
   - Implement `GET /api/orders/:id/invoice` to return binary PDF stream for direct mobile sharing (currently falls back to the HTML invoice at `/api/invoices/:id?format=html`).
5. **Native OAuth Endpoints**:
   - Add backend endpoints `POST /api/auth/google` and `POST /api/auth/apple` to verify native ID tokens for one-tap Google and Apple authentication.
