import { PROC_BADGE } from "../config";
import type { RouterGroup } from "../layout";

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
  return (
    <div
      style={{
        width: sidebarOpen ? 240 : 0,
        minWidth: sidebarOpen ? 240 : 0,
        background: "white",
        borderRight: "1px solid #e2e8f0",
        overflowY: sidebarOpen ? "auto" : "hidden",
        overflowX: "hidden",
        flexShrink: 0,
        transition: "width 0.2s ease, min-width 0.2s ease",
        position: "relative",
      }}
    >
      {status === "loading" && sidebarOpen && (
        <div
          style={{
            padding: 16,
            fontSize: 12,
            color: "#9ca3af",
            fontFamily: "sans-serif",
          }}
        >
          Analyzing...
        </div>
      )}

      {status === "ok" && sidebarOpen && (
        <>
          {/* Search box */}
          <div
            style={{
              padding: "8px 10px",
              borderBottom: "1px solid #e2e8f0",
              background: "white",
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
                padding: "5px 8px",
                fontSize: 11,
                fontFamily: "monospace",
                border: "1px solid #e2e8f0",
                borderRadius: 5,
                outline: "none",
                background: "#f9fafb",
                color: "#111827",
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
                {/* Router header — clickable to collapse */}
                <button
                  onClick={() => onToggleRouter(group.routerId)}
                  style={{
                    width: "100%",
                    textAlign: "left",
                    padding: "7px 14px",
                    border: "none",
                    borderBottom: "1px solid #f3f4f6",
                    borderTop: "1px solid #f3f4f6",
                    marginTop: 4,
                    background: "#f9fafb",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 6,
                  }}
                >
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#6b7280",
                      textTransform: "uppercase",
                      letterSpacing: 0.8,
                      fontFamily: "sans-serif",
                    }}
                  >
                    {group.routerLabel}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      color: "#9ca3af",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <span style={{ fontSize: 9, color: "#d1d5db" }}>
                      {filtered.length}
                    </span>
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
                    // Highlight matching part
                    const matchIdx = q2 ? label.toLowerCase().indexOf(q2) : -1;

                    return (
                      <button
                        key={proc.id}
                        onClick={() => onSelectProc(proc.id)}
                        style={{
                          width: "100%",
                          textAlign: "left",
                          padding: "8px 14px",
                          border: "none",
                          borderBottom: "1px solid #f3f4f6",
                          background: isSelected ? "#eff6ff" : "white",
                          borderLeft: isSelected
                            ? "3px solid #3b82f6"
                            : "3px solid transparent",
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "column",
                          gap: 3,
                        }}
                      >
                        <div
                          style={{
                            fontSize: 12,
                            fontWeight: 600,
                            color: isSelected ? "#1d4ed8" : "#111827",
                            fontFamily: "monospace",
                          }}
                        >
                          {matchIdx >= 0 ? (
                            <>
                              {label.slice(0, matchIdx)}
                              <mark
                                style={{
                                  background: "#fef08a",
                                  color: "#111827",
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
                                fontSize: 9,
                                padding: "1px 5px",
                                background: procBadge.bg,
                                color: procBadge.text,
                                borderRadius: 3,
                                fontFamily: "sans-serif",
                                fontWeight: 600,
                              }}
                            >
                              {procBadge.label}
                            </span>
                            <span
                              style={{
                                fontSize: 9,
                                padding: "1px 5px",
                                background: "#f3f4f6",
                                color: "#6b7280",
                                borderRadius: 3,
                                fontFamily: "sans-serif",
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
