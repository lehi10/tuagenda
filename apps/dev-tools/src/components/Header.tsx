import type { GraphData, GraphNode } from "../server/analyzer";
import { fs } from "../theme";
import { useTheme } from "../ThemeContext";

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
  const c = useTheme();

  return (
    <div
      style={{
        padding: "0 16px",
        height: 44,
        background: c.bg.base,
        borderBottom: `1px solid ${c.border.subtle}`,
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
            color: c.text.ghost,
            border: `1px solid ${c.border.subtle}`,
            borderRadius: 5,
            fontSize: fs.xs,
            cursor: "pointer",
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
              <span style={{ fontSize: fs.sm, color: c.text.ghost }}>
                {
                  graphData?.nodes.find((n) =>
                    graphData.edges.some(
                      (e) => e.source === n.id && e.target === selectedProc.id,
                    ),
                  )?.label
                }
              </span>
              <span style={{ color: c.text.faint, fontSize: fs.base }}>›</span>
              <span
                style={{
                  fontSize: fs.base,
                  fontWeight: 600,
                  color: c.text.secondary,
                  fontFamily: "monospace",
                }}
              >
                {selectedProc.label}
              </span>
            </>
          ) : (
            <span style={{ fontSize: fs.sm, color: c.text.ghost }}>
              Select a procedure from the sidebar
            </span>
          )
        ) : (
          <span style={{ fontSize: fs.sm, color: c.text.ghost }}>
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
            style={{
              fontSize: fs.xs,
              color: c.text.faint,
              fontFamily: "monospace",
            }}
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
              background: c.bg.raised,
              color: c.text.secondary,
              border: `1px solid ${c.border.default}`,
              borderRadius: 6,
              fontSize: fs.sm,
              cursor: "pointer",
              fontFamily: "sans-serif",
              fontWeight: 500,
              transition: "background 0.1s, border-color 0.1s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                c.bg.hover;
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                c.text.ghost;
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background =
                c.bg.raised;
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                c.border.default;
            }}
          >
            Re-analyze
          </button>
        )}
      </div>
    </div>
  );
}
