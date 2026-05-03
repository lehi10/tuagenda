import { useEffect } from "react";
import { Handle, Position, useReactFlow } from "@xyflow/react";
import type { GraphNode } from "../server/analyzer";
import { LAYER, PROC_BADGE } from "../config";
import { fs } from "../theme";
import { useTheme } from "../ThemeContext";

// ── Types ─────────────────────────────────────────────────────────────────────

export type FlowNodeData = GraphNode & {
  isSibling?: boolean;
  siblingCount?: number;
};

// ── FileIcon ──────────────────────────────────────────────────────────────────

function FileIcon({ color }: { color: string }) {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
    </svg>
  );
}

// ── FlowNode ──────────────────────────────────────────────────────────────────

export function FlowNode({
  data,
}: {
  data: FlowNodeData & Record<string, unknown>;
}) {
  const c = useTheme();
  const handleStyle = (color: string) => ({
    background: color,
    width: 7,
    height: 7,
    border: `2px solid ${c.bg.base}`,
  });

  const cfg = LAYER[data.layer];
  const procCfg = data.meta?.procType ? PROC_BADGE[data.meta.procType] : null;
  const isSibling = !!data.isSibling;

  // ── Router node ──
  if (data.layer === "router") {
    const fileName = data.file.split("/").pop() ?? data.file;
    return (
      <div
        style={{
          background: c.bg.surface,
          border: `1px solid ${c.border.default}`,
          borderTop: `3px solid ${c.brand.primary}`,
          borderRadius: 8,
          padding: "10px 14px",
          minWidth: 220,
          maxWidth: 280,
          boxShadow: "0 4px 24px rgba(0,0,0,0.4)",
          fontFamily: "monospace",
          cursor: "pointer",
        }}
      >
        <Handle
          type="target"
          position={Position.Top}
          style={handleStyle(c.brand.primary)}
        />

        <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
          <div style={{ color: c.brand.primary, marginTop: 2, flexShrink: 0 }}>
            <FileIcon color={c.brand.primary} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ marginBottom: 5 }}>
              <span
                style={{
                  background: c.border.subtle,
                  color: c.text.muted,
                  fontSize: fs.xxs,
                  fontWeight: 700,
                  padding: "2px 7px",
                  borderRadius: 3,
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                  fontFamily: "sans-serif",
                }}
              >
                tRPC Router
              </span>
            </div>
            <div
              style={{
                fontWeight: 700,
                fontSize: fs.lg,
                color: c.text.primary,
                letterSpacing: -0.2,
              }}
            >
              {data.label}
            </div>
            <div
              style={{
                fontSize: fs.xs,
                color: c.text.ghost,
                marginTop: 3,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {fileName}
              {data.siblingCount != null && (
                <span style={{ color: c.text.faint, marginLeft: 6 }}>
                  · {data.siblingCount} procedures
                </span>
              )}
            </div>
          </div>
        </div>

        <Handle
          type="source"
          position={Position.Bottom}
          style={handleStyle(c.brand.primary)}
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
          background: c.bg.base,
          border: `1px dashed ${c.border.subtle}`,
          borderRadius: 8,
          padding: "8px 12px",
          minWidth: 180,
          maxWidth: 240,
          opacity: 0.5,
          fontFamily: "monospace",
          cursor: "pointer",
        }}
      >
        <Handle
          type="target"
          position={Position.Top}
          style={handleStyle(c.border.default)}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            marginBottom: 4,
          }}
        >
          <span
            style={{
              background: c.bg.surface,
              color: c.text.ghost,
              fontSize: fs.xxs,
              fontWeight: 700,
              padding: "1px 5px",
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
                fontSize: fs.xxs,
                padding: "1px 5px",
                borderRadius: 3,
                fontFamily: "sans-serif",
              }}
            >
              {sibProcCfg.label} · {data.meta?.opType}
            </span>
          )}
        </div>

        <div
          style={{ fontWeight: 600, fontSize: fs.base, color: c.text.ghost }}
        >
          {data.label}
        </div>

        <Handle
          type="source"
          position={Position.Bottom}
          style={handleStyle(c.border.default)}
        />
      </div>
    );
  }

  // ── Regular node ──
  return (
    <div
      style={{
        background: cfg.bg,
        border: `1px solid ${c.border.subtle}`,
        borderLeft: `3px solid ${cfg.border}`,
        borderRadius: 8,
        padding: "10px 14px",
        minWidth: 220,
        maxWidth: 280,
        boxShadow: "0 2px 12px rgba(0,0,0,0.3)",
        fontFamily: "monospace",
        cursor: "pointer",
      }}
    >
      <Handle
        type="target"
        position={Position.Top}
        style={handleStyle(cfg.border)}
      />

      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 5,
          marginBottom: 6,
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            background: cfg.badge + "22",
            color: cfg.badge,
            border: `1px solid ${cfg.badge}44`,
            fontSize: fs.xxs,
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
              fontSize: fs.xxs,
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
          fontSize: fs.lg,
          color: c.text.primary,
          marginBottom: 4,
          letterSpacing: -0.2,
        }}
      >
        {data.label}
      </div>

      <div
        style={{
          fontSize: fs.xs,
          color: c.text.ghost,
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {data.file}
        {data.line > 0 && (
          <span style={{ color: c.text.faint }}>:{data.line}</span>
        )}
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        style={handleStyle(cfg.border)}
      />
    </div>
  );
}

export const nodeTypes = { flowNode: FlowNode };

// ── AutoFitView ───────────────────────────────────────────────────────────────

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
