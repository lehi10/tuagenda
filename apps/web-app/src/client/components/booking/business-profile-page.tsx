"use client";

import { useState, useMemo } from "react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/client/components/ui/avatar";
import { useTrpc } from "@/client/lib/trpc";
import { formatPrice } from "@/client/lib/booking-utils";
import { LoadingSpinner } from "@/client/components/booking/shared/loading-spinner";
import { cn } from "@/client/lib/utils";
import { Clock, Share2 } from "lucide-react";
import type { BookingService, ServiceCategory } from "@/client/types/booking";

interface BusinessData {
  name: string;
  description: string;
  avatar?: string | null;
  email: string;
  phone: string;
  location: string;
  website?: string;
}

interface BusinessProfilePageProps {
  businessId: string;
  business: BusinessData;
  onServiceSelect: (service: BookingService) => void;
}

// ── Share button handler ───────────────────────────────────────
function handleShare(name: string) {
  if (navigator.share) {
    navigator.share({ title: name, url: window.location.href }).catch(() => {});
  } else {
    navigator.clipboard.writeText(window.location.href).catch(() => {});
  }
}

// ── Service icon by name heuristic ────────────────────────────
function serviceEmoji(name: string): string {
  const l = name.toLowerCase();
  if (l.includes("corte") || l.includes("cabello") || l.includes("peinado")) return "✂️";
  if (l.includes("uña") || l.includes("manicure") || l.includes("pedicure")) return "💅";
  if (l.includes("facial") || l.includes("limpieza")) return "✨";
  if (l.includes("médic") || l.includes("medic") || l.includes("dental")) return "🩺";
  if (l.includes("mecánic") || l.includes("mecanic")) return "🔧";
  if (l.includes("gym") || l.includes("entrenador") || l.includes("fitness")) return "💪";
  if (l.includes("propiedad") || l.includes("inmobil") || l.includes("terreno")) return "🏠";
  return "📋";
}

