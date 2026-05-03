import { useState } from "react";
import type { AppView } from "./Header";
import { fs } from "../theme";
import { useTheme, useThemeToggle } from "../ThemeContext";

interface NavItem {
  id: AppView;
  label: string;
  icon: React.ReactNode;
}

const NAV_ITEMS: NavItem[] = [
  {
    id: "flow",
    label: "Architecture Flow",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="6" height="4" rx="1" />
        <rect x="15" y="3" width="6" height="4" rx="1" />
        <rect x="9" y="17" width="6" height="4" rx="1" />
        <line x1="6" y1="7" x2="6" y2="14" />
        <line x1="18" y1="7" x2="18" y2="14" />
        <line x1="6" y1="14" x2="18" y2="14" />
        <line x1="12" y1="14" x2="12" y2="17" />
      </svg>
    ),
  },
  {
    id: "file-ranking",
    label: "File Size Ranking",
    icon: (
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
        <line x1="2" y1="20" x2="22" y2="20" />
      </svg>
    ),
  },
];

interface NavMenuProps {
  view: AppView;
  onViewChange: (v: AppView) => void;
}

function SunIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export function NavMenu({ view, onViewChange }: NavMenuProps) {
  const c = useTheme();
  const { isDark, toggle } = useThemeToggle();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      style={{
        width: collapsed ? 52 : 204,
        flexShrink: 0,
        background: c.bg.base,
        display: "flex",
        flexDirection: "column",
        borderRight: `1px solid ${c.border.subtle}`,
        transition: "width 0.2s ease",
        overflow: "hidden",
        fontFamily: "sans-serif",
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: collapsed ? "16px 0" : "16px 14px",
          borderBottom: `1px solid ${c.border.subtle}`,
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "flex-start",
          gap: 8,
          minHeight: 56,
        }}
      >
        <div
          style={{
            width: 26,
            height: 26,
            background: `linear-gradient(135deg, ${c.brand.primary} 0%, ${c.brand.secondary} 100%)`,
            borderRadius: 7,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: fs.base,
            fontWeight: 800,
            color: "white",
            letterSpacing: "-0.5px",
          }}
        >
          T
        </div>
        {!collapsed && (
          <div>
            <div
              style={{
                fontSize: fs.md,
                fontWeight: 700,
                color: c.text.primary,
                letterSpacing: "-0.2px",
                lineHeight: 1.2,
              }}
            >
              Dev Tools
            </div>
            <div style={{ fontSize: fs.xs, color: c.text.ghost, marginTop: 1 }}>
              TuAgenda
            </div>
          </div>
        )}
      </div>

      {/* Nav items */}
      <nav style={{ padding: "8px 6px", flex: 1 }}>
        {NAV_ITEMS.map((item) => {
          const active = view === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              title={collapsed ? item.label : undefined}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: collapsed ? "center" : "flex-start",
                gap: 9,
                padding: collapsed ? "9px 0" : "8px 10px",
                border: "none",
                borderRadius: 6,
                cursor: "pointer",
                background: active ? c.bg.raised : "transparent",
                color: active ? c.text.primary : c.text.dim,
                fontSize: fs.base,
                fontWeight: active ? 600 : 400,
                textAlign: "left",
                marginBottom: 1,
                position: "relative",
                whiteSpace: "nowrap",
                overflow: "hidden",
                transition: "background 0.1s, color 0.1s",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    c.bg.surface;
                  (e.currentTarget as HTMLButtonElement).style.color =
                    c.text.secondary;
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "transparent";
                  (e.currentTarget as HTMLButtonElement).style.color =
                    c.text.dim;
                }
              }}
            >
              {active && (
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    top: "50%",
                    transform: "translateY(-50%)",
                    width: 3,
                    height: 18,
                    background: `linear-gradient(180deg, ${c.brand.primary}, ${c.brand.secondary})`,
                    borderRadius: "0 2px 2px 0",
                  }}
                />
              )}
              <span
                style={{
                  color: active ? c.brand.light : "inherit",
                  flexShrink: 0,
                  display: "flex",
                }}
              >
                {item.icon}
              </span>
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Bottom: theme toggle + collapse */}
      <div
        style={{
          padding: collapsed ? "10px 6px" : "10px 10px",
          borderTop: `1px solid ${c.border.subtle}`,
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
          gap: 6,
        }}
      >
        {/* Theme toggle */}
        <button
          onClick={toggle}
          title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          style={{
            padding: "4px 7px",
            background: "transparent",
            border: `1px solid ${c.border.subtle}`,
            borderRadius: 5,
            color: c.text.ghost,
            cursor: "pointer",
            fontSize: fs.xs,
            lineHeight: 1,
            display: "flex",
            alignItems: "center",
            transition: "color 0.1s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = c.text.dim;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = c.text.ghost;
          }}
        >
          {isDark ? <SunIcon /> : <MoonIcon />}
        </button>

        {!collapsed && (
          <span
            style={{
              fontSize: fs.xs,
              color: c.text.faint,
              fontFamily: "monospace",
            }}
          >
            :3002
          </span>
        )}

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed((v) => !v)}
          title={collapsed ? "Expand" : "Collapse"}
          style={{
            padding: "4px 7px",
            background: "transparent",
            border: `1px solid ${c.border.subtle}`,
            borderRadius: 5,
            color: c.text.ghost,
            cursor: "pointer",
            fontSize: fs.xs,
            lineHeight: 1,
            display: "flex",
            alignItems: "center",
            transition: "color 0.1s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = c.text.dim;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = c.text.ghost;
          }}
        >
          {collapsed ? "▶" : "◀"}
        </button>
      </div>
    </div>
  );
}
