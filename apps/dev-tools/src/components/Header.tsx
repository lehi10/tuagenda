import type { GraphData, GraphNode } from "../server/analyzer";

interface HeaderProps {
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
  selectedProc: GraphNode | undefined;
  graphData: GraphData | null;
  onReanalyze: () => void;
}

export function Header({
  sidebarOpen,
  onToggleSidebar,
  selectedProc,
  graphData,
  onReanalyze,
}: HeaderProps) {
  return (
    <div
      style={{
        padding: "10px 20px",
        background: "white",
        borderBottom: "1px solid #e2e8f0",
        display: "flex",
        alignItems: "center",
        gap: 12,
        flexShrink: 0,
      }}
    >
      <button
        onClick={onToggleSidebar}
        title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
        style={{
          padding: "5px 8px",
          background: "transparent",
          color: "#6b7280",
          border: "1px solid #e2e8f0",
          borderRadius: 6,
          fontSize: 14,
          cursor: "pointer",
          lineHeight: 1,
          display: "flex",
          alignItems: "center",
        }}
      >
        {sidebarOpen ? "◀" : "▶"}
      </button>
      <div
        style={{
          fontWeight: 700,
          fontSize: 14,
          color: "#111827",
          fontFamily: "sans-serif",
        }}
      >
        TuAgenda — Dev Tools
      </div>

      {/* Selected procedure indicator */}
      {selectedProc ? (
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ color: "#d1d5db", fontSize: 12 }}>›</span>
          <span
            style={{
              fontSize: 11,
              color: "#6b7280",
              fontFamily: "sans-serif",
            }}
          >
            {
              graphData?.nodes.find((n) =>
                graphData.edges.some(
                  (e) => e.source === n.id && e.target === selectedProc.id,
                ),
              )?.label
            }
          </span>
          <span style={{ color: "#d1d5db", fontSize: 12 }}>›</span>
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#111827",
              fontFamily: "monospace",
            }}
          >
            {selectedProc.label}
          </span>
        </div>
      ) : (
        <div
          style={{ fontSize: 11, color: "#9ca3af", fontFamily: "sans-serif" }}
        >
          Architecture Flow Explorer
        </div>
      )}

      <div
        style={{
          marginLeft: "auto",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        {/* Analyzed at */}
        {graphData?.analyzedAt && (
          <span
            style={{
              fontSize: 10,
              color: "#9ca3af",
              fontFamily: "sans-serif",
            }}
          >
            analyzed{" "}
            {new Date(graphData.analyzedAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })}
          </span>
        )}
        <button
          onClick={onReanalyze}
          style={{
            padding: "5px 12px",
            background: "#111827",
            color: "white",
            border: "none",
            borderRadius: 6,
            fontSize: 11,
            cursor: "pointer",
            fontFamily: "sans-serif",
          }}
        >
          Re-analyze
        </button>
      </div>
    </div>
  );
}
