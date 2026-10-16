import { toast } from "sonner";

// Safe Capacitor Fallbacks for Web environment
const win = typeof window !== "undefined" ? (window as any) : {};
const Capacitor = win.Capacitor || {
  isNativePlatform: () => false,
  getPlatform: () => "web",
};
const CapApp = win.Capacitor?.Plugins?.App || {
  exitApp: async () => {},
  addListener: async () => ({ remove: () => {} }),
};
const StatusBar = win.Capacitor?.Plugins?.StatusBar || {
  setStyle: async () => {},
  setBackgroundColor: async () => {},
};
const Style = { Dark: "DARK", Light: "LIGHT", Default: "DEFAULT" } as const;
const SplashScreen = win.Capacitor?.Plugins?.SplashScreen || {
  hide: async () => {},
};

/**
 * Custom back handlers stack.
 * Handlers return true if they consumed the back button event, false otherwise.
 */
type BackHandler = () => boolean;
const backHandlers: BackHandler[] = [];

export function registerBackHandler(handler: BackHandler): () => void {
  backHandlers.push(handler);
  return () => {
    const idx = backHandlers.indexOf(handler);
    if (idx !== -1) {
      backHandlers.splice(idx, 1);
    }
  };
}

let lastBackPressTime = 0;
const ROOT_PATHS = [
  "/",
  "/app",
  "/login",
  "/auth",
  "/dashboard/customer",
  "/vendor/dashboard",
  "/vendor/auth",
  "/rider/dashboard",
  "/rider",
  "/admin",
];

/**
 * Determine if current path is a top-level root path where back press should confirm exit.
 */
export function isRootPath(pathname: string): boolean {
  const clean = pathname.replace(/\/+$/, "") || "/";
  return ROOT_PATHS.includes(clean);
}

/**
 * Handle hardware back button press.
 */
export async function handleHardwareBackButton(canGoBackDefault?: boolean): Promise<boolean> {
  // 1. Run top-most custom registered back handler
  for (let i = backHandlers.length - 1; i >= 0; i--) {
    try {
      if (backHandlers[i]()) {
        return true;
      }
    } catch (err) {
      console.error("[Native App] Error in custom back handler:", err);
    }
  }

  // 2. Check for open modals, dialogs, drawers or overlays in the DOM
  if (typeof document !== "undefined") {
    // Check Radix / standard dialogs
    const openDialog = document.querySelector(
      '[role="dialog"][data-state="open"], [aria-modal="true"], .modal-overlay, [data-dialog-open="true"]'
    );
    if (openDialog) {
      // Dispatch Escape key to dismiss dialog
      const escEvent = new KeyboardEvent("keydown", {
        key: "Escape",
        code: "Escape",
        keyCode: 27,
        which: 27,
        bubbles: true,
        cancelable: true,
      });
      document.dispatchEvent(escEvent);
      return true;
    }

    // Check for any visible close button in open modal
    const closeBtn = document.querySelector<HTMLButtonElement>(
      '[role="dialog"] button[aria-label*="close" i], [role="dialog"] button:has(.lucide-x)'
    );
    if (closeBtn) {
      closeBtn.click();
      return true;
    }
  }

  // 3. Navigation History check
  if (typeof window !== "undefined") {
    const currentPath = window.location.pathname;

    // If on a root screen, require double-tap back within 2s to exit app
    if (isRootPath(currentPath)) {
      const now = Date.now();
      if (now - lastBackPressTime < 2000) {
        if (Capacitor.isNativePlatform()) {
          await CapApp.exitApp();
        }
        return true;
      }

      lastBackPressTime = now;
      toast.info("Press back again to exit RiderzPro", {
        duration: 2000,
        id: "native-exit-prompt",
      });
      return false;
    }

    // Otherwise navigate back in history
    if (window.history.length > 1) {
      window.history.back();
      return true;
    }
  }

  return false;
}

/**
 * Enhance keyboard viewport adjustments on mobile touch devices.
 * Automatically scrolls focused input fields into comfortable center view,
 * preventing them from being obscured by soft keyboards on OTP / login forms.
 */
