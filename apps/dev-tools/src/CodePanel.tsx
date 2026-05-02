import { useEffect, useRef, useState, useCallback } from "react";
import hljs from "highlight.js/lib/core";
import typescript from "highlight.js/lib/languages/typescript";
import plaintext from "highlight.js/lib/languages/plaintext";
import "highlight.js/styles/atom-one-dark.css";
import type { GraphNode } from "./server/analyzer";
import type { ExtractedBlock } from "./server/extractor";
import { CodeBlock } from "./components/CodeBlock";

hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("plaintext", plaintext);

export interface CodeTarget {
  file: string;
  line: number;
  label: string;
  layer: GraphNode["layer"];
  description?: string; // shown in header, e.g. "calls new CreateAppointmentUseCase()"
}

interface Props {
  target: CodeTarget;
  onClose: () => void;
}

type FetchState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "ok"; block: ExtractedBlock; absolutePath: string };

const LAYER_COLOR: Record<string, string> = {
  router: "#3fb950", // green — visible on dark
  procedure: "#56d364", // brighter green
  usecase: "#58a6ff", // blue
  port: "#e3b341", // amber — better than yellow on dark
  repository: "#f778ba", // pink
  db: "#8b949e", // gray
};

// ─────────────────────────────────────────────────────────────────────────────

export function CodePanel({ target, onClose }: Props) {
  const [state, setState] = useState<FetchState>({ status: "loading" });
  const [width, setWidth] = useState(520);
  const targetRowRef = useRef<HTMLTableRowElement | null>(null);
  const dragging = useRef(false);
  const startX = useRef(0);
  const startW = useRef(0);

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      dragging.current = true;
      startX.current = e.clientX;
      startW.current = width;
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    },
    [width],
  );

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      const delta = startX.current - e.clientX;
      setWidth(Math.min(900, Math.max(300, startW.current + delta)));
    };
    const onUp = () => {
      dragging.current = false;
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, []);

  useEffect(() => {
    // DB node with no resolved schema file
    if (target.layer === "db" && !target.file) {
      setState({
        status: "ok",
        block: { functionName: "", code: "", startLine: 0, targetLine: 0 },
        absolutePath: "",
      });
      return;
    }

    setState({ status: "loading" });

    fetch(
      `/api/file?path=${encodeURIComponent(target.file)}&line=${target.line}`,
    )
      .then((r) => r.json())
      .then(
        (data: ExtractedBlock & { absolutePath?: string; error?: string }) => {
          if (data.error) {
            setState({ status: "error", message: data.error });
            return;
          }
          setState({
            status: "ok",
            block: data,
            absolutePath: data.absolutePath ?? "",
          });
        },
      )
      .catch((e) => setState({ status: "error", message: String(e) }));
  }, [target.file, target.line, target.layer]);

  useEffect(() => {
    if (targetRowRef.current) {
      targetRowRef.current.scrollIntoView({
        block: "center",
        behavior: "smooth",
      });
    }
  }, [state]);

  const openInVSCode = () => {
    if (state.status !== "ok" || !state.absolutePath) return;
    window.open(`vscode://file/${state.absolutePath}:${target.line}`, "_self");
  };

  const accentColor = LAYER_COLOR[target.layer] ?? "#94a3b8";

  return (
    <div
      style={{
        width,
        background: "#0d1117",
        display: "flex",
        flexDirection: "column",
        borderLeft: "1px solid #30363d",
        flexShrink: 0,
        position: "relative",
      }}
    >
      {/* Resize handle */}
      <div
        onMouseDown={onMouseDown}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 5,
          cursor: "col-resize",
          zIndex: 10,
          background: "transparent",
          transition: "background 0.15s",
        }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.background = "rgba(88,166,255,0.25)")
        }
        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
      />
      {/* Header */}
      <div
        style={{
          padding: "10px 14px",
          borderBottom: "1px solid #21262d",
          background: "#161b22",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Function name */}
            {state.status === "ok" && state.block.functionName && (
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: accentColor,
                  fontFamily: "monospace",
                  marginBottom: 3,
                }}
              >
                {state.block.functionName}()
              </div>
            )}
            {/* Label */}
            <div
              style={{
                fontSize: 11,
                color: "#e6edf3",
                fontFamily: "monospace",
              }}
            >
              {target.label}
            </div>
            {/* Description (for edge call sites) */}
            {target.description && (
              <div
                style={{
                  fontSize: 10,
                  color: "#8b949e",
                  fontFamily: "sans-serif",
                  marginTop: 2,
                }}
              >
                {target.description}
              </div>
            )}
            {/* File path */}
            <div
              style={{
                fontSize: 10,
                color: "#8b949e",
                fontFamily: "monospace",
                marginTop: 2,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {target.file}
              {target.line > 0 && (
                <span style={{ color: "#58a6ff" }}>:{target.line}</span>
              )}
            </div>
          </div>

          <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
            {state.status === "ok" && state.absolutePath && (
              <button
                onClick={openInVSCode}
                title="Open in VS Code"
                style={{
                  padding: "4px 10px",
                  background: "#21262d",
                  color: "#c9d1d9",
                  border: "1px solid #30363d",
                  borderRadius: 5,
                  fontSize: 11,
                  cursor: "pointer",
                  fontFamily: "sans-serif",
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                VS Code
              </button>
            )}
            <button
              onClick={onClose}
              style={{
                padding: "4px 8px",
                background: "transparent",
                color: "#8b949e",
                border: "1px solid #30363d",
                borderRadius: 5,
                fontSize: 12,
                cursor: "pointer",
                lineHeight: 1,
              }}
            >
              ✕
            </button>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflow: "auto", background: "#0d1117" }}>
        {state.status === "loading" && (
          <div
            style={{
              padding: 20,
              color: "#6e7681",
              fontSize: 12,
              fontFamily: "sans-serif",
            }}
          >
            Loading...
          </div>
        )}

        {state.status === "error" && (
          <div
            style={{
              padding: 20,
              color: "#f38ba8",
              fontSize: 12,
              fontFamily: "monospace",
            }}
          >
            {state.message}
          </div>
        )}

        {state.status === "ok" && !state.block.code && (
          <div
            style={{
              padding: 24,
              fontSize: 12,
              fontFamily: "sans-serif",
              textAlign: "center",
              marginTop: 40,
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 10 }}>🗄️</div>
            <div style={{ color: "#e6edf3", fontWeight: 600 }}>
              PostgreSQL — {target.label}
            </div>
            <div style={{ fontSize: 10, marginTop: 6, color: "#8b949e" }}>
              schema.prisma not found · check packages/db/prisma/
            </div>
          </div>
        )}

        {state.status === "ok" && state.block.code && (
          <CodeBlock
            block={state.block}
            accentColor={accentColor}
            targetRowRef={targetRowRef}
            file={target.file}
          />
        )}
      </div>
    </div>
  );
}
