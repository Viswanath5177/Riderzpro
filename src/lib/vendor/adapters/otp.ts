import { toast } from "sonner";

interface AttemptRecord {
  attempts: number;
  lockedUntil: number;
}

const attemptsMap = new Map<string, AttemptRecord>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 10 * 60 * 1000; // 10 minutes

export const DEMO_OTP = "123456";

export const otpAdapter = {
  /**
   * Sends an OTP to the given email or phone number.
   */
  async send(channel: "sms" | "email", target: string): Promise<{ success: boolean; message: string }> {
    const key = `${channel}:${target.trim().toLowerCase()}`;
    const record = attemptsMap.get(key);

    if (record && record.lockedUntil > Date.now()) {
      const waitMins = Math.ceil((record.lockedUntil - Date.now()) / 60000);
      return {
        success: false,
        message: `Too many failed attempts. Locked for ${waitMins} more minute(s).`,
      };
    }

    // In demo mode, trigger toast with demo OTP
    toast.info(`Demo OTP for ${channel === "sms" ? "Mobile" : "Email"} (${target}): ${DEMO_OTP}`, {
      duration: 8000,
      description: "Use 123456 to verify in demo mode.",
    });

    return {
      success: true,
      message: `OTP sent successfully to ${target}`,
    };
  },

  /**
   * Verifies the provided 6-digit code against the target.
   */
  async verify(
    channel: "sms" | "email",
    target: string,
    code: string
  ): Promise<{ success: boolean; error?: string }> {
    const key = `${channel}:${target.trim().toLowerCase()}`;
    let record = attemptsMap.get(key);

    if (record && record.lockedUntil > Date.now()) {
      const waitMins = Math.ceil((record.lockedUntil - Date.now()) / 60000);
      return {
        success: false,
        error: `Too many failed attempts. Account locked for ${waitMins} minute(s).`,
      };
    }

    if (!record) {
      record = { attempts: 0, lockedUntil: 0 };
      attemptsMap.set(key, record);
    }

    if (code.trim() === DEMO_OTP) {
      // Reset attempts on successful verification
      attemptsMap.delete(key);
      return { success: true };
    }

    record.attempts += 1;
    if (record.attempts >= MAX_ATTEMPTS) {
      record.lockedUntil = Date.now() + LOCKOUT_MS;
      return {
        success: false,
        error: `Maximum 5 attempts exceeded. Locked for 10 minutes.`,
      };
    }

    const remaining = MAX_ATTEMPTS - record.attempts;
    return {
      success: false,
      error: `Invalid OTP. ${remaining} attempt(s) remaining. (Hint: use ${DEMO_OTP})`,
    };
  },
};
