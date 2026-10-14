import type { CapacitorConfig } from "@capacitor/cli";

// If a remote server URL is explicitly provided (e.g. staging or production once deployed),
// point Capacitor at it. Otherwise, omit server.url so Capacitor serves the bundled local
// web assets directly from the device — launching instantly without DNS/network dependencies.
const serverUrl = process.env.CAPACITOR_SERVER_URL || process.env.VITE_APP_URL;

const config: CapacitorConfig = {
  appId: "com.riderzpro.app",
  appName: "Riderzpro",
  webDir: "dist/client",
  backgroundColor: "#14161a",
  server: {
    ...(serverUrl ? { url: serverUrl } : {}),
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
