import { useEffect } from "react";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import type { GraphNode } from "../server/analyzer";
import { LAYER, PROC_BADGE } from "../config";

// ── Types ─────────────────────────────────────────────────────────────────────

export type FlowNodeData = GraphNode & {
  isSibling?: boolean;
  siblingCount?: number;
};

// ── FileIcon ──────────────────────────────────────────────────────────────────

function FileIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  );
}

// ── FlowNode ──────────────────────────────────────────────────────────────────

export function FlowNode({
  data,
}: {
  data: FlowNodeData & Record<string, unknown>;
}) {
  const cfg = LAYER[data.layer];
  const procCfg = data.meta?.procType ? PROC_BADGE[data.meta.procType] : null;
  const isSibling = !!data.isSibling;

  // ── Router node ──
  if (data.layer === "router") {
    const fileName = data.file.split("/").pop() ?? data.file;
    return (
      <div
        style={{
          background: "#1e1e2e",
          border: "1.5px solid #45475a",
          borderTop: "3px solid #cba6f7",
          borderRadius: 8,
          padding: "10px 14px",
          minWidth: 220,
          maxWidth: 280,
          boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
          fontFamily: "monospace",
          cursor: "pointer",
        }}
      >
        <Handle
          type="target"
          position={Position.Top}
          style={{
            background: "#45475a",
            width: 7,
            height: 7,
            border: "2px solid #1e1e2e",
          }}
        />

        <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
          {/* File icon */}
          <div
            style={{
              color: "#cba6f7",
              marginTop: 1,
              flexShrink: 0,
            }}
          >
            <FileIcon />
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Entry point badge */}
            <div style={{ marginBottom: 4 }}>
              <span
                style={{
                  background: "#45475a",
                  color: "#cdd6f4",
                  fontSize: 10,
                  fontWeight: 700,
                  padding: "1px 6px",
                  borderRadius: 3,
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                  fontFamily: "sans-serif",
                }}
              >
                tRPC Router
              </span>
            </div>
            {/* Router name */}
            <div
              style={{
                fontWeight: 700,
                fontSize: 15,
                color: "#cdd6f4",
                letterSpacing: -0.2,
              }}
            >
              {data.label}
            </div>
            {/* File path */}
            <div
              style={{
                fontSize: 11,
                color: "#6c7086",
                marginTop: 3,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {fileName}
              {data.siblingCount != null && (
                <span style={{ color: "#585b70", marginLeft: 6 }}>
                  · {data.siblingCount} procedures
                </span>
              )}
            </div>
          </div>
        </div>

        <Handle
          type="source"
          position={Position.Bottom}
          style={{
            background: "#45475a",
            width: 7,
            height: 7,
            border: "2px solid #1e1e2e",
          }}
        />
      </div>
    );
  }

  // ── Sibling procedure node (dimmed) ──
  if (isSibling) {
    const sibProcCfg = data.meta?.procType
      ? PROC_BADGE[data.meta.procType]
      : null;
    return (
      <div
        style={{
          background: "#f9fafb",
          border: "2px dashed #d1d5db",
          borderRadius: 10,
          padding: "8px 14px",
          minWidth: 180,
          maxWidth: 240,
          opacity: 0.65,
          fontFamily: "monospace",
          cursor: "pointer",
        }}
      >
        <Handle
          type="target"
          position={Position.Top}
          style={{
            background: "#d1d5db",
            width: 6,
            height: 6,
            border: "2px solid white",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            marginBottom: 3,
          }}
        >
          <span
            style={{
              background: "#e5e7eb",
              color: "#6b7280",
              fontSize: 10,
              fontWeight: 700,
              padding: "1px 6px",
              borderRadius: 3,
              textTransform: "uppercase",
              letterSpacing: 0.4,
              fontFamily: "sans-serif",
            }}
          >
            procedure
          </span>
          {sibProcCfg && (
            <span
              style={{
                background: sibProcCfg.bg,
                color: sibProcCfg.text,
                opacity: 0.7,
                fontSize: 10,
                padding: "1px 6px",
                borderRadius: 3,
                fontFamily: "sans-serif",
              }}
            >
              {sibProcCfg.label} · {data.meta?.opType}
            </span>
          )}
        </div>

        <div style={{ fontWeight: 600, fontSize: 13, color: "#6b7280" }}>
          {data.label}
        </div>

        <Handle
          type="source"
          position={Position.Bottom}
          style={{
            background: "#d1d5db",
            width: 6,
            height: 6,
            border: "2px solid white",
          }}
        />
      </div>
    );
  }

  // ── Regular node ──
  return (
    <div
      style={{
        background: cfg.bg,
        border: `2px solid ${cfg.border}`,
        borderRadius: 10,
        padding: "10px 14px",
        minWidth: 220,
        maxWidth: 280,
        boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
        fontFamily: "monospace",
        cursor: "pointer",
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={{
          background: cfg.border,
          width: 8,
          height: 8,
          border: "2px solid white",
        }}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 5,
          marginBottom: 5,
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            background: cfg.badge,
            color: "white",
            fontSize: 10,
            fontWeight: 700,
            padding: "2px 7px",
            borderRadius: 4,
            textTransform: "uppercase",
            letterSpacing: 0.5,
            fontFamily: "sans-serif",
          }}
        >
          {cfg.label}
        </span>
        {procCfg && (
          <span
            style={{
              background: procCfg.bg,
              color: procCfg.text,
              fontSize: 10,
              fontWeight: 600,
              padding: "2px 7px",
              borderRadius: 4,
              fontFamily: "sans-serif",
            }}
          >
            {procCfg.label} · {data.meta?.opType}
          </span>
        )}
      </div>

      <div
        style={{
          fontWeight: 700,
          fontSize: 15,
          color: "#111827",
          marginBottom: 3,
        }}
      >
        {data.label}
      </div>

      <div
        style={{
          fontSize: 11,
          color: "#6b7280",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {data.file}
        {data.line > 0 && (
          <span style={{ color: "#9ca3af" }}>:{data.line}</span>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          background: cfg.border,
          width: 8,
          height: 8,
          border: "2px solid white",
        }}
      />
    </div>
  );
}

export const nodeTypes = { flowNode: FlowNode };

// ── AutoFitView ───────────────────────────────────────────────────────────────

// Calls fitView only when shouldFit.current is true, then resets the flag
export function AutoFitView({
  shouldFit,
}: {
  shouldFit: React.MutableRefObject<boolean>;
}) {
  const { fitView } = useReactFlow();
  useEffect(() => {
    if (shouldFit.current) {
      shouldFit.current = false;
      fitView({ padding: 0.15, duration: 300 });
    }
  });
  return null;
}
