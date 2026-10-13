<!-- LOVABLE:BEGIN -->

> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

<!-- LOVABLE:END -->

- Marketplace data and pricing live in `src/lib/data.ts`, `src/lib/store.tsx`, `src/lib/vendor/` and `src/lib/catalogue.ts` (browser-side demo state); replace them with server-side SQL queries (SQLite locally, PostgreSQL in production) when the database is ready — keeps every screen on one data seam.
- Vendor Store and Products: Vendor data lives in `src/lib/vendor/` (`vendorStore.tsx`, `vendorAuth.tsx`, `types.ts`, `adapters/`). Image blobs are stored in native IndexedDB via `storageAdapter` to respect the 5 MB localStorage quota.
- Product Visibility Gate: Products are shown to customers ONLY if `status === "live"` AND the vendor is `approved` and NOT `suspended` or on `holidayMode`. Products in draft, pending review, changes requested, or rejected state are excluded from shop, search, compare, AI assistant, and direct URLs (`/product/$id`).
- Customer pages wrap content in `SiteLayout`; role dashboards use `DashboardShell` (customer and vendor dashboards use white sidebar with signature red active state; admin console uses dark glass styling) — keeps web nav and phone tab bar consistent per surface.
- tsconfig strict index/optional flags are relaxed — mock-data heavy UI code was fighting them with no safety gain.
