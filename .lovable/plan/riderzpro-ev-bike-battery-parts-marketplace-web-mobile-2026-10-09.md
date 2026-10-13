# Riderzpro — EV Bike Battery & Parts Marketplace (Web + Mobile)

One app that works as a polished website on desktop and as an installable app on phones (add-to-home-screen, full-screen, bottom tab bar). Premium, distinctive look with generated photos of EV bikes, battery packs and workshops.

## Visual direction

- Light and dark themes with a toggle (sun/moon) in the header and profile; follows the device setting by default and remembers the choice.
  - Dark: deep graphite background, electric lime accent, soft glass cards.
  - Light: warm off-white background, graphite text, same electric lime accent with deeper green for contrast.
- Bold condensed headings (Bebas Neue / Barlow style), smooth motion.
- Large product photography: battery packs (48V/60V/72V lithium), EV scooters and motorbikes, chargers, BMS, workshop/technician scenes, rider delivery.
- Desktop: top navigation + wide grids. Phone: bottom tab bar, swipe-friendly cards.

## Landing page hero (showpiece)

- Full-screen cinematic photo of an EV bike at night with a glowing battery pack, subtle animated "charge" light lines.
- Huge headline ("Power your ride. Parts that fit.") with the VIN / bike search bar right in the hero — enter VIN or pick make/model/year and jump to compatible parts.
- Floating glass stat cards (vendors, parts, avg delivery time, live riders), a mini "live order tracking" card preview, and two buttons: Shop parts / Talk to AI assistant (mic icon).
- Below: brand logo strip, categories with photos, how-it-works (Find → Compare → One order → Track live), role cards ("I'm a customer / workshop / vendor / rider"), testimonials, app-download style section, footer.

## Dashboards (one per role, each with its own sidebar on desktop and tab bar on phone)

1. **Customer dashboard** — My Garage (saved bikes + VIN), active orders with live map, past orders, saved items, technician bookings.
2. **Workshop / Mechanic dashboard** — bulk ordering for customer bikes, job cards per vehicle, reorder favourites, spend summary, technician booking requests.
3. **Vendor / Dealership dashboard** — sales and revenue charts, incoming orders to accept/reject, inventory and stock alerts, product + fitment management, payouts.
4. **Rider dashboard** — online/offline toggle, nearby delivery requests, accept job, multi-pickup route map, status updates, earnings and ratings.
5. **Admin dashboard** — platform KPIs, users and vendor approvals, fitment/catalog review queue, all orders with live map, delivery fee settings, disputes.

## Customer features

- **Shop & Search** with filters (voltage, Ah, chemistry, brand, price, vendor, distance) and compare up to 3.
- **Product page** — gallery, specs, fitment badge (Compatible / Not compatible / Unknown) for selected bike, offers from multiple vendors with price + ETA.
- **AI Voice Assistant** — hold-to-talk + chat; finds parts, checks fitment, adds to cart; results as product cards.
- **Cart & Checkout** — one order across many vendors, grouped by vendor, distance-based delivery fee per vendor, clear breakdown, ETA, mock payment (UPI/card/COD).
- **Live tracking** — map with moving rider, status timeline; rider name/photo/vehicle and Call/Chat shown only after rider accepts.

## Data & content

Seeded catalog: ~40 batteries/parts, popular Indian EV bikes (Ather, Ola, TVS iQube, Bajaj Chetak, Revolt, Hero Vida), 6 vendors, sample riders and workshops. Prices in INR.

## Technical details

- TanStack Start + Tailwind, mobile-first responsive; PWA manifest so it installs on phones.
- Lovable Cloud: auth with roles (separate roles table: customer, workshop, vendor, rider, admin); tables for bikes, products, fitment, vendors, carts, orders, order_items, deliveries, rider locations, bookings; realtime for live tracking. Role-based redirect to the right dashboard after login.
- Delivery fee: haversine distance per vendor, base + per-km; server-computed totals and ETA.
- Maps: Leaflet + OpenStreetMap, demo simulator moves the rider.
- VIN: validation + manufacturer/year decode, manual fallback.
- Voice assistant: speech-to-text → AI with tools (search, fitment, add to cart). Lovable AI by default; Qwen can be plugged in later with a Qwen API key.
- Charts with Recharts for dashboards; generated photos for hero, categories, products.
- Phases: (1) design system, landing hero, catalog, garage/VIN; (2) cart, multi-vendor checkout, customer dashboard; (3) rider dashboard + live tracking; (4) vendor + workshop dashboards; (5) admin dashboard; (6) voice assistant.
