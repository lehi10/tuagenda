import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import {
  ReactFlow,
  Background,
  BackgroundVariant,
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
import { Header, type AppView } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { FileRanking } from "./components/FileRanking";
import { fs } from "./theme";
import { useTheme } from "./ThemeContext";
import { NavMenu } from "./components/NavMenu";

// ── Main component ────────────────────────────────────────────────────────────

export function FlowGraph() {
  const c = useTheme();

  const [view, setView] = useState<AppView>("flow");
  const [status, setStatus] = useState<"loading" | "error" | "ok">("loading");
  const [errorMsg, setErrorMsg] = useState("");
  const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [selectedProcId, setSelectedProcId] = useState<string | null>(null);
  const [activeTarget, setActiveTarget] = useState<CodeTarget | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const shouldFitView = useRef(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (!graphData) return;
    const q = search.trim().toLowerCase();
    if (!q) {
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

  useEffect(() => {
    if (!graphData || !selectedProcId) {
      setNodes([]);
      setEdges([]);
      return;
    }

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

    const siblingProcs = graphData.nodes.filter(
      (n) =>
        n.layer === "procedure" &&
        n.id !== selectedProcId &&
        graphData.edges.some((e) => e.source === routerId && e.target === n.id),
    );

    const rawNodes: Node[] = visibleNodes.map((n) => ({
      id: n.id,
      type: "flowNode",
      position: { x: 0, y: 0 },
      data: (n.layer === "router"
        ? { ...n, siblingCount: siblingProcs.length + 1 }
        : n) as unknown as Record<string, unknown>,
    }));

    for (const sib of siblingProcs) {
      rawNodes.push({
        id: sib.id,
        type: "flowNode",
        position: { x: 0, y: 0 },
        data: { ...sib, isSibling: true } as unknown as Record<string, unknown>,
      });
    }

    const rawEdges = visibleEdges.map((e) => buildEdge(e, c));

    for (const sib of siblingProcs) {
      rawEdges.push({
        id: `${routerId}→${sib.id}`,
        source: routerId,
        target: sib.id,
        type: "bezier",
        interactionWidth: 0,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: c.edge.sibling,
          width: 12,
          height: 12,
        },
        style: {
          stroke: c.edge.sibling,
          strokeWidth: 1.5,
          strokeDasharray: "4 3",
          opacity: 0.5,
        },
      });
    }

    setNodes(applyLayout(rawNodes, rawEdges, selectedProcId, routerId));
    setEdges(rawEdges);
  }, [graphData, selectedProcId, setNodes, setEdges, c]);

  const onNodeClick: NodeMouseHandler = useCallback((_evt, node) => {
    const gn = node.data as unknown as FlowNodeData;
    if (gn.isSibling) {
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

  const allProcs = useMemo(() => groups.flatMap((g) => g.procedures), [groups]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
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
        background: c.bg.base,
      }}
    >
      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        <NavMenu view={view} onViewChange={setView} />

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <Header
            sidebarOpen={sidebarOpen}
            onToggleSidebar={() => setSidebarOpen((v) => !v)}
            selectedProc={selectedProc}
            graphData={graphData}
            onReanalyze={load}
            view={view}
          />

          <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
            {view === "file-ranking" && <FileRanking />}

            {view === "flow" && (
              <>
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
                          fontFamily: "sans-serif",
                        }}
                      >
                        <div
                          style={{ fontSize: fs.base, color: c.text.secondary }}
                        >
                          Analyzing codebase with ts-morph...
                        </div>
                        <div style={{ fontSize: fs.sm, color: c.text.muted }}>
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
                          fontFamily: "sans-serif",
                        }}
                      >
                        <div style={{ fontWeight: 700, color: c.danger.text }}>
                          Analysis failed
                        </div>
                        <div
                          style={{
                            fontSize: fs.base,
                            fontFamily: "monospace",
                            background: c.danger.altBg,
                            padding: "8px 14px",
                            borderRadius: 6,
                            color: c.danger.text,
                            border: `1px solid ${c.danger.border}`,
                          }}
                        >
                          {errorMsg}
                        </div>
                        <button
                          onClick={load}
                          style={{
                            marginTop: 4,
                            padding: "6px 14px",
                            background: c.danger.border,
                            color: c.danger.text,
                            border: `1px solid ${c.danger.altBorder}`,
                            borderRadius: 6,
                            cursor: "pointer",
                            fontSize: fs.base,
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
                          fontFamily: "sans-serif",
                        }}
                      >
                        <div style={{ fontSize: 26, color: c.text.muted }}>
                          ←
                        </div>
                        <div
                          style={{ fontSize: fs.base, color: c.text.secondary }}
                        >
                          Select a procedure from the sidebar
                        </div>
                        <div style={{ fontSize: fs.sm, color: c.text.muted }}>
                          {
                            graphData?.nodes.filter(
                              (n) => n.layer === "procedure",
                            ).length
                          }{" "}
                          procedures across{" "}
                          {
                            graphData?.nodes.filter((n) => n.layer === "router")
                              .length
                          }{" "}
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
                        <Background
                          variant={BackgroundVariant.Dots}
                          color={c.border.default}
                          gap={20}
                          size={1.5}
                        />
                        <Controls />
                        <MiniMap
                          nodeColor={(n) => {
                            const layer = (n.data as unknown as FlowNodeData)
                              .layer;
                            return LAYER[layer]?.border ?? c.text.ghost;
                          }}
                          maskColor={`${c.bg.base}d9`}
                          style={{
                            border: `1px solid ${c.border.subtle}`,
                            borderRadius: 8,
                            background: c.bg.surface,
                          }}
                          zoomable
                          pannable
                        />

                        {/* Legend */}
                        <div
                          style={{
                            position: "absolute",
                            bottom: 16,
                            left: 16,
                            background: c.bg.surface,
                            border: `1px solid ${c.border.subtle}`,
                            borderRadius: 8,
                            padding: "7px 12px",
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
                                gap: 5,
                                fontSize: fs.xs,
                                fontFamily: "sans-serif",
                                color: c.text.tertiary,
                              }}
                            >
                              <span
                                style={{
                                  width: 8,
                                  height: 8,
                                  background: cfg.border,
                                  borderRadius: "50%",
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

                  {activeTarget && (
                    <CodePanel
                      target={activeTarget}
                      onClose={() => setActiveTarget(null)}
                    />
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
