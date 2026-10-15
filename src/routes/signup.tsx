import { createFileRoute, redirect } from "@tanstack/react-router";
import { VendorSignupFlow } from "@/components/vendor/VendorSignupFlow";

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
  beforeLoad: async ({ search }) => {
    if (search.role !== "vendor") {
      throw redirect({
        to: "/",
        search: {
          openLogin: "customer",
          redirect: (search as any)?.redirect || "/dashboard/customer",
        },
      });
    }
  },
  head: () => ({
    meta: [
      { title: "Vendor Registration — RiderzPro" },
      {
        name: "description",
        content: "Register as an approved EV vendor or supplier on RiderzPro.",
      },
    ],
  }),
  component: SignUpPage,
});

function SignUpPage() {
  return (
    <div className="min-h-screen bg-[#F5F7FA]">
      <VendorSignupFlow />
    </div>
  );
}
