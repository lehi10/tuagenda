"use client";

import { useState } from "react";
import { Share2, Headphones } from "lucide-react";
import { SidebarTrigger } from "@/client/components/ui/sidebar";
import { Separator } from "@/client/components/ui/separator";
import { Button } from "@/client/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/client/components/ui/tooltip";
import { useBusiness } from "@/client/contexts";
import { BookingShareDialog } from "@/client/features/business/components/booking-share-dialog";

const SUPPORT_WHATSAPP = process.env.NEXT_PUBLIC_SUPPORT_WHATSAPP_NUMBER;

export function AppHeader() {
  const { currentBusiness } = useBusiness();
  const [shareOpen, setShareOpen] = useState(false);

  const bookingUrl = currentBusiness
    ? `${typeof window !== "undefined" ? window.location.origin : ""}/${currentBusiness.slug}`
    : "";

  const supportUrl = SUPPORT_WHATSAPP
    ? `https://wa.me/${SUPPORT_WHATSAPP}?text=${encodeURIComponent("Hola, necesito soporte con TuAgenda")}`
    : null;

  return (
    <>
      <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex flex-1 items-center gap-2 px-3">
          {/* Left: sidebar trigger + business logo/name */}
          <SidebarTrigger />
          <Separator orientation="vertical" className="h-4" />

          {/* Dev badge */}
          {process.env.NODE_ENV === "development" && (
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
              desarrollo
            </span>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Right: quick actions */}
          <TooltipProvider>
            <div className="flex items-center gap-1">
              {currentBusiness && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => setShareOpen(true)}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Página de reservas</TooltipContent>
                </Tooltip>
              )}

              {supportUrl && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      asChild
                    >
                      <a
                        href={supportUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Headphones className="h-4 w-4" />
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Soporte por WhatsApp</TooltipContent>
                </Tooltip>
              )}
            </div>
          </TooltipProvider>
        </div>
      </header>

      {currentBusiness && (
        <BookingShareDialog
          open={shareOpen}
          onOpenChange={setShareOpen}
          businessTitle={currentBusiness.title}
          bookingUrl={bookingUrl}
        />
      )}
    </>
  );
}
