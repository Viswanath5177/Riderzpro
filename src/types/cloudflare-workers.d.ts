declare module "cloudflare:workers" {
  export const env: {
    HYPERDRIVE?: { connectionString: string };
    DATABASE_URL?: string;
    APP_ENV?: string;
    OTP_HASH_SECRET?: string;
    RESEND_API_KEY?: string;
    RESEND_FROM?: string;
    TWILIO_ACCOUNT_SID?: string;
    TWILIO_AUTH_TOKEN?: string;
    TWILIO_FROM?: string;
  };
}
