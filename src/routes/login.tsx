import { createFileRoute } from "@tanstack/react-router";
import riderImg from "@/assets/rider.jpg";
import { Logo, ThemeToggle } from "@/components/site/bits";
import { RolePicker } from "./dashboards";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [
    { title: "Sign in — Riderzpro" },
    { name: "description", content: "Sign in to Riderzpro as a customer, workshop, vendor, rider or admin." },
    { property: "og:title", content: "Sign in — Riderzpro" },
    { property: "og:description", content: "Access your Riderzpro dashboard." },
  ] }),
  component: Login,
});

function Login() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <img src={riderImg} alt="Riderzpro delivery rider" width={1280} height={896} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[oklch(0.1_0_0/0.85)] to-transparent" />
        <p className="absolute bottom-12 left-12 max-w-md font-display text-6xl leading-none text-hero-ink">Every part. Every rider. One app.</p>
      </div>
      <div className="flex flex-col p-6 md:p-12">
        <div className="flex items-center justify-between"><Logo /><ThemeToggle /></div>
        <div className="my-auto py-10">
          <h1 className="font-display text-5xl">Welcome back</h1>
          <p className="mb-8 text-muted-foreground">Demo mode — choose how you want to continue.</p>
          <RolePicker />
        </div>
      </div>
    </div>
  );
}
