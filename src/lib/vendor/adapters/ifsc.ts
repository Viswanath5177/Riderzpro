import { validateIfsc } from "../validators";

export interface IfscLookupResult {
  ifsc: string;
  bankName: string;
  branch: string;
  city: string;
  state: string;
}

const BANK_PREFIXES: Record<string, string> = {
  HDFC: "HDFC Bank",
  ICIC: "ICICI Bank",
  SBIN: "State Bank of India",
  UTIB: "Axis Bank",
  KKBK: "Kotak Mahindra Bank",
  PUNB: "Punjab National Bank",
  BARB: "Bank of Baroda",
  CNRB: "Canara Bank",
  IDIB: "Indian Bank",
  YESB: "Yes Bank",
  INDB: "IndusInd Bank",
};

export const ifscAdapter = {
  async lookup(ifsc: string): Promise<IfscLookupResult> {
    const clean = ifsc.trim().toUpperCase();
    if (!validateIfsc(clean)) {
      throw new Error("Invalid 11-character IFSC code");
    }

    await new Promise((resolve) => setTimeout(resolve, 300));

    const prefix = clean.slice(0, 4);
    const bankName = BANK_PREFIXES[prefix] || `${prefix} Commercial Bank`;

    let branch = "Main Branch";
    let city = "Bengaluru";
    let state = "Karnataka";

    if (clean.includes("0002") || clean.includes("0038")) {
      branch = "Indiranagar Branch";
      city = "Bengaluru";
      state = "Karnataka";
    } else if (clean.includes("0034")) {
      branch = "Koramangala Branch";
      city = "Bengaluru";
      state = "Karnataka";
    } else if (clean.includes("0093")) {
      branch = "MIDC Andheri East Branch";
      city = "Mumbai";
      state = "Maharashtra";
    }

    return {
      ifsc: clean,
      bankName,
      branch,
      city,
      state,
    };
  },
};
