import { validateGstin, derivePanFromGstin } from "../validators";

export interface GstLookupResult {
  gstin: string;
  legalName: string;
  tradeName: string;
  state: string;
  registrationDate: string;
  taxpayerType: string;
  status: "Active" | "Cancelled";
  address: string;
  pan: string;
}

const STATE_CODE_MAP: Record<string, string> = {
  "01": "Jammu & Kashmir",
  "02": "Himachal Pradesh",
  "03": "Punjab",
  "04": "Chandigarh",
  "05": "Uttarakhand",
  "06": "Haryana",
  "07": "Delhi",
  "08": "Rajasthan",
  "09": "Uttar Pradesh",
  "10": "Bihar",
  "11": "Sikkim",
  "12": "Arunachal Pradesh",
  "13": "Nagaland",
  "14": "Manipur",
  "15": "Mizoram",
  "16": "Tripura",
  "17": "Meghalaya",
  "18": "Assam",
  "19": "West Bengal",
  "20": "Jharkhand",
  "21": "Odisha",
  "22": "Chhattisgarh",
  "23": "Madhya Pradesh",
  "24": "Gujarat",
  "27": "Maharashtra",
  "29": "Karnataka",
  "30": "Goa",
  "32": "Kerala",
  "33": "Tamil Nadu",
  "36": "Telangana",
  "37": "Andhra Pradesh",
};

export const gstAdapter = {
  /**
   * Mock GSTIN lookup adapter. In production this connects to GST Portal / Sandbox API.
   */
  async lookup(gstin: string): Promise<GstLookupResult> {
    const check = validateGstin(gstin);
    if (!check.valid) {
      throw new Error(check.error || "Invalid GSTIN format or checksum");
    }

    const clean = gstin.trim().toUpperCase();
    const stateCode = clean.slice(0, 2);
    const stateName = STATE_CODE_MAP[stateCode] || "Karnataka";
    const pan = derivePanFromGstin(clean);

    // Realistic simulation
    await new Promise((resolve) => setTimeout(resolve, 400));

    if (clean === "27AAPFU0939F1ZV") {
      return {
        gstin: clean,
        legalName: "VoltHub Energy Systems Solutions Private Limited",
        tradeName: "VoltHub Mobility & Spares",
        state: stateName,
        registrationDate: "14/08/2021",
        taxpayerType: "Regular",
        status: "Active",
        address: "Plot 42, MIDC Industrial Area, Andheri East, Mumbai, Maharashtra 400093",
        pan,
      };
    }

    if (clean.startsWith("29")) {
      return {
        gstin: clean,
        legalName: "Riderz Spares & Batteries Karnataka LLP",
        tradeName: "EV Power Solutions Indiranagar",
        state: "Karnataka",
        registrationDate: "01/04/2022",
        taxpayerType: "Regular",
        status: "Active",
        address: "742, 100 Feet Road, HAL 2nd Stage, Indiranagar, Bengaluru, Karnataka 560038",
        pan,
      };
    }

    // Generic fallback for any other valid GSTIN
    return {
      gstin: clean,
      legalName: `Auto Parts Retailers (${pan}) Pvt Ltd`,
      tradeName: `EV Spares & Components Hub`,
      state: stateName,
      registrationDate: "10/01/2023",
      taxpayerType: "Regular",
      status: "Active",
      address: `Industrial Estate, Sector 5, ${stateName}`,
      pan,
    };
  },
};
