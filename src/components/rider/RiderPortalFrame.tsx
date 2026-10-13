import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Bike, MoveLeft } from "lucide-react";

export function RiderPortalFrame({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F5F7F8] text-[#17252D]">
      <header className="border-b border-[#DCE5E8] bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/rider" className="inline-flex items-center gap-2 font-bold tracking-tight">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-700 text-white"><Bike className="h-5 w-5" /></span>
            <span>Riderzpro <span className="font-medium text-emerald-700">Rider</span></span>
          </Link>
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-emerald-800">
            <MoveLeft className="h-4 w-4" /> Customer store
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">{children}</main>
    </div>
  );
}
