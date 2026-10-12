import { getSupabase } from "./supabase";

export type AppRole = "customer" | "admin";

function requireSupabase() {
  const supabase = getSupabase();
  if (!supabase) {
    throw new Error("Authentication is not configured. Set the test project's Supabase URL and publishable key in .env.local.");
  }
  return supabase;
}

export function normalizeIdentity(value: string) {
  const identity = value.trim();
  if (identity.includes("@")) return { email: identity.toLowerCase(), type: "email" as const };
  const phone = identity.replace(/[\s()-]/g, "");
  if (!/^\+[1-9]\d{7,14}$/.test(phone)) {
    throw new Error("Enter an email address or a phone number with country code, such as +919876543210.");
  }
  return { phone, type: "sms" as const };
}

export async function sendSignInCode(value: string) {
  const supabase = requireSupabase();
  const identity = normalizeIdentity(value);
  const { error } = await supabase.auth.signInWithOtp({
    ...(identity.type === "email" ? { email: identity.email } : { phone: identity.phone }),
    options: { shouldCreateUser: true },
  });
  if (error) throw error;
  return identity;
}

export async function verifySignInCode(value: string, token: string): Promise<AppRole> {
  const supabase = requireSupabase();
  const identity = normalizeIdentity(value);
  const { data, error } = await supabase.auth.verifyOtp({
    ...(identity.type === "email" ? { email: identity.email } : { phone: identity.phone }),
    token: token.trim(),
    type: identity.type,
  });
  if (error) throw error;
  if (!data.user) throw new Error("The sign-in code was accepted, but no user session was returned.");

  const { data: role, error: roleError } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", data.user.id)
    .maybeSingle();
  if (roleError) throw new Error(`Signed in, but the server role could not be loaded: ${roleError.message}`);
  if (role?.role !== "customer" && role?.role !== "admin") {
    await supabase.auth.signOut();
    throw new Error("This account has no launch role. Contact the Riderzpro team.");
  }
  return role.role;
}

export async function getCurrentRole(): Promise<AppRole | null> {
  const supabase = requireSupabase();
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError) throw authError;
  if (!authData.user) return null;

  const { data, error } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", authData.user.id)
    .maybeSingle();
  if (error) throw error;
  return data?.role === "customer" || data?.role === "admin" ? data.role : null;
}

export async function signOut() {
  const supabase = requireSupabase();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
