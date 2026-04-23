"use client";

import { cn } from "@/client/lib/utils";

const SCHEDULE = [
  ["Lun – Vie", "9:00 – 20:00"],
  ["Sábado", "10:00 – 17:00"],
  ["Domingo", "Cerrado"],
] as const;

const SOCIAL_LINKS = [
  {
    label: "Instagram",
    bg: "#fff0f5",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <rect
          x="2"
          y="2"
          width="20"
          height="20"
          rx="5"
          stroke="#e1306c"
          strokeWidth="2"
        />
        <circle cx="12" cy="12" r="4" stroke="#e1306c" strokeWidth="2" />
        <circle cx="17.5" cy="6.5" r="1.5" fill="#e1306c" />
      </svg>
    ),
  },
  {
    label: "TikTok",
    bg: "#f5f5f5",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="#010101">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 106.33 6.33V8.69a8.18 8.18 0 004.79 1.54V6.79a4.85 4.85 0 01-1.02-.1z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    bg: "#e7f3ff",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="#0077b5">
        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
        <circle cx="4" cy="4" r="2" fill="#0077b5" />
      </svg>
    ),
  },
];

interface BusinessSidebarProps {
  phone?: string;
}

export function BusinessSidebar({ phone }: BusinessSidebarProps) {
  return (
    <div className="w-full lg:w-72 xl:w-80 shrink-0 flex flex-col gap-4 mt-6 lg:mt-0">
      {/* Contact card */}
      <div className="rounded-2xl border bg-card p-5">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
          Contacto
        </p>

        {/* ###TODO### – real social links from business settings */}
        <div className="flex gap-2 mb-3">
          {SOCIAL_LINKS.map((social) => (
            <button
              key={social.label}
              title={social.label}
              className="w-9 h-9 rounded-xl border flex items-center justify-center hover:scale-105 transition-transform"
              style={{ background: social.bg }}
            >
              {social.icon}
            </button>
          ))}
        </div>

        {phone && (
          <a
            href={`https://wa.me/${phone.replace(/\D/g, "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-3 hover:bg-green-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-[#25D366] flex items-center justify-center shrink-0">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.136.564 4.14 1.544 5.872L.057 23.25a.75.75 0 00.916.916l5.377-1.487A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.907 0-3.7-.5-5.253-1.373l-.369-.214-3.843 1.063 1.063-3.843-.214-.369A9.956 9.956 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
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
        {SCHEDULE.map(([day, hours]) => (
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
      </div>
    </div>
  );
}
