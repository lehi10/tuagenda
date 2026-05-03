import hljs from "highlight.js/lib/core";
import type { ExtractedBlock } from "../server/extractor";
import { fs } from "../theme";
import { useTheme } from "../ThemeContext";

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
  const c = useTheme();

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
          background: c.bg.surface,
          borderBottom: `1px solid ${c.border.default}`,
          fontSize: fs.xs,
          color: c.text.muted,
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
        <span style={{ color: c.text.tertiary }}>target </span>
        <span style={{ color: accentColor, fontWeight: 600 }}>
          :{block.targetLine}
        </span>
        {hasFnRange && (
          <>
            &nbsp;·&nbsp;
            <span style={{ color: c.text.muted }}>fn </span>
            <span style={{ color: c.text.tertiary }}>
              {block.fnStartLine}–{block.fnEndLine}
            </span>
          </>
        )}
        &nbsp;·&nbsp;
        <span style={{ color: c.text.tertiary }}>click </span>
        <span style={{ color: c.info.text, fontWeight: 600 }}>VS Code</span>
        <span style={{ color: c.text.tertiary }}> to open</span>
      </div>

      {/* Code table */}
      <table
        style={{
          borderCollapse: "collapse",
          width: "100%",
          fontFamily:
            "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
          fontSize: fs.base,
          background: c.bg.base,
        }}
      >
        <tbody>
          {htmlLines.map((lineHtml, i) => {
            const lineNum = i + 1;
            const isTarget = lineNum === block.targetLine;
            const inFn =
              hasFnRange &&
              lineNum >= block.fnStartLine! &&
              lineNum <= block.fnEndLine!;

            let bg = "transparent";
            if (isTarget) bg = c.info.highlight;
            else if (inFn) bg = c.info.fnHighlight;

            return (
              <tr
                key={i}
                ref={isTarget ? targetRowRef : null}
                style={{
                  background: bg,
                  borderLeft: isTarget
                    ? `3px solid ${accentColor}`
                    : inFn
                      ? `3px solid ${c.info.fnBorder}`
                      : "3px solid transparent",
                }}
              >
                <td
                  style={{
                    userSelect: "none",
                    color: isTarget
                      ? accentColor
                      : inFn
                        ? c.text.muted
                        : c.text.ghost,
                    textAlign: "right",
                    padding: "1.5px 12px 1.5px 8px",
                    minWidth: 40,
                    fontSize: fs.sm,
                    verticalAlign: "top",
                    borderRight: `1px solid ${c.border.subtle}`,
                  }}
                >
                  {lineNum}
                </td>
                <td
                  style={{
                    padding: "1.5px 16px 1.5px 12px",
                    whiteSpace: "pre",
                    verticalAlign: "top",
                    color: c.code.fg,
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
