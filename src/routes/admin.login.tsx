import { createFileRoute } from "@tanstack/react-router";
import { AdminLogin } from "@/components/admin/AdminLogin";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Admin Console Authentication — RiderzPro" },
      { name: "description", content: "Sign in to the RiderzPro operations and admin console." },
    ],
  }),
  component: AdminLogin,
});
