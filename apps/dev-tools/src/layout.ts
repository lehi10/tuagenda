import dagre from "@dagrejs/dagre";
import { Position } from "@xyflow/react";
import type { Node, Edge } from "@xyflow/react";
import { MarkerType } from "@xyflow/react";
import type { GraphNode, GraphEdge } from "./server/analyzer";
import type { FlowNodeData } from "./nodes/FlowNode";

// ── Layout constants ──────────────────────────────────────────────────────────

export const NODE_W = 280;
export const NODE_H = 80;
export const PROC_GAP = 50;
export const ROW_GAP = 70;

// ── RouterGroup ───────────────────────────────────────────────────────────────

export interface RouterGroup {
  routerId: string;
  routerLabel: string;
  procedures: GraphNode[];
}

export function groupByRouter(
  nodes: GraphNode[],
  edges: GraphEdge[],
): RouterGroup[] {
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

// ── applyLayout ───────────────────────────────────────────────────────────────

/**
 * Two-phase stable layout:
 * 1. Procedure nodes get fixed positions by sort order (stable across selections).
 * 2. Flow nodes (UC, Port, Repo, DB) are laid out with Dagre and shifted to sit
 *    centered below the selected procedure.
 */
export function applyLayout(
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
    .filter((n) => (n.data as unknown as FlowNodeData).layer === "procedure")
    .sort((a, b) => a.id.localeCompare(b.id)); // stable sort
  const flowNodes = nodes.filter((n) => {
    const l = (n.data as unknown as FlowNodeData).layer;
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

// ── buildEdge ─────────────────────────────────────────────────────────────────

export function buildEdge(e: GraphEdge): Edge {
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

// ── reachableFrom ─────────────────────────────────────────────────────────────

// Given a selected procedure id, walk edges forward to collect all reachable node ids
// Also include the parent router node
export function reachableFrom(
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