// ── Schedule popup ─────────────────────────────────────────────
function SchedulePopup({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-sm rounded-2xl bg-card border shadow-xl p-5 sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-bold text-base mb-4">Horario de atención</h3>
        {/* ###TODO### – real schedule from business settings */}
        <div className="space-y-0 divide-y">
          {[
            ["Lunes – Viernes", "9:00 – 20:00"],
            ["Sábado", "10:00 – 17:00"],
            ["Domingo", "Cerrado"],
          ].map(([day, hours]) => (
            <div key={day} className="flex justify-between py-2.5 text-sm">
              <span className="text-muted-foreground">{day}</span>
              <span className={cn("font-semibold", hours === "Cerrado" && "text-muted-foreground")}>
                {hours}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-3 rounded-xl bg-amber-50 border border-amber-200 px-3 py-2.5 flex gap-2">
          <span>⚠️</span>
          <p className="text-xs text-amber-700 leading-relaxed">
            Horarios en feriados pueden variar. Consulta directamente con el negocio.
          </p>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">
          ###TODO### – horario configurable desde el panel del negocio
        </p>
        <button
          onClick={onClose}
          className="mt-4 w-full text-sm text-center text-muted-foreground hover:text-foreground transition-colors"
        >
          Cerrar
        </button>
      </div>
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────
export function BusinessProfilePage({
  businessId,
  business,
  onServiceSelect,
}: BusinessProfilePageProps) {
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showSchedule, setShowSchedule] = useState(false);

  // Fetch categories
  const { data: categoriesData } = useTrpc.serviceCategory.listPublic.useQuery(
    { businessId },
    { enabled: !!businessId }
  );
  // Fetch services
  const { data: servicesData, isLoading } = useTrpc.service.listPublic.useQuery(
    { businessId },
    { enabled: !!businessId }
  );

  const categories = useMemo(
    () => (categoriesData?.categories || []).filter((c) => c.id) as ServiceCategory[],
    [categoriesData]
  );
  const allServices = useMemo(
    () => (servicesData?.services || []).filter((s) => s.id) as BookingService[],
    [servicesData]
  );
  const filtered = useMemo(
    () => categoryFilter === "all" ? allServices : allServices.filter((s) => s.categoryId === categoryFilter),
    [allServices, categoryFilter]
  );

  const tabs = [
    { id: "all", label: "Todos", count: allServices.length },
    ...categories.map((c) => ({
      id: c.id,
      label: c.name,
      count: allServices.filter((s) => s.categoryId === c.id).length,
    })),
  ];

  return (
    <div className="w-full">
      {/* ── Hero banner ──────────────────────────────────────── */}
      <div className="relative h-52 sm:h-64 bg-gradient-to-br from-primary to-primary/60 overflow-hidden">
        {/* Subtle diagonal texture */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg,white 0,white 1px,transparent 1px,transparent 14px)",
          }}
        />
        {/* Bottom scrim for legibility */}
        <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Centered overlay container */}
        <div className="absolute inset-0 flex flex-col justify-between max-w-6xl mx-auto px-4 sm:px-6">
          {/* Top-right actions */}
          <div className="flex justify-end gap-2 pt-4 z-10">
            <button
              onClick={() => setShowSchedule(true)}
              className="flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 px-3 py-1.5 text-white text-xs font-semibold hover:bg-white/25 transition-colors"
            >
              <Clock className="h-3.5 w-3.5" />
              Horarios
            </button>
            <button
              onClick={() => handleShare(business.name)}
              className="flex items-center gap-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 px-3 py-1.5 text-white text-xs font-semibold hover:bg-white/25 transition-colors"
            >
              <Share2 className="h-3.5 w-3.5" />
              Compartir
            </button>
          </div>

          {/* Business info */}
          <div className="pb-5 flex items-end gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white shadow-lg flex items-center justify-center shrink-0 mb-[-8px] overflow-hidden">
              {business.avatar ? (
                <img src={business.avatar} alt={business.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl sm:text-3xl">🏪</span>
              )}
            </div>
            <div className="flex-1 min-w-0 pb-1">
              <h1 className="text-white font-bold text-lg sm:text-2xl leading-tight drop-shadow mb-1">
                {business.name}
              </h1>
              <div className="flex flex-wrap items-center gap-2">
                {business.location && (
                  <span className="text-white/80 text-xs">📍 {business.location}</span>
                )}
                {/* ###TODO### – rating from reviews system */}
                <span className="text-xs bg-white/15 text-white px-2 py-0.5 rounded-full font-semibold">
                  ⭐ ###TODO### rating
                </span>
                {/* ###TODO### – real open/closed status from business schedule */}
                <span className="text-xs bg-green-500/80 text-white px-2 py-0.5 rounded-full font-semibold">
                  ● Abierto
                </span>
              </div>
            </div>
          </div>
        </div>{/* end centered overlay */}
      </div>{/* end hero */}

      {/* ── Body ─────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row gap-0 lg:gap-6 px-4 sm:px-6 pt-6 pb-12 max-w-6xl mx-auto">

        {/* ── Services column ─────────────────────────────── */}
        <div className="flex-1 min-w-0">
          {/* Category tabs */}
          {tabs.length > 1 && (
            <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 mb-5">
              <div className="flex gap-0 border-b min-w-max sm:min-w-0">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setCategoryFilter(tab.id)}
                    className={cn(
                      "px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 -mb-px transition-all",
                      categoryFilter === tab.id
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {tab.label}
                    <span
                      className={cn(
                        "ml-1.5 text-xs px-1.5 py-0.5 rounded-full",
                        categoryFilter === tab.id
                          ? "bg-primary/10 text-primary"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Loading */}
          {isLoading && <LoadingSpinner fullScreen />}

          {/* Service grid */}
          {!isLoading && (
            <div className="grid gap-3 sm:grid-cols-2">
              {filtered.map((service) => {
                const isFree = service.price === 0;
                const hasPrice = service.price !== null && service.price !== undefined;
                return (
                  <button
                    key={service.id}
                    onClick={() => onServiceSelect(service)}
                    className={cn(
                      "w-full text-left p-4 rounded-2xl border bg-card transition-all",
                      "hover:border-primary/40 hover:shadow-md active:scale-[0.99]"
                    )}
                  >
                    <div className="flex gap-3 items-start">
                      {/* Icon */}
                      <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0 text-xl">
                        {serviceEmoji(service.name)}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm leading-snug mb-1 line-clamp-2">
                          {service.name}
                        </p>
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            {service.durationMinutes} min
                          </span>
                          {/* ###TODO### – modality (presencial/online/domicilio) from service data */}
                          <span className="text-xs bg-primary/10 text-primary rounded-lg px-2 py-0.5 font-semibold">
                            ###TODO### modalidad
                          </span>
                        </div>
                        {service.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                            {service.description}
                          </p>
                        )}
                      </div>

                      {/* Price + CTA */}
                      <div className="shrink-0 text-right ml-2">
                        {isFree ? (
                          <span className="text-xs font-bold text-green-600 bg-green-50 border border-green-200 rounded-lg px-2 py-1">
                            Gratis
                          </span>
                        ) : hasPrice ? (
                          <span className="text-sm font-bold text-primary">
                            {formatPrice(service.price)}
                          </span>
                        ) : null}
                        <p className="text-xs text-primary/70 font-semibold mt-1">
                          Reservar →
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Sidebar ──────────────────────────────────────── */}
        <div className="w-full lg:w-72 xl:w-80 shrink-0 flex flex-col gap-4 mt-6 lg:mt-0">
          {/* Contact card */}
          <div className="rounded-2xl border bg-card p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Contacto
            </p>

            {/* Social icons */}
            <div className="flex gap-2 mb-3">
              {/* ###TODO### – real social links from business settings */}
              {[
                {
                  label: "Instagram",
                  bg: "#fff0f5",
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <rect x="2" y="2" width="20" height="20" rx="5" stroke="#e1306c" strokeWidth="2"/>
                      <circle cx="12" cy="12" r="4" stroke="#e1306c" strokeWidth="2"/>
                      <circle cx="17.5" cy="6.5" r="1.5" fill="#e1306c"/>
                    </svg>
                  ),
                },
                {
                  label: "TikTok",
                  bg: "#f5f5f5",
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#010101">
                      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 106.33 6.33V8.69a8.18 8.18 0 004.79 1.54V6.79a4.85 4.85 0 01-1.02-.1z"/>
                    </svg>
                  ),
                },
                {
                  label: "LinkedIn",
                  bg: "#e7f3ff",
                  icon: (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#0077b5">
                      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/>
                      <circle cx="4" cy="4" r="2" fill="#0077b5"/>
                    </svg>
                  ),
                },
              ].map((social) => (
                <button
                  key={social.label}
                  title={`${social.label} – ###TODO### enlace`}
                  className="w-9 h-9 rounded-xl border flex items-center justify-center hover:scale-105 transition-transform"
                  style={{ background: social.bg }}
                  onClick={() => {
                    /* ###TODO### – open social link from business settings */
                  }}
                >
                  {social.icon}
                </button>
              ))}
            </div>

            {/* WhatsApp CTA */}
            {business.phone && (
              <a
                href={`https://wa.me/${business.phone.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-3 hover:bg-green-100 transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-[#25D366] flex items-center justify-center shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/>
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.136.564 4.14 1.544 5.872L.057 23.25a.75.75 0 00.916.916l5.377-1.487A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.7-.5-5.253-1.373l-.369-.214-3.843 1.063 1.063-3.843-.214-.369A9.956 9.956 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-bold text-green-700">WhatsApp</p>
                  <p className="text-xs text-green-600">Respuesta en minutos</p>
                </div>
              </a>
            )}
          </div>

          {/* Schedule card */}
          <div className="rounded-2xl border bg-card p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Horario
            </p>
            {/* ###TODO### – real schedule from business settings */}
            {[
              ["Lun – Vie", "9:00 – 20:00"],
              ["Sábado", "10:00 – 17:00"],
              ["Domingo", "Cerrado"],
            ].map(([day, hours]) => (
              <div
                key={day}
                className="flex justify-between py-2 border-b last:border-0 text-sm"
              >
                <span className="text-muted-foreground">{day}</span>
                <span
                  className={cn(
                    "font-semibold",
                    hours === "Cerrado" && "text-muted-foreground"
                  )}
                >
                  {hours}
                </span>
              </div>
            ))}
            <div className="mt-3 rounded-xl bg-amber-50 border border-amber-100 px-3 py-2 flex gap-2">
              <span className="text-sm">⚠️</span>
              <p className="text-xs text-amber-700 leading-relaxed">
                Horarios en feriados pueden variar.
              </p>
            </div>
            <p className="text-xs text-muted-foreground/60 mt-2 text-center">
              ###TODO### – configurable desde el panel
            </p>
          </div>
        </div>
      </div>

      {/* Schedule popup (mobile) */}
      {showSchedule && <SchedulePopup onClose={() => setShowSchedule(false)} />}
    </div>
  );
}
