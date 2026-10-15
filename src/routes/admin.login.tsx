import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import {
  Mail,
  Lock,
  ArrowRight,
  Eye,
  EyeOff,
  ShieldAlert,
  ShieldCheck,
  Zap,
  KeyRound,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/site/bits";

export interface AdminLoginSearch {
  redirect?: string;
  role?: string;
}

export const Route = createFileRoute("/admin/login")({
  validateSearch: (search: Record<string, unknown>): AdminLoginSearch => {
    return {
      redirect: typeof search["redirect"] === "string" ? search["redirect"] : undefined,
      role: typeof search["role"] === "string" ? search["role"] : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Admin Portal Sign In — RiderzPro" },
      {
        name: "description",
        content: "Sign in to RiderzPro Super Admin or Unified Operations Admin console.",
      },
    ],
  }),
  component: AdminLoginRouteComponent,
});

function AdminLoginRouteComponent() {
  const navigate = useNavigate();
  const search = useSearch({ from: "/admin/login" });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setErrorMessage("Please enter a valid administrator email address.");
      return;
    }
    if (!password) {
      setErrorMessage("Please enter your account password.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: cleanEmail,
          password,
          authType: "password",
          portal: "admin",
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Authentication failed. Invalid administrator credentials.");
      }

      const userObj = data.user;
      const role = data.role;

      // Store in localStorage for client state persistence
      const sessionUser = {
        id: userObj.id,
        name: userObj.fullName || "Administrator",
        email: userObj.email,
        role: role,
      };

      localStorage.setItem("riderzpro_auth_user", JSON.stringify(sessionUser));
      localStorage.setItem("riderzpro_auth_token", "session_active");
      localStorage.setItem("riderzpro_token", "session_active");

      const adminSession = {
        token: "session_active",
        role: "admin",
        user: {
          id: userObj.id,
          name: userObj.fullName || "Administrator",
          email: userObj.email,
          role: "admin",
          roleTitle:
            role === "SUPER_ADMIN" ? "Super Administrator" : "Operations Administrator",
          department:
            role === "SUPER_ADMIN"
              ? "Executive Platform Oversight"
              : "Seller Compliance & Product Catalog Moderation",
        },
        loginTime: Date.now(),
      };
      localStorage.setItem("riderzpro_admin_session", JSON.stringify(adminSession));

      toast.success(`Welcome back, ${sessionUser.name}!`);

      // Authoritative destination
      let destination =
        role === "SUPER_ADMIN" || role === "super_admin" ? "/superadmin" : "/admin";

      if (search?.redirect && !search.redirect.includes("/login")) {
        destination = search.redirect;
      }

      navigate({ to: destination as any }).catch(() => {
        window.location.href = destination;
      });

      setTimeout(() => {
        if (window.location.pathname !== destination.split("?")[0]) {
          window.location.href = destination;
        }
      }, 200);
    } catch (err: any) {
      setErrorMessage(err?.message || "Sign in failed.");
      toast.error(err?.message || "Authentication error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillQuickCredentials = (adminEmail: string) => {
    setEmail(adminEmail);
    setPassword("Admin@123");
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center">
          <Logo imgClassName="h-12 w-auto" />
        </div>
        <div className="mt-4 flex items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-lg bg-[#E31E24] px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-white shadow-xs">
            <ShieldAlert className="h-3 w-3" /> ADMINISTRATIVE GATEWAY
          </span>
        </div>
        <h2 className="mt-2 text-2xl sm:text-3xl font-black tracking-tight text-[#111111]">
          Sign in to Admin Console
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-[#6B7280]">
          Super Admin platform control & Unified Operations administration
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="rounded-3xl border border-[#E5E7EB] bg-white p-6 sm:p-8 shadow-sm">
          {errorMessage && (
            <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-800 flex items-start gap-2.5">
              <span className="font-bold text-red-600 mt-0.5">!</span>
              <p className="leading-relaxed">{errorMessage}</p>
            </div>
          )}

          <form onSubmit={handleSignIn} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700">
                Administrator Email Address
              </label>
              <div className="mt-1.5 relative rounded-2xl shadow-2xs">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@riderzpro.com"
                  required
                  className="block w-full rounded-2xl border border-gray-200 py-3 pl-10 pr-3 text-xs text-gray-900 placeholder:text-gray-400 focus:border-[#E31E24] focus:outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700">
                Password
              </label>
              <div className="mt-1.5 relative rounded-2xl shadow-2xs">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="block w-full rounded-2xl border border-gray-200 py-3 pl-10 pr-10 text-xs text-gray-900 placeholder:text-gray-400 focus:border-[#E31E24] focus:outline-none transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#E31E24] hover:bg-[#CC181E] py-3 text-xs font-bold text-white shadow-xs transition active:scale-[0.99] disabled:opacity-60 cursor-pointer"
            >
              <span>{isSubmitting ? "Verifying Credentials..." : "Sign In to Console"}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          {/* Verified Baseline Credentials Helper Card */}
          <div className="mt-6 border-t border-gray-100 pt-5 space-y-3">
            <div className="flex items-center gap-1.5 text-gray-500 text-[11px] font-bold uppercase tracking-wider">
              <KeyRound className="h-3.5 w-3.5 text-[#E31E24]" />
              <span>Verified System Accounts</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => fillQuickCredentials("admin@riderzpro.com")}
                className="text-left rounded-xl border border-gray-200 bg-gray-50/80 hover:bg-red-50 hover:border-red-200 p-2.5 transition cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900">Super Admin</span>
                  <span className="rounded bg-red-100 px-1.5 py-0.2 text-[9px] font-bold text-[#E31E24]">
                    /superadmin
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 mt-0.5 truncate">admin@riderzpro.com</p>
                <p className="text-[10px] text-emerald-600 font-medium">Click to fill</p>
              </button>

              <button
                type="button"
                onClick={() => fillQuickCredentials("admin.operations@riderzpro.com")}
                className="text-left rounded-xl border border-gray-200 bg-gray-50/80 hover:bg-blue-50 hover:border-blue-200 p-2.5 transition cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-900">Unified Admin</span>
                  <span className="rounded bg-blue-100 px-1.5 py-0.2 text-[9px] font-bold text-blue-800">
                    /admin
                  </span>
                </div>
                <p className="text-[11px] text-gray-500 mt-0.5 truncate">admin.operations@riderzpro.com</p>
                <p className="text-[10px] text-emerald-600 font-medium">Click to fill</p>
              </button>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-gray-500">
          Protected Administrative Gateway · RiderzPro Multi-Vendor Operations
        </p>
      </div>
    </div>
  );
}
