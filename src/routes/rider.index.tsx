import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Bike, LockKeyhole, Mail, Phone } from "lucide-react";

export const Route = createFileRoute("/rider/")({
  component: RiderSignIn,
});

function RiderSignIn() {
  const navigate = useNavigate();
  const [identity, setIdentity] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: identity.trim(), password }),
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.error || "Sign in failed.");
      if (data.role !== "rider") {
        await fetch("/api/auth/signout", { method: "POST", credentials: "include" });
        throw new Error("This sign-in is for rider accounts. Use your rider credentials.");
      }
      await navigate({ to: "/rider/dashboard" });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not sign in. Try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10 text-white">
      <form onSubmit={submit} className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl">
        <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/15 text-red-400"><Bike /></div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-red-400">Riderzpro</p>
        <h1 className="mt-2 text-3xl font-bold">Rider sign in</h1>
        <p className="mt-2 text-sm text-slate-400">Use your Riderzpro account to view assigned deliveries.</p>
        <label className="mt-7 block text-sm font-medium" htmlFor="rider-identity">Email or phone</label>
        <div className="mt-2 flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-4">
          {identity.includes("@") ? <Mail className="h-4 w-4 text-slate-400" /> : <Phone className="h-4 w-4 text-slate-400" />}
          <input id="rider-identity" autoComplete="username" required value={identity} onChange={(event) => setIdentity(event.target.value)} className="h-12 w-full bg-transparent text-sm outline-none" />
        </div>
        <label className="mt-5 block text-sm font-medium" htmlFor="rider-password">Password</label>
        <div className="mt-2 flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 px-4">
          <LockKeyhole className="h-4 w-4 text-slate-400" />
          <input id="rider-password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="h-12 w-full bg-transparent text-sm outline-none" />
        </div>
        {error && <p role="alert" className="mt-4 text-sm text-red-300">{error}</p>}
        <button disabled={busy} className="mt-7 h-12 w-full rounded-xl bg-red-500 font-semibold text-white transition hover:bg-red-400 disabled:cursor-wait disabled:opacity-60">
          {busy ? "Signing in…" : "Sign in to rider panel"}
        </button>
      </form>
    </main>
  );
}
