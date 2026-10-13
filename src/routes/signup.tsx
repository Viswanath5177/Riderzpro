import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { CustomerLogin } from "./login";
import { VendorSignupFlow } from "@/components/vendor/VendorSignupFlow";
import { User, Store } from "lucide-react";

export type SignUpSearch = {
  redirect?: string;
  role?: "customer" | "vendor";
};

export const Route = createFileRoute("/signup")({
  validateSearch: (search: Record<string, unknown>): SignUpSearch => {
    const rawRedirect = search["redirect"];
    const rawRole = search["role"];
    return {
      redirect: typeof rawRedirect === "string" ? rawRedirect : undefined,
      role: rawRole === "vendor" ? "vendor" : "customer",
    };
  },
  head: () => ({
    meta: [
      { title: "Create Your Account — RiderzPro" },
      {
        name: "description",
        content:
          "Register your RiderzPro account to manage your electric motorcycle or scooter garage, or register as a verified vendor.",
      },
      { property: "og:title", content: "Create Your Account — RiderzPro" },
      { property: "og:description", content: "Get parts that fit, delivered by riders you can track." },
    ],
  }),
  component: SignUpPage,
});

function SignUpPage() {
  const search = Route.useSearch();
  const [accountType, setAccountType] = useState<"customer" | "vendor">(
    search.role === "vendor" ? "vendor" : "customer"
  );

  useEffect(() => {
    if (search.role === "vendor") {
      setAccountType("vendor");
    }
  }, [search.role]);

  if (accountType === "vendor") {
    return (
      <div className="min-h-screen bg-[#F5F7FA]">
        {/* Quick switcher bar */}
        <div className="bg-white border-b border-gray-200 py-2.5 px-4 text-center">
          <div className="inline-flex items-center gap-1.5 p-1 rounded-xl bg-gray-100 text-xs font-semibold">
            <button
              onClick={() => setAccountType("customer")}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-gray-600 hover:text-gray-900 transition cursor-pointer"
            >
              <User className="h-3.5 w-3.5" /> Customer Registration
            </button>
            <button
              onClick={() => setAccountType("vendor")}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-white text-[#0066cc] font-bold shadow-xs cursor-pointer"
            >
              <Store className="h-3.5 w-3.5" /> Vendor / Seller Registration
            </button>
          </div>
        </div>
        <VendorSignupFlow />
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Subtle top banner inviting sellers to register */}
      <div className="bg-blue-50 border-b border-blue-100 py-2 px-4 text-center text-xs text-blue-900 font-medium">
        <span>Are you an automotive parts supplier or EV manufacturer? </span>
        <button
          onClick={() => setAccountType("vendor")}
          className="font-bold text-[#0066cc] hover:underline cursor-pointer inline-flex items-center gap-1 ml-1"
        >
          <Store className="h-3.5 w-3.5" /> Register as a Vendor & Seller →
        </button>
      </div>
      <CustomerLogin defaultTab="signup" />
    </div>
  );
}
