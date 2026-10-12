import { createFileRoute, Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";
import riderImg from "@/assets/rider.jpg";
import { Logo } from "@/components/site/bits";
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
    <div className="grid min-h-screen lg:grid-cols-2 bg-background">
      <div className="relative hidden lg:block overflow-hidden">
        <img src={riderImg} alt="Riderzpro delivery rider" width={1280} height={896} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        <p className="absolute bottom-12 left-12 max-w-md font-display text-4xl font-extrabold tracking-tight text-white leading-tight">Every part. Every rider. One app.</p>
      </div>
      <div className="flex flex-col p-6 md:p-12">
        <div className="flex items-center justify-between">
          <Logo />
          <Link
            to="/assistant"
            className="flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary backdrop-blur-xl shadow-xs transition hover:bg-primary hover:text-primary-foreground"
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>AI Assistant</span>
          </Link>
        </div>
        <div className="my-auto py-10">
          <h1 className="font-display text-4xl md:text-5xl font-extrabold tracking-tight">Welcome back</h1>
          <p className="mb-8 mt-2 text-muted-foreground">Demo mode — choose how you want to continue.</p>
          <RolePicker />
        </div>
      </div>
    </div>
  );
}
