import type { CapacitorConfig } from "@capacitor/cli";

// Point Capacitor app at the deployed server URL (or LAN/staging fallback in dev)
// so all authentication, REST APIs, and WebSockets work natively in Android/iOS builds.
const serverUrl =
  process.env.CAPACITOR_SERVER_URL ||
  process.env.VITE_APP_URL ||
  "https://app.riderzpro.com";

const config: CapacitorConfig = {
  appId: "com.riderzpro.app",
  appName: "Riderzpro",
  webDir: "dist/client",
  backgroundColor: "#14161a",
  server: {
    url: serverUrl,
    cleartext: true,
    androidScheme: "https",
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      launchAutoHide: true,
      backgroundColor: "#14161a",
      androidSplashResourceName: "splash",
      androidScaleType: "CENTER_CROP",
      showSpinner: false,
    },
    StatusBar: {
      style: "DARK",
      backgroundColor: "#14161a",
    },
  },
};

export default config;
