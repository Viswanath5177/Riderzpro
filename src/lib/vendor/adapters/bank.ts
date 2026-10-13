export interface BankVerificationResult {
  verified: boolean;
  registeredName: string;
  nameMatchScore: number; // 0 to 100
  referenceId: string;
  error?: string;
}

export const bankAdapter = {
  /**
   * Simulates an NPCI/RazorpayX Penny Drop verification.
   * Deposits ₹1 into the account to fetch the legal account holder name from the bank switch.
   */
  async verify(
    accountNo: string,
    ifsc: string,
    holderName: string
  ): Promise<BankVerificationResult> {
    const cleanAccount = accountNo.trim();
    const cleanIfsc = ifsc.trim().toUpperCase();
    const cleanHolder = holderName.trim().toUpperCase();

    await new Promise((resolve) => setTimeout(resolve, 600));

    // Reject suspicious dummy numbers
    if (cleanAccount.length < 9 || cleanAccount === "000000000") {
      return {
        verified: false,
        registeredName: "",
        nameMatchScore: 0,
        referenceId: `REF_FAIL_${Date.now()}`,
        error: "Bank rejected account verification: Invalid account number",
      };
    }

    // In demo mode, return the provided holder name or close variant with high match score
    const registeredName = cleanHolder || "VERIFIED HOLDER";
    return {
      verified: true,
      registeredName,
      nameMatchScore: 98,
      referenceId: `NPCI_PD_${Date.now().toString(36).toUpperCase()}`,
    };
  },
};
