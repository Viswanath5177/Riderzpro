import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MeshBackground } from "../glass/MeshBackground";
import { AdminSidebar } from "./AdminSidebar";
import { AdminTopBar } from "./AdminTopBar";
import { CommandPalette } from "../glass/CommandPalette";
import { useAdminStore } from "@/mocks/admin/adminStore";
import { cn } from "@/lib/utils";

export interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { theme } = useAdminStore();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);

  // Global Ctrl/Cmd + K shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div
      className={cn(
        "relative min-h-screen font-sans transition-colors duration-500",
        theme === "light"
          ? "theme-light-glass bg-[#f4f6fb] text-zinc-900"
          : "theme-dark-glass bg-[#0b0d12] text-white"
      )}
    >
      {/* Fixed Animated Mesh Gradient Background */}
      <MeshBackground isLight={theme === "light"} />

      {/* Main Layout Container with 16px inset from viewport edges */}
      <div className="relative z-10 flex min-h-screen p-3 sm:p-4 gap-4">
        {/* Desktop Floating Glass Sidebar */}
        <div className="hidden lg:block shrink-0 sticky top-4 h-[calc(100vh-32px)]">
          <AdminSidebar
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed((prev) => !prev)}
          />
        </div>

        {/* Mobile Slide-In Glass Drawer */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsMobileMenuOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 220 }}
                className="fixed inset-y-0 left-0 w-72 p-3 z-10"
              >
                <AdminSidebar
                  isCollapsed={false}
                  onToggleCollapse={() => setIsMobileMenuOpen(false)}
                  onItemClick={() => setIsMobileMenuOpen(false)}
                />
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Right Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Floating Glass Top Bar */}
          <AdminTopBar
            onOpenCommandPalette={() => setIsCommandPaletteOpen(true)}
            onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          />

          {/* Main Content View with Page Transition */}
          <main className="flex-1 pb-8">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </main>
        </div>
      </div>

      {/* Global Command Palette Modal */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />
    </div>
  );
}
