import { Capacitor } from "@capacitor/core";
import { App as CapApp } from "@capacitor/app";
import { StatusBar, Style } from "@capacitor/status-bar";
import { SplashScreen } from "@capacitor/splash-screen";
import { Network } from "@capacitor/network";
import { Haptics, ImpactStyle, NotificationType } from "@capacitor/haptics";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const isNative = Capacitor.isNativePlatform();

/**
 * Initializes native shell features (status bar, splash screen, back button, network monitor)
 */
export function useNativeShell() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    if (!isNative) return;

    // 1. Status Bar Setup
    StatusBar.setStyle({ style: Style.Dark }).catch(() => {});
    StatusBar.setBackgroundColor({ color: "#14161a" }).catch(() => {});

    // 2. Hide Splash Screen cleanly after React has mounted
    SplashScreen.hide().catch(() => {});

    // 3. Android Hardware Back Button Handling
    const backListener = CapApp.addListener("backButton", ({ canGoBack }) => {
      const currentPath = window.location.pathname;
      if (canGoBack && currentPath !== "/" && currentPath !== "") {
        window.history.back();
      } else {
        CapApp.exitApp();
      }
    });

    // 4. Network Status Monitoring
    Network.getStatus().then((status) => {
      setIsOnline(status.connected);
    });

    const netListener = Network.addListener("networkStatusChange", (status) => {
      setIsOnline(status.connected);
      if (!status.connected) {
        toast.error("No Internet Connection", {
          description: "You are currently offline. Showing cached catalogue.",
          duration: 5000,
        });
      } else {
        toast.success("Back Online", {
          description: "Internet connection restored.",
          duration: 3000,
        });
      }
    });

    return () => {
      backListener.then((l) => l.remove());
      netListener.then((l) => l.remove());
    };
  }, []);

  return { isOnline, isNative };
}

/**
 * Trigger native haptic feedback (safe on web and native)
 */
export function triggerHaptic(type: "light" | "medium" | "heavy" | "success" | "error" = "light") {
  if (!isNative) return;

  switch (type) {
    case "light":
      Haptics.impact({ style: ImpactStyle.Light }).catch(() => {});
      break;
    case "medium":
      Haptics.impact({ style: ImpactStyle.Medium }).catch(() => {});
      break;
    case "heavy":
      Haptics.impact({ style: ImpactStyle.Heavy }).catch(() => {});
      break;
    case "success":
      Haptics.notification({ type: NotificationType.Success }).catch(() => {});
      break;
    case "error":
      Haptics.notification({ type: NotificationType.Error }).catch(() => {});
      break;
  }
}
