// @vitest-environment jsdom
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  isRootPath,
  registerBackHandler,
  handleHardwareBackButton,
  setupKeyboardViewportObserver,
  initNativeApp,
  isNativePlatform,
  getNativePlatform,
} from "@/lib/native/app";

describe("Native App & Back Button Module (Aakash After Lunch)", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.restoreAllMocks();
    document.body.innerHTML = "";
    document.body.classList.remove("keyboard-open");
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe("isRootPath", () => {
    it("identifies top-level root screens correctly", () => {
      expect(isRootPath("/")).toBe(true);
      expect(isRootPath("/dashboard/customer")).toBe(true);
      expect(isRootPath("/vendor/dashboard")).toBe(true);
      expect(isRootPath("/rider/dashboard")).toBe(true);
      expect(isRootPath("/login")).toBe(true);
      expect(isRootPath("/admin")).toBe(true);
    });

    it("identifies nested screens as non-root", () => {
      expect(isRootPath("/shop")).toBe(false);
      expect(isRootPath("/product/prod_123")).toBe(false);
      expect(isRootPath("/track/del_456")).toBe(false);
      expect(isRootPath("/cart")).toBe(false);
    });
  });

  describe("registerBackHandler", () => {
    it("runs custom handlers and consumes event when returning true", async () => {
      const handler = vi.fn().mockReturnValue(true);
      const unregister = registerBackHandler(handler);

      const handled = await handleHardwareBackButton();
      expect(handled).toBe(true);
      expect(handler).toHaveBeenCalledTimes(1);

      unregister();

      const handledAfter = await handleHardwareBackButton();
      expect(handler).toHaveBeenCalledTimes(1); // not called again
    });

    it("falls through if custom handler returns false", async () => {
      const handler = vi.fn().mockReturnValue(false);
      const unregister = registerBackHandler(handler);

      // Create a dummy dialog to consume fall-through
      const dialog = document.createElement("div");
      dialog.setAttribute("role", "dialog");
      dialog.setAttribute("data-state", "open");
      document.body.appendChild(dialog);

      const handled = await handleHardwareBackButton();
      expect(handler).toHaveBeenCalledTimes(1);
      expect(handled).toBe(true); // handled by dialog dismissal

      unregister();
    });
  });

  describe("handleHardwareBackButton with open dialogs", () => {
    it("dispatches Escape event to dismiss open dialogs", async () => {
      const dialog = document.createElement("div");
      dialog.setAttribute("role", "dialog");
      dialog.setAttribute("data-state", "open");
      document.body.appendChild(dialog);

      let escFired = false;
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          escFired = true;
        }
      });

      const handled = await handleHardwareBackButton();
      expect(handled).toBe(true);
      expect(escFired).toBe(true);
    });
  });

  describe("setupKeyboardViewportObserver", () => {
    it("adds focusin listener and returns cleanup function", () => {
      const cleanup = setupKeyboardViewportObserver();
      expect(typeof cleanup).toBe("function");

      const input = document.createElement("input");
      input.type = "text";
      document.body.appendChild(input);

      input.scrollIntoView = vi.fn();
      input.dispatchEvent(new FocusEvent("focusin", { bubbles: true }));

      vi.advanceTimersByTime(300);
      expect(input.scrollIntoView).toHaveBeenCalled();

      cleanup();
    });
  });

  describe("initNativeApp", () => {
    it("initializes without throwing and returns cleanup function", () => {
      const cleanup = initNativeApp();
      expect(typeof cleanup).toBe("function");
      cleanup();
    });

    it("exposes platform query functions", () => {
      expect(typeof isNativePlatform).toBe("function");
      expect(typeof getNativePlatform).toBe("function");
      expect(isNativePlatform()).toBe(false); // In jsdom test environment
    });
  });
});
