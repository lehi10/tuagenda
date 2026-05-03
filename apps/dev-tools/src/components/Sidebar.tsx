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
        background: "#0d1117",
        borderRight: "1px solid #21262d",
        overflowY: sidebarOpen ? "auto" : "hidden",
        overflowX: "hidden",
        flexShrink: 0,
        transition: "width 0.2s ease, min-width 0.2s ease",
        fontFamily: "sans-serif",
      }}
    >
      {status === "loading" && sidebarOpen && (
        <div style={{ padding: 16, fontSize: 12, color: "#8b949e" }}>
          Analyzing...
        </div>
      )}

      {status === "ok" && sidebarOpen && (
        <>
          {/* Search */}
          <div
            style={{
              padding: "8px 8px",
              borderBottom: "1px solid #21262d",
              background: "#0d1117",
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
                fontSize: 11,
                fontFamily: "monospace",
                border: "1px solid #21262d",
                borderRadius: 6,
                outline: "none",
                background: "#161b22",
                color: "#c9d1d9",
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
                    borderBottom: "1px solid #161b22",
                    marginTop: 4,
                    background: "#0d1117",
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
                      color: "#adbac7",
                      textTransform: "uppercase",
                      letterSpacing: 1,
                    }}
                  >
                    {group.routerLabel}
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      color: "#8b949e",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                    }}
                  >
                    <span style={{ fontSize: 9 }}>{filtered.length}</span>
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
                          borderBottom: "1px solid #161b22",
                          background: isSelected ? "#1c2128" : "transparent",
                          borderLeft: isSelected
                            ? "2px solid #7c3aed"
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
                            ).style.background = "#161b22";
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
                            fontSize: 12,
                            fontWeight: 600,
                            color: isSelected ? "#e6edf3" : "#adbac7",
                            fontFamily: "monospace",
                          }}
                        >
                          {matchIdx >= 0 ? (
                            <>
                              {label.slice(0, matchIdx)}
                              <mark
                                style={{
                                  background: "#3d2e00",
                                  color: "#f0b429",
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
                                fontWeight: 600,
                              }}
                            >
                              {procBadge.label}
                            </span>
                            <span
                              style={{
                                fontSize: 9,
                                padding: "1px 5px",
                                background: "#161b22",
                                color: "#8b949e",
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
