import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Handle,
  Position,
  useNodesState,
  useEdgesState,
  useReactFlow,
  type Node,
  type Edge,
  type NodeMouseHandler,
  type EdgeMouseHandler,
  MarkerType,
} from "@xyflow/react";
import dagre from "@dagrejs/dagre";
import "@xyflow/react/dist/style.css";
import type { GraphData, GraphNode, GraphEdge } from "./server/analyzer";
import { CodePanel, type CodeTarget } from "./CodePanel";

// ── Layer config ──────────────────────────────────────────────────────────────

const LAYER = {
  router: {
    bg: "#f0fdf4",
    border: "#22c55e",
    badge: "#15803d",
    label: "Router",
  },
  procedure: {
    bg: "#dcfce7",
    border: "#4ade80",
    badge: "#166534",
    label: "Procedure",
  },
  usecase: {
    bg: "#dbeafe",
    border: "#3b82f6",
    badge: "#1d4ed8",
    label: "Use Case",
  },
  port: { bg: "#fefce8", border: "#eab308", badge: "#713f12", label: "Port" },
  repository: {
    bg: "#fdf2f8",
    border: "#ec4899",
    badge: "#9d174d",
    label: "Repository",
  },
  db: { bg: "#f8fafc", border: "#64748b", badge: "#1e293b", label: "DB" },
} as const;

const PROC_BADGE = {
  public: { bg: "#f0fdf4", text: "#166534", label: "public" },
  private: { bg: "#fef3c7", text: "#92400e", label: "private" },
  businessMember: { bg: "#ede9fe", text: "#5b21b6", label: "member" },
};

// ── Custom node ───────────────────────────────────────────────────────────────

type FlowNodeData = GraphNode & { isSibling?: boolean; siblingCount?: number };

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

