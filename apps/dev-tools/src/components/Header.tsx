import type { GraphData, GraphNode } from "../server/analyzer";

export type AppView = "flow" | "file-ranking";

interface HeaderProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  selectedProc: GraphNode | undefined;
  graphData: GraphData | null;
  onReanalyze: () => void;
  view: AppView;
}

export function Header({
  sidebarOpen,
  onToggleSidebar,
  selectedProc,
  graphData,
  onReanalyze,
  view,
}: HeaderProps) {
  return (
    <div
      style={{
        padding: "0 16px",
        height: 44,
        background: "#0d1117",
        borderBottom: "1px solid #21262d",
        display: "flex",
        alignItems: "center",
        gap: 10,
        flexShrink: 0,
        fontFamily: "sans-serif",
      }}
    >
      {view === "flow" && (
        <button
          onClick={onToggleSidebar}
          title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          style={{
            padding: "4px 7px",
            background: "transparent",
            color: "#484f58",
            border: "1px solid #21262d",
            borderRadius: 5,
            fontSize: 10,
            cursor: "pointer",
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
          {sidebarOpen ? "◀" : "▶"}
        </button>
      )}

      {/* Breadcrumb */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          flex: 1,
          overflow: "hidden",
        }}
      >
        {view === "flow" ? (
          selectedProc ? (
            <>
              <span style={{ fontSize: 11, color: "#484f58" }}>
                {
                  graphData?.nodes.find((n) =>
                    graphData.edges.some(
                      (e) => e.source === n.id && e.target === selectedProc.id,
                    ),
                  )?.label
                }
              </span>
              <span style={{ color: "#30363d", fontSize: 12 }}>›</span>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: "#c9d1d9",
                  fontFamily: "monospace",
                }}
              >
                {selectedProc.label}
              </span>
            </>
          ) : (
            <span style={{ fontSize: 11, color: "#484f58" }}>
              Select a procedure from the sidebar
            </span>
          )
        ) : (
          <span style={{ fontSize: 11, color: "#484f58" }}>
            .ts / .tsx · sorted by line count · respects .gitignore
          </span>
        )}
      </div>

      {/* Right actions */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginLeft: "auto",
          flexShrink: 0,
        }}
      >
        {view === "flow" && graphData?.analyzedAt && (
          <span
            style={{ fontSize: 10, color: "#30363d", fontFamily: "monospace" }}
          >
            {new Date(graphData.analyzedAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </span>
        )}
        {view === "flow" && (
          <button
            onClick={onReanalyze}
            style={{
              padding: "4px 12px",
              background: "#1c2128",
              color: "#c9d1d9",
              border: "1px solid #30363d",
              borderRadius: 6,
              fontSize: 11,
              cursor: "pointer",
              fontFamily: "sans-serif",
              fontWeight: 500,
              transition: "background 0.1s, border-color 0.1s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "#282e36";
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "#484f58";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                "#1c2128";
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "#30363d";
            }}
          >
            Re-analyze
          </button>
        )}
      </div>
    </div>
  );
}
