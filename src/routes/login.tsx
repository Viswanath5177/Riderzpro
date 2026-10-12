import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import riderImg from "@/assets/rider.jpg";
import { Logo, ThemeToggle } from "@/components/site/bits";
import { sendSignInCode, verifySignInCode } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({ meta: [
    { title: "Sign in — Riderzpro" },
    { name: "description", content: "Sign in to your Riderzpro account." },
    { property: "og:title", content: "Sign in — Riderzpro" },
    { property: "og:description", content: "Access your Riderzpro account." },
  ] }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [identity, setIdentity] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function requestCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await sendSignInCode(identity);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send a sign-in code.");
    } finally {
      setBusy(false);
    }
  }

  async function confirmCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const role = await verifySignInCode(identity, code);
      await navigate({ to: role === "admin" ? "/dashboard/admin" : "/shop" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not verify the sign-in code.");
    } finally {
      setBusy(false);
    }
  }

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
          <p className="mb-8 text-muted-foreground">Sign in with a phone number or email. Your account role is checked securely.</p>
          <form onSubmit={sent ? confirmCode : requestCode} className="grid max-w-md gap-4">
            {!sent ? (
              <>
                <label htmlFor="identity" className="text-sm font-medium">Phone number or email</label>
                <input id="identity" autoComplete="username" required value={identity} onChange={(event) => setIdentity(event.target.value)} placeholder="+919876543210 or you@example.com" className="h-12 rounded-xl border border-border bg-background px-4" />
                <button disabled={busy} className="h-12 rounded-xl bg-primary px-5 font-semibold text-primary-foreground disabled:opacity-60">{busy ? "Sending…" : "Send sign-in code"}</button>
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground">Enter the code sent to <strong className="text-foreground">{identity}</strong>.</p>
                <label htmlFor="code" className="text-sm font-medium">Sign-in code</label>
                <input id="code" inputMode="numeric" autoComplete="one-time-code" required value={code} onChange={(event) => setCode(event.target.value)} className="h-12 rounded-xl border border-border bg-background px-4" />
                <button disabled={busy} className="h-12 rounded-xl bg-primary px-5 font-semibold text-primary-foreground disabled:opacity-60">{busy ? "Verifying…" : "Verify and continue"}</button>
                <button type="button" onClick={() => { setSent(false); setCode(""); setError(""); }} className="text-sm text-primary underline underline-offset-4">Use a different phone or email</button>
              </>
            )}
            {error && <p role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
