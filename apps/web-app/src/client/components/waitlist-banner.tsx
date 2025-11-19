/**
 * Waitlist Banner Component
 *
 * Displays a banner at the top of the client area informing users that
 * the app is in construction and inviting them to join the waitlist.
 *
 * Features:
 * - Only shows in production
 * - Can be dismissed (saved in localStorage)
 * - Links to Google Form waitlist
 * - Uses brand colors
 */

"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/client/components/ui/button";

const STORAGE_KEY = "waitlist-banner-dismissed";
const WAITLIST_URL = "https://forms.gle/A8857tkP3b5j1iug6";

export function WaitlistBanner() {
  const [isDismissed, setIsDismissed] = useState(true); // Start as true to avoid flash
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only show in production
    if (process.env.NODE_ENV !== "production") {
      return;
    }

    // Check if user has already dismissed the banner
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (!dismissed) {
      setIsDismissed(false);
      // Small delay for smooth animation
      setTimeout(() => setIsVisible(true), 100);
    }
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
    // Wait for animation to complete before removing from DOM
    setTimeout(() => {
      setIsDismissed(true);
      localStorage.setItem(STORAGE_KEY, "true");
    }, 300);
  };

  const handleJoinWaitlist = () => {
    window.open(WAITLIST_URL, "_blank");
  };

  // Don't render if dismissed or not in production
  if (isDismissed) {
    return null;
  }

  return (
    <div
      className={`
        fixed top-0 left-0 right-0 z-50
        bg-gradient-to-r from-primary via-primary/95 to-primary/90
        text-primary-foreground
        shadow-lg
        transition-all duration-300 ease-in-out
        ${isVisible ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"}
      `}
    >
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Message */}
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-lg flex-shrink-0">🚧</span>
            <p className="text-sm md:text-base font-medium">
              <span className="font-bold">¡Gracias por visitarnos!</span>{" "}
              <span className="hidden sm:inline">
                Estamos en construcción.{" "}
              </span>
              <span className="font-semibold">
                Únete a nuestra lista de espera
              </span>{" "}
              y sé de los primeros en acceder cuando lancemos.
            </p>
          </div>

          {/* CTA Button */}
          <Button
            onClick={handleJoinWaitlist}
            variant="secondary"
            size="sm"
            className="flex-shrink-0 font-semibold hover:scale-105 transition-transform"
          >
            Unirme
          </Button>

          {/* Close Button */}
          <button
            onClick={handleDismiss}
            className="flex-shrink-0 p-1 hover:bg-white/20 rounded-full transition-colors"
            aria-label="Cerrar banner"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
