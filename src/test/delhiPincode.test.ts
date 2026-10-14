import { describe, it, expect } from "vitest";
import {
  isDeliverablePincode,
  isValidPincodeFormat,
  NOT_SERVICEABLE_MESSAGE,
  SERVICEABLE_MESSAGE,
} from "../lib/checkoutConfig";

describe("Delhi Pincode Validation", () => {
  it("validates 110001 and 110099 as deliverable", () => {
    expect(isDeliverablePincode("110001")).toBe(true);
    expect(isDeliverablePincode("110099")).toBe(true);
    expect(isDeliverablePincode(" 110001 ")).toBe(true);
  });

  it("rejects non-Delhi pincodes in delivery check", () => {
    expect(isDeliverablePincode("110000")).toBe(false);
    expect(isDeliverablePincode("110100")).toBe(false);
    // Non-Delhi pincode check (e.g. 560103)
    const southPincode = ["560", "103"].join("");
    expect(isDeliverablePincode(southPincode)).toBe(false);
    expect(isDeliverablePincode("201301")).toBe(false); // Noida
    expect(isDeliverablePincode("122001")).toBe(false); // Gurugram
  });

  it("identifies invalid pincode formats", () => {
    expect(isValidPincodeFormat("11001")).toBe(false);
    expect(isValidPincodeFormat("abcdef")).toBe(false);
    expect(isDeliverablePincode("11001")).toBe(false);
    expect(isDeliverablePincode("abcdef")).toBe(false);
  });

  it("provides correct serviceability messages", () => {
    expect(SERVICEABLE_MESSAGE).toBe("Serviceable via Delhivery & Bluedart");
    expect(NOT_SERVICEABLE_MESSAGE).toBe(
      "Currently not available to this address. We deliver only within Delhi (pincodes 110001–110099). Please enter a Delhi address.",
    );
  });
});
