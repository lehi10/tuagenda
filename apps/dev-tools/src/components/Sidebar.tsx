import { PROC_BADGE } from "../config";
import type { RouterGroup } from "../layout";
import { fs } from "../theme";
import { useTheme } from "../ThemeContext";

interface SidebarProps {
  status: "loading" | "error" | "ok";
  sidebarOpen: boolean;
  groups: RouterGroup[];
  collapsedRouters: Set<string>;
  selectedProcId: string | null;
  search: string;
  onSearch: (value: string) => void;
  onToggleRouter: (routerId: string) => void;
  onSelectProc: (id: string) => void;
}

export function Sidebar({
  status,
  sidebarOpen,
  groups,
  collapsedRouters,
  selectedProcId,
  search,
  onSearch,
  onToggleRouter,
  onSelectProc,
}: SidebarProps) {
  const c = useTheme();

  return (
    <div
      style={{
        width: sidebarOpen ? 240 : 0,
        minWidth: sidebarOpen ? 240 : 0,
        background: c.bg.base,
        borderRight: `1px solid ${c.border.subtle}`,
        overflowY: sidebarOpen ? "auto" : "hidden",
        overflowX: "hidden",
        flexShrink: 0,
        transition: "width 0.2s ease, min-width 0.2s ease",
        fontFamily: "sans-serif",
      }}
    >
      {status === "loading" && sidebarOpen && (
        <div style={{ padding: 16, fontSize: fs.base, color: c.text.muted }}>
          Analyzing...
        </div>
      )}

      {status === "ok" && sidebarOpen && (
        <>
          {/* Search */}
          <div
            style={{
              padding: "8px 8px",
              borderBottom: `1px solid ${c.border.subtle}`,
              background: c.bg.base,
              position: "sticky",
              top: 0,
              zIndex: 1,
            }}
          >
            <input
              type="text"
              placeholder="Search procedures..."
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              style={{
                width: "100%",
                padding: "6px 10px",
                fontSize: fs.sm,
                fontFamily: "monospace",
                border: `1px solid ${c.border.subtle}`,
                borderRadius: 6,
                outline: "none",
                background: c.bg.surface,
                color: c.text.secondary,
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Router groups */}
          {groups.map((group) => {
            const isCollapsed = collapsedRouters.has(group.routerId);
            const q = search.trim().toLowerCase();
            const filtered = q
              ? group.procedures.filter((p) =>
                  p.label.toLowerCase().includes(q),
                )
              : group.procedures;
            if (q && filtered.length === 0) return null;

            return (
              <div key={group.routerId}>
                {/* Router header */}
                <button
                  onClick={() => onToggleRouter(group.routerId)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "6px 12px",
                    border: "none",
                    borderBottom: `1px solid ${c.bg.surface}`,
                    marginTop: 4,
                    background: c.bg.base,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 6,
                  }}
                >
                  <span
                    style={{
                      fontSize: fs.xs,
                      fontWeight: 700,
                      color: c.text.tertiary,
                      textTransform: "uppercase",
                      letterSpacing: 1,
                    }}
                  >
                    {group.routerLabel}
                  </span>
                  <span
                    style={{
                      fontSize: fs.xs,
                      color: c.text.muted,
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <span style={{ fontSize: fs.xxs }}>{filtered.length}</span>
                    {isCollapsed ? "▶" : "▼"}
                  </span>
                </button>

                {/* Procedures */}
                {!isCollapsed &&
                  filtered.map((proc) => {
                    const isSelected = proc.id === selectedProcId;
                    const procBadge = proc.meta?.procType
                      ? PROC_BADGE[proc.meta.procType]
                      : null;
                    const q2 = search.trim().toLowerCase();
                    const label = proc.label;
                    const matchIdx = q2 ? label.toLowerCase().indexOf(q2) : -1;

                    return (
                      <button
                        key={proc.id}
                        onClick={() => onSelectProc(proc.id)}
                        style={{
                          width: "100%",
                          textAlign: "left",
                          padding: "8px 12px",
                          border: "none",
                          borderBottom: `1px solid ${c.bg.surface}`,
                          background: isSelected ? c.bg.raised : "transparent",
                          borderLeft: isSelected
                            ? `2px solid ${c.brand.primary}`
                            : "2px solid transparent",
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "column",
                          gap: 3,
                          transition: "background 0.1s",
                        }}
                        onMouseEnter={(e) => {
                          if (!isSelected)
                            (
                              e.currentTarget as HTMLButtonElement
                            ).style.background = c.bg.surface;
                        }}
                        onMouseLeave={(e) => {
                          if (!isSelected)
                            (
                              e.currentTarget as HTMLButtonElement
                            ).style.background = "transparent";
                        }}
                      >
                        <div
                          style={{
                            fontSize: fs.base,
                            fontWeight: 600,
                            color: isSelected
                              ? c.text.primary
                              : c.text.tertiary,
                            fontFamily: "monospace",
                          }}
                        >
                          {matchIdx >= 0 ? (
                            <>
                              {label.slice(0, matchIdx)}
                              <mark
                                style={{
                                  background: c.warning.highlight,
                                  color: c.warning.highlightText,
                                  borderRadius: 2,
                                  padding: "0 1px",
                                }}
                              >
                                {label.slice(matchIdx, matchIdx + q2.length)}
                              </mark>
                              {label.slice(matchIdx + q2.length)}
                            </>
                          ) : (
                            label
                          )}
                        </div>
                        {procBadge && (
                          <div style={{ display: "flex", gap: 4 }}>
                            <span
                              style={{
                                fontSize: fs.xxs,
                                padding: "1px 5px",
                                background: procBadge.bg,
                                color: procBadge.text,
                                borderRadius: 3,
                                fontWeight: 600,
                              }}
                            >
                              {procBadge.label}
                            </span>
                            <span
                              style={{
                                fontSize: fs.xxs,
                                padding: "1px 5px",
                                background: c.bg.surface,
                                color: c.text.muted,
                                borderRadius: 3,
                              }}
                            >
                              {proc.meta?.opType}
                            </span>
                          </div>
                        )}
                      </button>
                    );
                  })}
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