function FlowNode({ data }: { data: FlowNodeData & Record<string, unknown> }) {
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

const nodeTypes = { flowNode: FlowNode };

// Calls fitView only when shouldFit.current is true, then resets the flag
function AutoFitView({
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

// ── Dagre layout ──────────────────────────────────────────────────────────────

const NODE_W = 280;
const NODE_H = 80;
const PROC_GAP = 50;
const ROW_GAP = 70;

/**
 * Two-phase stable layout:
 * 1. Procedure nodes get fixed positions by sort order (stable across selections).
 * 2. Flow nodes (UC, Port, Repo, DB) are laid out with Dagre and shifted to sit
 *    centered below the selected procedure.
 */
function applyLayout(
  nodes: Node[],
  edges: Edge[],
  selectedProcId: string,
  routerId: string,
): Node[] {
  const withPos = (n: Node, x: number, y: number): Node => ({
    ...n,
    position: { x, y },
    sourcePosition: Position.Bottom,
    targetPosition: Position.Top,
  });

  const routerNode = nodes.find((n) => n.id === routerId);
  const procNodes = nodes
    .filter((n) => (n.data as FlowNodeData).layer === "procedure")
    .sort((a, b) => a.id.localeCompare(b.id)); // stable sort
  const flowNodes = nodes.filter((n) => {
    const l = (n.data as FlowNodeData).layer;
    return l !== "router" && l !== "procedure";
  });

  if (!routerNode) return nodes;

  // ── 1. Procedure row ──────────────────────────────────────────────────────
  const totalProcW =
    procNodes.length * NODE_W + Math.max(0, procNodes.length - 1) * PROC_GAP;
  const procRowY = NODE_H + ROW_GAP;
  const procPos = new Map<string, { x: number; y: number }>();
  procNodes.forEach((n, i) => {
    procPos.set(n.id, { x: i * (NODE_W + PROC_GAP), y: procRowY });
  });

  // ── 2. Router centered over procedures ───────────────────────────────────
  const routerX = totalProcW / 2 - NODE_W / 2;

  // ── 3. Flow nodes via Dagre, shifted under selected procedure ─────────────
  const selPos = procPos.get(selectedProcId) ?? { x: routerX, y: procRowY };
  const selCenterX = selPos.x + NODE_W / 2;
  const flowStartY = procRowY + NODE_H + ROW_GAP;
  const flowEdges = edges.filter(
    (e) =>
      flowNodes.some((n) => n.id === e.source) &&
      flowNodes.some((n) => n.id === e.target),
  );

  let flowPositioned: Node[] = [];
  if (flowNodes.length > 0) {
    const g = new dagre.graphlib.Graph();
    g.setDefaultEdgeLabel(() => ({}));
    g.setGraph({ rankdir: "TB", ranksep: 60, nodesep: 40 });
    flowNodes.forEach((n) =>
      g.setNode(n.id, { width: NODE_W, height: NODE_H }),
    );
    flowEdges.forEach((e) => g.setEdge(e.source, e.target));
    dagre.layout(g);

    const xs = flowNodes.map((n) => g.node(n.id).x);
    const ys = flowNodes.map((n) => g.node(n.id).y);
    const dagreCenterX = (Math.min(...xs) + Math.max(...xs)) / 2;
    const dagreMinY = Math.min(...ys);
    const offsetX = selCenterX - dagreCenterX;
    const offsetY = flowStartY - (dagreMinY - NODE_H / 2);

    flowPositioned = flowNodes.map((n) => {
      const { x, y } = g.node(n.id);
      return withPos(n, x - NODE_W / 2 + offsetX, y - NODE_H / 2 + offsetY);
    });
  }

  return [
    withPos(routerNode, routerX, 0),
    ...procNodes.map((n) =>
      withPos(n, procPos.get(n.id)!.x, procPos.get(n.id)!.y),
    ),
    ...flowPositioned,
  ];
}

// ── Graph builder ─────────────────────────────────────────────────────────────

function buildEdge(e: GraphEdge): Edge {
  const isImpl = e.variant === "implements";
  const color = isImpl ? "#a78bfa" : "#94a3b8";
  return {
    id: e.id,
    source: e.source,
    target: e.target,
    label: e.label,
    type: "bezier",
    interactionWidth: 20,
    markerEnd: {
      type: MarkerType.ArrowClosed,
      width: 16,
      height: 16,
      color,
    },
    style: {
      stroke: color,
      strokeWidth: isImpl ? 1.5 : 2,
      strokeDasharray: isImpl ? "6 3" : undefined,
      cursor: "pointer",
    },
    labelStyle: { fontSize: 10, fill: "#6b7280", fontWeight: 600 },
    labelBgStyle: { fill: "white", fillOpacity: 0.9 },
    labelBgPadding: [4, 6] as [number, number],
    labelBgBorderRadius: 4,
  };
}

// Given a selected procedure id, walk edges forward to collect all reachable node ids
// Also include the parent router node
function reachableFrom(
  startId: string,
  routerId: string,
  allNodes: GraphNode[],
  allEdges: GraphEdge[],
): Set<string> {
  const visited = new Set<string>([startId, routerId]);
  const queue = [startId];
  while (queue.length > 0) {
    const current = queue.shift()!;
    for (const edge of allEdges) {
      if (edge.source === current && !visited.has(edge.target)) {
        visited.add(edge.target);
        queue.push(edge.target);
      }
    }
  }
  return visited;
}

// ── Sidebar types ─────────────────────────────────────────────────────────────

interface RouterGroup {
  routerId: string;
  routerLabel: string;
  procedures: GraphNode[];
}

function groupByRouter(nodes: GraphNode[], edges: GraphEdge[]): RouterGroup[] {
  const routers = nodes.filter((n) => n.layer === "router");
  return routers
    .map((router) => {
      const procIds = edges
        .filter((e) => e.source === router.id)
        .map((e) => e.target);
      const procedures = nodes.filter((n) => procIds.includes(n.id));
      return { routerId: router.id, routerLabel: router.label, procedures };
    })
    .sort((a, b) => a.routerLabel.localeCompare(b.routerLabel));
}

// ── Main component ────────────────────────────────────────────────────────────

export function FlowGraph() {
  const [status, setStatus] = useState<"loading" | "error" | "ok">("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [selectedProcId, setSelectedProcId] = useState<string | null>(null);
  const [activeTarget, setActiveTarget] = useState<CodeTarget | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const shouldFitView = useRef(false);
  const [search, setSearch] = useState("");

  // Auto-expand routers that have matching procedures when searching
  useEffect(() => {
    if (!graphData) return;
    const q = search.trim().toLowerCase();
    if (!q) {
      // Restore all routers to collapsed when search is cleared
      setCollapsedRouters(
        new Set(
          graphData.nodes.filter((n) => n.layer === "router").map((n) => n.id),
        ),
      );
      return;
    }
    setCollapsedRouters((prev) => {
      const next = new Set(prev);
      for (const group of groupByRouter(graphData.nodes, graphData.edges)) {
        const hasMatch = group.procedures.some((p) =>
          p.label.toLowerCase().includes(q),
        );
        if (hasMatch) next.delete(group.routerId);
      }
      return next;
    });
  }, [search, graphData]);
  const [collapsedRouters, setCollapsedRouters] = useState<Set<string>>(
    new Set(),
  );

  const toggleRouter = useCallback((routerId: string) => {
    setCollapsedRouters((prev) => {
      const next = new Set(prev);
      next.has(routerId) ? next.delete(routerId) : next.add(routerId);
      return next;
    });
  }, []);
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);

  const load = useCallback(async () => {
    setStatus("loading");
    setSelectedProcId(null);
    try {
      const res = await fetch("/api/graph");
      const data: GraphData & { error?: string } = await res.json();
      if (!res.ok || data.error) throw new Error(data.error ?? "Unknown error");
      setGraphData(data);
      setCollapsedRouters(
        new Set(
          data.nodes.filter((n) => n.layer === "router").map((n) => n.id),
        ),
      );
      setStatus("ok");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : String(err));
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Recompute flow whenever selection changes
  useEffect(() => {
    if (!graphData || !selectedProcId) {
      setNodes([]);
      setEdges([]);
      return;
    }

    // Find the router that owns this procedure
    const routerEdge = graphData.edges.find((e) => e.target === selectedProcId);
    const routerId = routerEdge?.source ?? "";

    const visibleIds = reachableFrom(
      selectedProcId,
      routerId,
      graphData.nodes,
      graphData.edges,
    );

    const visibleNodes = graphData.nodes.filter((n) => visibleIds.has(n.id));
    const visibleEdges = graphData.edges.filter(
      (e) => visibleIds.has(e.source) && visibleIds.has(e.target),
    );

    // Sibling procedures: same router, not selected
    const siblingProcs = graphData.nodes.filter(
      (n) =>
        n.layer === "procedure" &&
        n.id !== selectedProcId &&
        graphData.edges.some((e) => e.source === routerId && e.target === n.id),
    );

    // Router node gets siblingCount to show in its label
    const rawNodes: Node[] = visibleNodes.map((n) => ({
      id: n.id,
      type: "flowNode",
      position: { x: 0, y: 0 },
      data: (n.layer === "router"
        ? { ...n, siblingCount: siblingProcs.length + 1 }
        : n) as unknown as Record<string, unknown>,
    }));

    // Add dimmed sibling procedure nodes
    for (const sib of siblingProcs) {
      rawNodes.push({
        id: sib.id,
        type: "flowNode",
        position: { x: 0, y: 0 },
        data: { ...sib, isSibling: true } as unknown as Record<string, unknown>,
      });
    }

    const rawEdges = visibleEdges.map(buildEdge);

    // Add dimmed edges from router to sibling procedures
    for (const sib of siblingProcs) {
      rawEdges.push({
        id: `${routerId}→${sib.id}`,
        source: routerId,
        target: sib.id,
        type: "bezier",
        interactionWidth: 0,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: "#d1d5db",
          width: 12,
          height: 12,
        },
        style: {
          stroke: "#d1d5db",
          strokeWidth: 1.5,
          strokeDasharray: "4 3",
          opacity: 0.5,
        },
      });
    }

    setNodes(applyLayout(rawNodes, rawEdges, selectedProcId, routerId));
    setEdges(rawEdges);
  }, [graphData, selectedProcId, setNodes, setEdges]);

  const onNodeClick: NodeMouseHandler = useCallback((_evt, node) => {
    const gn = node.data as unknown as FlowNodeData;
    if (gn.isSibling) {
      // Switch procedure but keep current viewport position
      shouldFitView.current = false;
      setSelectedProcId(gn.id);
      setActiveTarget(null);
      return;
    }
    setActiveTarget({
      file: gn.file,
      line: gn.line,
      label: gn.label,
      layer: gn.layer,
    });
  }, []);

  const onEdgeClick: EdgeMouseHandler = useCallback(
    (_evt, edge) => {
      if (!graphData) return;
      const ge = graphData.edges.find((e) => e.id === edge.id);
      if (!ge?.callFile || !ge.callLine) return;
      const sourceNode = graphData.nodes.find((n) => n.id === ge.source);
      const targetNode = graphData.nodes.find((n) => n.id === ge.target);
      const description = targetNode
        ? `→ calls ${targetNode.label}`
        : undefined;
      setActiveTarget({
        file: ge.callFile,
        line: ge.callLine,
        label: sourceNode?.label ?? ge.source,
        layer: sourceNode?.layer ?? "procedure",
        description,
      });
    },
    [graphData],
  );

  const groups = useMemo(
    () => (graphData ? groupByRouter(graphData.nodes, graphData.edges) : []),
    [graphData],
  );

  // Flat ordered list of all procedures for ↑↓ navigation
  const allProcs = useMemo(() => groups.flatMap((g) => g.procedures), [groups]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Ignore when focus is inside an input
      if (document.activeElement?.tagName === "INPUT") return;

      if (e.key === "Escape") {
        setActiveTarget(null);
        return;
      }

      if (
        (e.key === "ArrowDown" || e.key === "ArrowUp") &&
        allProcs.length > 0
      ) {
        e.preventDefault();
        setSelectedProcId((prev) => {
          const idx = allProcs.findIndex((p) => p.id === prev);
          const next =
            e.key === "ArrowDown"
              ? (idx + 1) % allProcs.length
              : (idx - 1 + allProcs.length) % allProcs.length;
          shouldFitView.current = true;
          return allProcs[next].id;
        });
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [allProcs]);

  const selectedProc = useMemo(
    () => graphData?.nodes.find((n) => n.id === selectedProcId),
    [graphData, selectedProcId],
  );

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "#f8fafc",
      }}
    >
      {/* ── Header ── */}
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
          onClick={() => setSidebarOpen((v) => !v)}
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
            onClick={load}
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

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* ── Sidebar ── */}
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
                  onChange={(e) => setSearch(e.target.value)}
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
                      onClick={() => toggleRouter(group.routerId)}
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
                        const matchIdx = q2
                          ? label.toLowerCase().indexOf(q2)
                          : -1;

                        return (
                          <button
                            key={proc.id}
                            onClick={() => {
                              shouldFitView.current = true;
                              setSelectedProcId(proc.id);
                            }}
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
                                    {label.slice(
                                      matchIdx,
                                      matchIdx + q2.length,
                                    )}
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

        {/* ── Main area ── */}
        <div
          style={{
            flex: 1,
            display: "flex",
            overflow: "hidden",
            position: "relative",
          }}
        >
          <div style={{ flex: 1, position: "relative" }}>
            {status === "loading" && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  color: "#6b7280",
                  fontFamily: "sans-serif",
                }}
              >
                <div style={{ fontSize: 13 }}>
                  Analyzing codebase with ts-morph...
                </div>
                <div style={{ fontSize: 11, color: "#9ca3af" }}>
                  First load may take a few seconds
                </div>
              </div>
            )}

            {status === "error" && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 8,
                  color: "#dc2626",
                  fontFamily: "sans-serif",
                }}
              >
                <div style={{ fontWeight: 700 }}>Analysis failed</div>
                <div
                  style={{
                    fontSize: 12,
                    fontFamily: "monospace",
                    background: "#fef2f2",
                    padding: "8px 14px",
                    borderRadius: 6,
                  }}
                >
                  {errorMsg}
                </div>
                <button
                  onClick={load}
                  style={{
                    marginTop: 8,
                    padding: "6px 14px",
                    background: "#dc2626",
                    color: "white",
                    border: "none",
                    borderRadius: 6,
                    cursor: "pointer",
                  }}
                >
                  Retry
                </button>
              </div>
            )}

            {status === "ok" && !selectedProcId && (
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 6,
                  color: "#9ca3af",
                  fontFamily: "sans-serif",
                }}
              >
                <div style={{ fontSize: 28 }}>←</div>
                <div style={{ fontSize: 13 }}>
                  Select a procedure from the sidebar
                </div>
                <div style={{ fontSize: 11 }}>
                  {
                    graphData?.nodes.filter((n) => n.layer === "procedure")
                      .length
                  }{" "}
                  procedures across{" "}
                  {graphData?.nodes.filter((n) => n.layer === "router").length}{" "}
                  routers
                </div>
              </div>
            )}

            {status === "ok" && selectedProcId && (
              <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={onNodeClick}
                onEdgeClick={onEdgeClick}
                minZoom={0.2}
                maxZoom={2}
                proOptions={{ hideAttribution: true }}
              >
                <AutoFitView shouldFit={shouldFitView} />
                <Background color="#e2e8f0" gap={20} />
                <Controls />
                <MiniMap
                  nodeColor={(n) => {
                    const layer = (n.data as FlowNodeData).layer;
                    if (layer === "router") return "#cba6f7";
                    return LAYER[layer]?.border ?? "#94a3b8";
                  }}
                  maskColor="rgba(248,250,252,0.85)"
                  style={{ border: "1px solid #e2e8f0", borderRadius: 8 }}
                  zoomable
                  pannable
                />

                {/* Legend */}
                <div
                  style={{
                    position: "absolute",
                    bottom: 16,
                    left: 16,
                    background: "white",
                    border: "1px solid #e2e8f0",
                    borderRadius: 8,
                    padding: "8px 12px",
                    display: "flex",
                    gap: 10,
                    alignItems: "center",
                    flexWrap: "wrap",
                    zIndex: 10,
                  }}
                >
                  {(
                    Object.entries(LAYER) as [
                      keyof typeof LAYER,
                      (typeof LAYER)[keyof typeof LAYER],
                    ][]
                  ).map(([key, cfg]) => (
                    <span
                      key={key}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                        fontSize: 10,
                        fontFamily: "sans-serif",
                        color: "#374151",
                      }}
                    >
                      <span
                        style={{
                          width: 10,
                          height: 10,
                          background: cfg.bg,
                          border: `2px solid ${cfg.border}`,
                          borderRadius: 3,
                          display: "inline-block",
                        }}
                      />
                      {cfg.label}
                    </span>
                  ))}
                </div>
              </ReactFlow>
            )}
          </div>

          {/* ── Code panel ── */}
          {activeTarget && (
            <CodePanel
              target={activeTarget}
              onClose={() => setActiveTarget(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}
