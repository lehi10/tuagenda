"use client";

import { useState, useCallback, useEffect } from "react";
import { ChevronLeft, ChevronRight, X, ImageOff } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/client/components/ui/dialog";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { cn } from "@/client/lib/utils";

interface ImageGalleryProps {
  images: string[];
  alt?: string;
  maxVisible?: number;
  className?: string;
}

function GalleryImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [broken, setBroken] = useState(false);

  if (broken) {
    return (
      <div
        className={cn(
          "w-full h-full flex items-center justify-center bg-muted",
          className
        )}
      >
        <ImageOff className="h-5 w-5 text-muted-foreground/40" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={cn("w-full h-full object-cover", className)}
      onError={() => setBroken(true)}
    />
  );
}

export function ImageGallery({
  images,
  alt = "Image",
  maxVisible = 3,
  className,
}: ImageGalleryProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const visible = images.slice(0, maxVisible);
  const remaining = images.length - maxVisible;

  const openAt = (index: number) => {
    setActiveIndex(index);
    setOpen(true);
  };

  const prev = useCallback(() => {
    setActiveIndex((i) => (i - 1 + images.length) % images.length);
  }, [images.length]);

  const next = useCallback(() => {
    setActiveIndex((i) => (i + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, prev, next]);

  if (images.length === 0) return null;

  const gridClass =
    visible.length === 1
      ? "grid-cols-1 max-w-[140px]"
      : visible.length === 2
        ? "grid-cols-2"
        : "grid-cols-3";

  return (
    <>
      <div className={cn("grid gap-2", gridClass, className)}>
        {visible.map((url, i) => {
          const isLast = i === maxVisible - 1 && remaining > 0;
          return (
            <button
              key={i}
              type="button"
              onClick={() => openAt(i)}
              className="relative aspect-square rounded-xl overflow-hidden bg-muted border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <GalleryImage src={url} alt={`${alt} ${i + 1}`} />
              {isLast && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                  <span className="text-white text-xl font-bold">
                    +{remaining + 1}
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton={false}
          className="p-0 border-0 bg-black/90 max-w-screen-sm w-full overflow-hidden"
        >
          <VisuallyHidden.Root>
            <DialogTitle>{alt}</DialogTitle>
          </VisuallyHidden.Root>

          {/* Close */}
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="absolute top-3 right-3 z-10 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80 transition-colors"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Cerrar</span>
          </button>

          {/* Counter */}
          <span className="absolute top-3 left-3 z-10 text-xs font-medium text-white/80 bg-black/50 rounded-full px-2.5 py-1">
            {activeIndex + 1} / {images.length}
          </span>

          {/* Image */}
          <div className="relative w-full aspect-square">
            <GalleryImage
              src={images[activeIndex]}
              alt={`${alt} ${activeIndex + 1}`}
              className="object-contain"
            />
          </div>

          {/* Nav buttons */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={prev}
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white hover:bg-black/80 transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
                <span className="sr-only">Anterior</span>
              </button>
              <button
                type="button"
                onClick={next}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-2 text-white hover:bg-black/80 transition-colors"
              >
                <ChevronRight className="h-5 w-5" />
                <span className="sr-only">Siguiente</span>
              </button>
            </>
          )}

          {/* Dot indicators */}
          {images.length > 1 && (
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  className={cn(
                    "h-1.5 rounded-full transition-all",
                    i === activeIndex
                      ? "w-4 bg-white"
                      : "w-1.5 bg-white/50 hover:bg-white/70"
                  )}
                />
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
