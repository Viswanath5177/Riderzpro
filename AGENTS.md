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

- Marketplace data and pricing live in `src/lib/data.ts` and `src/lib/store.tsx` (browser-side demo state); replace them with server-side SQL queries (SQLite locally, PostgreSQL in production) when the database is ready — keeps every screen on one data seam.
- Customer pages wrap content in `SiteLayout`; role dashboards use `DashboardShell` — keeps web nav and phone tab bar consistent per surface.
- tsconfig strict index/optional flags are relaxed — mock-data heavy UI code was fighting them with no safety gain.