export function setupKeyboardViewportObserver(): () => void {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return () => {};
  }

  const handleFocusIn = (e: FocusEvent) => {
    const target = e.target as HTMLElement;
    if (
      target &&
      (target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.getAttribute("contenteditable") === "true")
    ) {
      // Delay slightly for Android/iOS virtual keyboard animation to finish
      setTimeout(() => {
        try {
          target.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "nearest",
          });
        } catch {
          // Fallback if smooth scroll not supported
          target.scrollIntoView();
        }
      }, 250);
    }
  };

  const handleVisualViewportResize = () => {
    if (window.visualViewport) {
      const heightDiff = window.innerHeight - window.visualViewport.height;
      if (heightDiff > 120) {
        // Virtual keyboard is visible
        document.body.classList.add("keyboard-open");
        document.documentElement.style.setProperty(
          "--keyboard-height",
          `${Math.round(heightDiff)}px`
        );
      } else {
        document.body.classList.remove("keyboard-open");
        document.documentElement.style.removeProperty("--keyboard-height");
      }
    }
  };

  document.addEventListener("focusin", handleFocusIn, { passive: true });
  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", handleVisualViewportResize, {
      passive: true,
    });
  }

  return () => {
    document.removeEventListener("focusin", handleFocusIn);
    if (window.visualViewport) {
      window.visualViewport.removeEventListener("resize", handleVisualViewportResize);
    }
    document.body.classList.remove("keyboard-open");
  };
}

/**
 * Initialize all native Capacitor features:
 * 1. Hardware Back Button handler
 * 2. Status bar styling and safe area readiness
 * 3. Splash screen graceful dismissal
 * 4. Keyboard viewport scroll-into-view
 */
export function initNativeApp(): () => void {
  const cleanups: Array<() => void> = [];

  // Always enable keyboard viewport adaptation (works on mobile browsers & WebViews)
  cleanups.push(setupKeyboardViewportObserver());

  // Set up native-specific Capacitor hooks
  if (Capacitor.isNativePlatform()) {
    // 1. Android Back Button listener
    CapApp.addListener("backButton", async ({ canGoBack }: { canGoBack: boolean }) => {
      await handleHardwareBackButton(canGoBack);
    }).then((listener: any) => {
      cleanups.push(() => listener.remove());
    });

    // 2. Hide Splash Screen smoothly
    SplashScreen.hide({
      fadeOutDuration: 300,
    }).catch(() => {
      // Ignore if splash screen already hidden
    });

    // 3. Status Bar configuration
    StatusBar.setStyle({ style: Style.Dark }).catch(() => {});
    StatusBar.setBackgroundColor({ color: "#14161a" }).catch(() => {});
  }

  return () => {
    cleanups.forEach((cleanup) => {
      try {
        cleanup();
      } catch (err) {
        console.error("[Native App] Cleanup error:", err);
      }
    });
  };
}

export function isNativePlatform(): boolean {
  return Capacitor.isNativePlatform();
}

export function getNativePlatform(): string {
  return Capacitor.getPlatform();
}

export function isMobileDevice(): boolean {
  if (typeof window === "undefined") return false;

  // 1. Native Capacitor platform is always mobile
  if (Capacitor.isNativePlatform()) return true;

  // 2. Already on the mobile customer app route or subroute
  if (window.location.pathname.startsWith("/app")) return true;

  // 3. Explicit mobile query param override
  if (/[?&](platform=mobile|mode=app|mobile=true)/i.test(window.location.search)) return true;

  // 4. Stored session indicator
  try {
    if (sessionStorage.getItem("riderzpro_mobile_client") === "true") return true;
  } catch {}

  // 5. User-agent string detection (phones, tablets, mobile browsers)
  const ua = navigator.userAgent || "";
  const isMobileUA =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|Silk|Kindle/i.test(
      ua
    ) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

  // 6. Viewport width check (phones/tablets up to 840px wide)
  const isNarrowScreen = window.innerWidth <= 840;
  const hasTouchCapability =
    (typeof navigator !== "undefined" && navigator.maxTouchPoints > 0) ||
    "ontouchstart" in window;

  const isMobile = isMobileUA || (isNarrowScreen && hasTouchCapability) || isNarrowScreen;

  if (isMobile) {
    try {
      sessionStorage.setItem("riderzpro_mobile_client", "true");
    } catch {}
  }

  return isMobile;
}

