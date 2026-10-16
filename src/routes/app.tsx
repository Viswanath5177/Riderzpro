import { createFileRoute } from "@tanstack/react-router";
import { AppShell, type AppTab } from "@/components/app/AppShell";

interface AppSearchParams {
  tab?: AppTab;
}

export const Route = createFileRoute("/app")({
  validateSearch: (search: Record<string, unknown>): AppSearchParams => {
    const validTabs: AppTab[] = ["home", "categories", "orders", "account"];
    const tab = typeof search.tab === "string" && validTabs.includes(search.tab as AppTab)
      ? (search.tab as AppTab)
      : "home";
    return { tab };
  },
  head: () => ({
    meta: [
      { title: "Riderzpro Mobile App" },
      {
        name: "description",
        content: "EV bike batteries, chargers, and certified delivery tracking on mobile.",
      },
    ],
  }),
  component: AppPage,
});

function AppPage() {
  const search = Route.useSearch();
  return <AppShell initialTab={search.tab || "home"} />;
}
