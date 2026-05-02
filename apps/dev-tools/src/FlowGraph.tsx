import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
  type Node,
  type Edge,
  type NodeMouseHandler,
  type EdgeMouseHandler,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import type { GraphData } from "./server/analyzer";
import { CodePanel, type CodeTarget } from "./CodePanel";
import { LAYER } from "./config";
import { nodeTypes, AutoFitView, type FlowNodeData } from "./nodes/FlowNode";
import { applyLayout, buildEdge, reachableFrom, groupByRouter } from "./layout";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";

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
    const gn = node.data as unknown as FlowNodeData; // double cast needed: Record<string,unknown> → unknown → FlowNodeData
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
      <Header
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
        selectedProc={selectedProc}
        graphData={graphData}
        onReanalyze={load}
      />

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        {/* ── Sidebar ── */}
        <Sidebar
          status={status}
          sidebarOpen={sidebarOpen}
          groups={groups}
          collapsedRouters={collapsedRouters}
          selectedProcId={selectedProcId}
          search={search}
          onSearch={setSearch}
          onToggleRouter={toggleRouter}
          onSelectProc={(id) => {
            shouldFitView.current = true;
            setSelectedProcId(id);
          }}
        />

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
                    const layer = (n.data as unknown as FlowNodeData).layer;
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
