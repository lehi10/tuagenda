"use client";

import { useState } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";
import { Button } from "@/client/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/client/components/ui/dialog";
import { Input } from "@/client/components/ui/input";
import { toast } from "sonner";

interface BookingShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  businessTitle: string;
  bookingUrl: string;
}

// Simple SVG icons for social networks not available in lucide
function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

export function BookingShareDialog({
  open,
  onOpenChange,
  businessTitle,
  bookingUrl,
}: BookingShareDialogProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(bookingUrl);
    setCopied(true);
    toast.success("URL copiada al portapapeles");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareMessage = `Reserva tu cita en ${businessTitle}`;

  const socialLinks = [
    {
      label: "WhatsApp",
      icon: <WhatsAppIcon />,
      className: "bg-[#25D366] hover:bg-[#1ebe5a] text-white",
      href: `https://wa.me/?text=${encodeURIComponent(`${shareMessage}\n${bookingUrl}`)}`,
    },
    {
      label: "X",
      icon: <XIcon />,
      className: "bg-black hover:bg-neutral-800 text-white",
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareMessage)}&url=${encodeURIComponent(bookingUrl)}`,
    },
    {
      label: "Facebook",
      icon: <FacebookIcon />,
      className: "bg-[#1877F2] hover:bg-[#0e6ae0] text-white",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(bookingUrl)}`,
    },
  ];

  const handleNativeShare = async () => {
    await navigator.share({ title: shareMessage, url: bookingUrl });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Compartir página de reservas</DialogTitle>
          <DialogDescription>
            Comparte el enlace de reservas de{" "}
            <span className="font-medium text-foreground">{businessTitle}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* URL + copy */}
          <div className="flex gap-2">
            <Input value={bookingUrl} readOnly className="text-sm" />
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopy}
              className="shrink-0"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0"
              asChild
            >
              <a href={bookingUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>

          {/* Social share */}
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
              Compartir en redes
            </p>
            <div className="flex gap-2">
              {socialLinks.map(({ label, icon, className, href }) => (
                <Button
                  key={label}
                  className={`flex-1 gap-2 ${className}`}
                  asChild
                >
                  <a href={href} target="_blank" rel="noopener noreferrer">
                    {icon}
                    {label}
                  </a>
                </Button>
              ))}

              {typeof navigator !== "undefined" && "share" in navigator && (
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleNativeShare}
                >
                  Más
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
