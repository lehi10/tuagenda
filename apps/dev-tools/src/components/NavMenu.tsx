import { useState } from "react";
import type { AppView } from "./Header";

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

export function NavMenu({ view, onViewChange }: NavMenuProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      style={{
        width: collapsed ? 52 : 204,
        flexShrink: 0,
        background: "#0d1117",
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid #21262d",
        transition: "width 0.2s ease",
        overflow: "hidden",
        fontFamily: "sans-serif",
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: collapsed ? "16px 0" : "16px 14px",
          borderBottom: "1px solid #21262d",
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "flex-start",
          gap: 8,
          minHeight: 56,
        }}
      >
        {/* Logo mark */}
        <div
          style={{
            width: 26,
            height: 26,
            background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)",
            borderRadius: 7,
            flexShrink: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 12,
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
                fontSize: 13,
                fontWeight: 700,
                color: "#e6edf3",
                letterSpacing: "-0.2px",
                lineHeight: 1.2,
              }}
            >
              Dev Tools
            </div>
            <div style={{ fontSize: 10, color: "#484f58", marginTop: 1 }}>
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
                background: active ? "#1c2128" : "transparent",
                color: active ? "#e6edf3" : "#7d8590",
                fontSize: 12,
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
                    "#161b22";
                  (e.currentTarget as HTMLButtonElement).style.color =
                    "#c9d1d9";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  (e.currentTarget as HTMLButtonElement).style.background =
                    "transparent";
                  (e.currentTarget as HTMLButtonElement).style.color =
                    "#7d8590";
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
                    background: "linear-gradient(180deg, #7c3aed, #4f46e5)",
                    borderRadius: "0 2px 2px 0",
                  }}
                />
              )}
              <span
                style={{
                  color: active ? "#a78bfa" : "inherit",
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

      {/* Collapse toggle */}
      <div
        style={{
          padding: collapsed ? "10px 6px" : "10px 10px",
          borderTop: "1px solid #21262d",
          display: "flex",
          alignItems: "center",
          justifyContent: collapsed ? "center" : "space-between",
        }}
      >
        {!collapsed && (
          <span
            style={{ fontSize: 10, color: "#30363d", fontFamily: "monospace" }}
          >
            :3002
          </span>
        )}
        <button
          onClick={() => setCollapsed((v) => !v)}
          title={collapsed ? "Expand" : "Collapse"}
          style={{
            padding: "4px 7px",
            background: "transparent",
            border: "1px solid #21262d",
            borderRadius: 5,
            color: "#484f58",
            cursor: "pointer",
            fontSize: 10,
            lineHeight: 1,
            display: "flex",
            alignItems: "center",
            transition: "color 0.1s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "#7d8590";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "#484f58";
          }}
        >
          {collapsed ? "▶" : "◀"}
        </button>
      </div>
    </div>
  );
}
