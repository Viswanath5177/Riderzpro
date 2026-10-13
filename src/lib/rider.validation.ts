export const RIDER_LAUNCH_STATES = ["Andhra Pradesh", "Telangana"] as const;

export function normalizeIndiaPhone(input: string) {
  const digits = input.replace(/\D/g, "");
  const national = digits.length === 10 ? digits : digits.length === 12 && digits.startsWith("91") ? digits.slice(2) : "";
  if (!/^[6-9]\d{9}$/.test(national)) throw new Error("Enter a valid Indian mobile number (10 digits or +91 followed by 10 digits).");
  return `+91${national}`;
}
