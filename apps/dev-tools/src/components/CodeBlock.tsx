import hljs from "highlight.js/lib/core";
import type { ExtractedBlock } from "../server/extractor";

// ── CodeBlock: syntax-highlighted table with line numbers ────────────────────

interface CodeBlockProps {
  block: ExtractedBlock;
  accentColor: string;
  targetRowRef: React.RefObject<HTMLTableRowElement | null>;
  file: string;
}

export function CodeBlock({
  block,
  accentColor,
  targetRowRef,
  file,
}: CodeBlockProps) {
  const lang = file.endsWith(".prisma") ? "plaintext" : "typescript";
  const highlighted = hljs.highlight(block.code, { language: lang }).value;
  const htmlLines = highlighted.split("\n");
  const hasFnRange = block.fnStartLine != null && block.fnEndLine != null;

  return (
    <>
      {/* Banner */}
      <div
        style={{
          padding: "5px 14px",
          background: "#161b22",
          borderBottom: "1px solid #30363d",
          fontSize: 10,
          color: "#8b949e",
          fontFamily: "sans-serif",
          display: "flex",
          alignItems: "center",
          gap: 6,
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: accentColor,
            display: "inline-block",
            flexShrink: 0,
          }}
        />
        {htmlLines.length} lines &nbsp;·&nbsp;
        <span style={{ color: "#adbac7" }}>target </span>
        <span style={{ color: accentColor, fontWeight: 600 }}>
          :{block.targetLine}
        </span>
        {hasFnRange && (
          <>
            &nbsp;·&nbsp;
            <span style={{ color: "#8b949e" }}>fn </span>
            <span style={{ color: "#adbac7" }}>
              {block.fnStartLine}–{block.fnEndLine}
            </span>
          </>
        )}
        &nbsp;·&nbsp;
        <span style={{ color: "#adbac7" }}>click </span>
        <span style={{ color: "#58a6ff", fontWeight: 600 }}>VS Code</span>
        <span style={{ color: "#adbac7" }}> to open</span>
      </div>

      {/* Code table */}
      <table
        style={{
          borderCollapse: "collapse",
          width: "100%",
          fontFamily:
            "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
          fontSize: 12,
          background: "#0d1117",
        }}
      >
        <tbody>
          {htmlLines.map((lineHtml, i) => {
            const lineNum = i + 1; // startLine is always 1 (full file)
            const isTarget = lineNum === block.targetLine;
            const inFn =
              hasFnRange &&
              lineNum >= block.fnStartLine! &&
              lineNum <= block.fnEndLine!;

            let bg = "transparent";
            if (isTarget) bg = "rgba(88,166,255,0.13)";
            else if (inFn) bg = "rgba(255,255,255,0.03)";

            return (
              <tr
                key={i}
                ref={isTarget ? targetRowRef : null}
                style={{
                  background: bg,
                  borderLeft: isTarget
                    ? `3px solid ${accentColor}`
                    : inFn
                      ? "3px solid rgba(255,255,255,0.06)"
                      : "3px solid transparent",
                }}
              >
                <td
                  style={{
                    userSelect: "none",
                    color: isTarget
                      ? accentColor
                      : inFn
                        ? "#8b949e"
                        : "#484f58",
                    textAlign: "right",
                    padding: "1.5px 12px 1.5px 8px",
                    minWidth: 40,
                    fontSize: 11,
                    verticalAlign: "top",
                    borderRight: "1px solid #21262d",
                  }}
                >
                  {lineNum}
                </td>
                <td
                  style={{
                    padding: "1.5px 16px 1.5px 12px",
                    whiteSpace: "pre",
                    verticalAlign: "top",
                    color: "#abb2bf",
                  }}
                  dangerouslySetInnerHTML={{ __html: lineHtml || " " }}
                />
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
}
