"use client";

import { Clock, Share2 } from "lucide-react";

interface BusinessHeroProps {
  name: string;
  avatar?: string | null;
  location?: string;
  onShowSchedule: () => void;
}

function handleShare(name: string) {
  if (navigator.share) {
    navigator.share({ title: name, url: window.location.href }).catch(() => {});
  } else {
    navigator.clipboard.writeText(window.location.href).catch(() => {});
  }
}

export function BusinessHero({
  name,
  avatar,
  location,
  onShowSchedule,
}: BusinessHeroProps) {
  return (
    <div className="relative h-52 sm:h-64 bg-gradient-to-br from-primary to-primary/60 overflow-hidden">
      {/* Diagonal texture */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg,white 0,white 1px,transparent 1px,transparent 14px)",
        }}
      />
      {/* Bottom scrim */}
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-black/50 to-transparent" />

      <div className="absolute inset-0 flex flex-col justify-between max-w-6xl mx-auto px-4 sm:px-6">
        {/* Top actions */}
        <div className="flex justify-end gap-2 pt-4 z-10">
          <button
            onClick={onShowSchedule}
            className="flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 px-3 py-1.5 text-white text-xs font-semibold hover:bg-white/25 transition-colors"
          >
            <Clock className="h-3.5 w-3.5" />
            Horarios
          </button>
          <button
            onClick={() => handleShare(name)}
            className="flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 px-3 py-1.5 text-white text-xs font-semibold hover:bg-white/25 transition-colors"
          >
            <Share2 className="h-3.5 w-3.5" />
            Compartir
          </button>
        </div>

        {/* Business info */}
        <div className="pb-5 flex items-end gap-4">
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white shadow-lg flex items-center justify-center shrink-0 mb-[-8px] overflow-hidden">
            {avatar ? (
              <img
                src={avatar}
                alt={name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl sm:text-3xl">🏪</span>
            )}
          </div>
          <div className="flex-1 min-w-0 pb-1">
            <h1 className="text-white font-bold text-lg sm:text-2xl leading-tight drop-shadow mb-1">
              {name}
            </h1>
            <div className="flex flex-wrap items-center gap-2">
              {location && (
                <span className="text-white/80 text-xs">📍 {location}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
