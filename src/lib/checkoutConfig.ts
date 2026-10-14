// src/lib/checkoutConfig.ts
export const DELHI_PINCODE_MIN = 110001;
export const DELHI_PINCODE_MAX = 110099;
export const COD_FEE_PAISE = 0;
export const COD_MAX_PAISE: number | null = null; // no cap

export const SERVICEABLE_MESSAGE = "Serviceable via Delhivery & Bluedart";
export const NOT_SERVICEABLE_MESSAGE =
  "Currently not available to this address. We deliver only within Delhi (pincodes 110001–110099). Please enter a Delhi address.";
export const INVALID_PINCODE_MESSAGE = "Enter a valid 6-digit pincode.";

export const isValidPincodeFormat = (p: string): boolean => /^\d{6}$/.test((p || "").trim());

export const isDeliverablePincode = (p: string): boolean => {
  const trimmed = (p || "").trim();
  if (!isValidPincodeFormat(trimmed)) return false;
  const num = Number(trimmed);
  return num >= DELHI_PINCODE_MIN && num <= DELHI_PINCODE_MAX;
};
