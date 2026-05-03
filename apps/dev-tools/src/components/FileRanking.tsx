import { useEffect, useState } from "react";
import { fs } from "../theme";
import { useTheme } from "../ThemeContext";

interface FileMetrics {
  path: string;
  lines: number;
  anyCount: number;
  asCount: number;
  tsIgnoreCount: number;
  consoleCount: number;
  todoCount: number;
  useEffectCount: number;
  importCount: number;
  fnCount: number;
  maxFnLines: number;
  avgFnLines: number;
}

// ── Urgency helpers ───────────────────────────────────────────────────────────

function useLineColor() {
  const c = useTheme();
  return (i: number, total: number): string => {
    const pct = i / Math.max(total - 1, 1);
    if (pct < 0.05) return c.danger.text;
    if (pct < 0.15) return c.warning.text;
    if (pct < 0.35) return c.text.muted;
    return c.text.ghost;
  };
}

function useMaxFnColor() {
  const c = useTheme();
  return (lines: number): string => {
    if (lines >= 100) return c.danger.text;
    if (lines >= 50) return c.warning.text;
    if (lines >= 25) return c.text.muted;
    return c.success.text;
  };
}

// ── Badge component ───────────────────────────────────────────────────────────

interface BadgeDef {
  key: string;
  label: string;
  value: number | string;
  color: string;
  bg: string;
  title: string;
}

function MetricBadge({ label, value, color, bg, title }: BadgeDef) {
  return (
    <span
      title={title}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 3,
        padding: "1px 6px",
        borderRadius: 4,
        fontSize: fs.xs,
        fontFamily: "monospace",
        background: bg,
        color,
        border: `1px solid ${color}33`,
        whiteSpace: "nowrap",
        cursor: "default",
      }}
    >
      <span style={{ opacity: 0.7, fontSize: fs.xxs }}>{label}</span>
      <span style={{ fontWeight: 700 }}>{value}</span>
    </span>
  );
}

// ── Sort options ──────────────────────────────────────────────────────────────

type SortKey =
  | "lines"
  | "any"
  | "maxFnLines"
  | "tsIgnore"
  | "console"
  | "imports";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "lines", label: "Lines" },
  { key: "any", label: "any count" },
  { key: "maxFnLines", label: "Max fn length" },
  { key: "tsIgnore", label: "@ts-ignore" },
  { key: "console", label: "console.log" },
  { key: "imports", label: "Imports" },
];

function sortFiles(files: FileMetrics[], key: SortKey): FileMetrics[] {
  return [...files].sort((a, b) => {
    switch (key) {
      case "lines":
        return b.lines - a.lines;
      case "any":
        return b.anyCount - a.anyCount;
      case "maxFnLines":
        return b.maxFnLines - a.maxFnLines;
      case "tsIgnore":
        return b.tsIgnoreCount - a.tsIgnoreCount;
      case "console":
        return b.consoleCount - a.consoleCount;
      case "imports":
        return b.importCount - a.importCount;
    }
  });
}

// ── Main component ────────────────────────────────────────────────────────────

export function FileRanking() {
  const c = useTheme();
  const lineColor = useLineColor();
  const maxFnColor = useMaxFnColor();

  const [files, setFiles] = useState<FileMetrics[]>([]);
  const [scopes, setScopes] = useState<string[]>([]);
  const [scope, setScope] = useState("apps/web-app");
  const [totalInRepo, setTotalInRepo] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("lines");

  const load = async (forceRefresh = false) => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({ scope });
      if (forceRefresh) params.set("refresh", "1");
      const res = await fetch(`/api/file-ranking?${params}`);
      const data:
        | { metrics: FileMetrics[]; scopes: string[]; total: number }
        | { error: string } = await res.json();
      if ("error" in data) throw new Error(data.error);
      setFiles(data.metrics);
      setScopes(data.scopes);
      setTotalInRepo(data.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [scope]);

  // ── Compute badges inside component so colors are reactive ────────────────
  const getBadges = (f: FileMetrics): BadgeDef[] => {
    const badges: BadgeDef[] = [];

    if (f.tsIgnoreCount > 0)
      badges.push({
        key: "ts-ignore",
        label: "@ts-ignore",
        value: f.tsIgnoreCount,
        color: c.danger.text,
        bg: c.danger.bg,
        title: "TypeScript errors silenced with @ts-ignore or @ts-nocheck",
      });

    if (f.anyCount > 0)
      badges.push({
        key: "any",
        label: "any",
        value: f.anyCount,
        color: f.anyCount >= 5 ? c.danger.text : c.warning.text,
        bg: f.anyCount >= 5 ? c.danger.bg : c.warning.bg,
        title: `${f.anyCount} uses of the \`any\` type — reduces type safety`,
      });

    if (f.asCount > 3)
      badges.push({
        key: "as",
        label: "as cast",
        value: f.asCount,
        color: c.warning.text,
        bg: c.warning.bg,
        title: `${f.asCount} type assertions (as Foo) — consider tightening types`,
      });

    if (f.consoleCount > 0)
      badges.push({
        key: "console",
        label: "console",
        value: f.consoleCount,
        color: c.orange.text,
        bg: c.orange.bg,
        title: `${f.consoleCount} console.log/warn/error calls left in code`,
      });

    if (f.todoCount > 0)
      badges.push({
        key: "todo",
        label: "TODO",
        value: f.todoCount,
        color: c.warning.text,
        bg: c.warning.bg,
        title: `${f.todoCount} TODO / FIXME / HACK comments`,
      });

    if (f.maxFnLines >= 25) {
      const col = maxFnColor(f.maxFnLines);
      badges.push({
        key: "maxfn",
        label: "max fn",
        value: `${f.maxFnLines}ln`,
        color: col,
        bg:
          col === c.danger.text
            ? c.danger.bg
            : col === c.warning.text
              ? c.warning.bg
              : c.bg.surface,
        title: `Longest function is ${f.maxFnLines} lines — consider splitting`,
      });
    }

    if (f.useEffectCount >= 3)
      badges.push({
        key: "useeffect",
        label: "useEffect",
        value: f.useEffectCount,
        color: c.info.lightText,
        bg: c.info.bg,
        title: `${f.useEffectCount} useEffect calls — may indicate complex side-effect logic`,
      });

    if (f.importCount >= 12)
      badges.push({
        key: "imports",
        label: "imports",
        value: f.importCount,
        color: c.purple.text,
        bg: c.purple.bg,
        title: `${f.importCount} imports — highly coupled file`,
      });

    return badges;
  };

  const extBadge = (p: string) =>
    p.endsWith(".tsx")
      ? { label: "tsx", bg: c.info.bg, color: c.info.lightText }
      : { label: "ts", bg: c.purple.bg, color: c.purple.text };

  const filtered = filter.trim()
    ? files.filter((f) =>
        f.path.toLowerCase().includes(filter.trim().toLowerCase()),
      )
    : files;

  const sorted = sortFiles(filtered, sortKey);
  const maxLines = sorted[0]?.lines ?? 1;

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: c.bg.base,
        fontFamily: "sans-serif",
      }}
    >
      {/* ── Toolbar ── */}
      <div
        style={{
          padding: "8px 16px",
          borderBottom: `1px solid ${c.border.subtle}`,
          display: "flex",
          alignItems: "center",
          gap: 10,
          flexShrink: 0,
        }}
      >
        {/* Search */}
        <div style={{ position: "relative" }}>
          <svg
            style={{
              position: "absolute",
              left: 8,
              top: "50%",
              transform: "translateY(-50%)",
              color: c.text.dim,
              pointerEvents: "none",
            }}
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            placeholder="Filter files..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{
              paddingLeft: 28,
              paddingRight: 10,
              paddingTop: 5,
              paddingBottom: 5,
              border: `1px solid ${c.border.default}`,
              borderRadius: 6,
              fontSize: fs.base,
              width: 200,
              outline: "none",
              fontFamily: "monospace",
              background: c.bg.surface,
              color: c.text.primary,
            }}
          />
        </div>

        {/* Scope */}
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ fontSize: fs.xs, color: c.text.muted }}>scope</span>
          <select
            value={scope}
            onChange={(e) => setScope(e.target.value)}
            style={{
              padding: "4px 8px",
              background: c.bg.surface,
              color: c.text.secondary,
              border: `1px solid ${c.border.default}`,
              borderRadius: 6,
              fontSize: fs.sm,
              cursor: "pointer",
              outline: "none",
            }}
          >
            {scopes.map((s) => (
              <option key={s} value={s}>
                {s === "all" ? `all (${totalInRepo})` : s}
              </option>
            ))}
          </select>
        </div>

        {/* Sort */}
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <span style={{ fontSize: fs.xs, color: c.text.muted }}>sort by</span>
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            style={{
              padding: "4px 8px",
              background: c.bg.surface,
              color: c.text.secondary,
              border: `1px solid ${c.border.default}`,
              borderRadius: 6,
              fontSize: fs.sm,
              cursor: "pointer",
              outline: "none",
            }}
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.key} value={o.key}>
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {!loading && (
          <span style={{ fontSize: fs.sm, color: c.text.secondary }}>
            {filtered.length} / {files.length} files
          </span>
        )}

        <button
          onClick={() => load(true)}
          title="Clear cache and re-analyze"
          style={{
            marginLeft: "auto",
            padding: "5px 12px",
            background: c.bg.raised,
            color: c.text.secondary,
            border: `1px solid ${c.border.default}`,
            borderRadius: 6,
            fontSize: fs.sm,
            cursor: "pointer",
            fontWeight: 500,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              c.bg.hover;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background =
              c.bg.raised;
          }}
        >
          Refresh
        </button>
      </div>

      {/* ── Content ── */}
      <div style={{ flex: 1, overflow: "auto" }}>
        {loading && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              gap: 6,
            }}
          >
            <div style={{ color: c.text.secondary, fontSize: fs.base }}>
              Analyzing files with ts-morph...
            </div>
            <div style={{ color: c.text.muted, fontSize: fs.sm }}>
              First scan may take a few seconds
            </div>
          </div>
        )}

        {error && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              gap: 10,
            }}
          >
            <div style={{ color: c.danger.text, fontWeight: 700 }}>
              Failed to load
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
              {error}
            </div>
            <button
              onClick={load}
              style={{
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

        {!loading && !error && (
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: fs.base,
            }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: `1px solid ${c.border.subtle}`,
                  position: "sticky",
                  top: 0,
                  background: c.bg.base,
                  zIndex: 1,
                }}
              >
                {[
                  { label: "#", w: 40, align: "right" as const },
                  { label: "File", align: "left" as const },
                  { label: "Lines", w: 56, align: "right" as const },
                  { label: "Fns", w: 52, align: "right" as const },
                  { label: "Imports", w: 56, align: "right" as const },
                  { label: "Issues" },
                ].map((col) => (
                  <th
                    key={col.label}
                    style={{
                      padding: "8px 12px",
                      color: c.text.tertiary,
                      fontWeight: 600,
                      fontSize: fs.xs,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      width: col.w,
                      textAlign: col.align ?? "left",
                    }}
                  >
                    {col.label}
                  </th>
                ))}
                <th style={{ padding: "8px 24px 8px 8px", width: 160 }} />
              </tr>
            </thead>
            <tbody>
              {sorted.map((entry, i) => {
                const b = extBadge(entry.path);
                const pct = Math.max(
                  3,
                  Math.round((entry.lines / maxLines) * 100),
                );
                const color = lineColor(i, sorted.length);
                const dir = entry.path.split("/").slice(0, -1).join("/");
                const filename = entry.path.split("/").pop() ?? entry.path;
                const badges = getBadges(entry);

                return (
                  <tr
                    key={entry.path}
                    style={{
                      borderBottom: `1px solid ${c.border.faint}`,
                      transition: "background 0.1s",
                    }}
                    onMouseEnter={(e) => {
                      (
                        e.currentTarget as HTMLTableRowElement
                      ).style.background = c.bg.surface;
                    }}
                    onMouseLeave={(e) => {
                      (
                        e.currentTarget as HTMLTableRowElement
                      ).style.background = "transparent";
                    }}
                  >
                    <td
                      style={{
                        padding: "10px 12px",
                        textAlign: "right",
                        fontFamily: "monospace",
                        fontSize: fs.sm,
                        color: c.text.muted,
                        verticalAlign: "top",
                      }}
                    >
                      {i + 1}
                    </td>

                    <td style={{ padding: "10px 12px", verticalAlign: "top" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 7,
                          marginBottom: badges.length > 0 ? 5 : 0,
                        }}
                      >
                        <span
                          style={{
                            display: "inline-block",
                            padding: "1px 5px",
                            borderRadius: 4,
                            fontSize: fs.xxs,
                            fontWeight: 700,
                            background: b.bg,
                            color: b.color,
                            fontFamily: "monospace",
                            flexShrink: 0,
                          }}
                        >
                          {b.label}
                        </span>
                        <span
                          style={{ fontFamily: "monospace", fontSize: fs.sm }}
                        >
                          {dir && (
                            <span style={{ color: c.text.muted }}>{dir}/</span>
                          )}
                          <span
                            style={{ color: c.text.primary, fontWeight: 500 }}
                          >
                            {filename}
                          </span>
                        </span>
                      </div>
                      {badges.length > 0 && (
                        <div
                          style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 4,
                            paddingLeft: 2,
                          }}
                        >
                          {badges.map((badge) => (
                            <MetricBadge key={badge.key} {...badge} />
                          ))}
                        </div>
                      )}
                    </td>

                    <td
                      style={{
                        padding: "10px 12px",
                        textAlign: "right",
                        fontFamily: "monospace",
                        fontWeight: 700,
                        color,
                        fontSize: fs.base,
                        verticalAlign: "top",
                      }}
                    >
                      {entry.lines.toLocaleString()}
                    </td>

                    <td
                      style={{
                        padding: "10px 12px",
                        textAlign: "right",
                        fontFamily: "monospace",
                        fontSize: fs.sm,
                        color: c.text.tertiary,
                        verticalAlign: "top",
                      }}
                    >
                      {entry.fnCount}
                    </td>

                    <td
                      style={{
                        padding: "10px 12px",
                        textAlign: "right",
                        fontFamily: "monospace",
                        fontSize: fs.sm,
                        color:
                          entry.importCount >= 12
                            ? c.purple.text
                            : c.text.tertiary,
                        verticalAlign: "top",
                      }}
                    >
                      {entry.importCount}
                    </td>

                    <td style={{ padding: "10px 12px", verticalAlign: "top" }}>
                      {badges.length === 0 ? (
                        <span
                          style={{ fontSize: fs.xs, color: c.success.text }}
                        >
                          ✓ clean
                        </span>
                      ) : (
                        <span style={{ fontSize: fs.xs, color: c.text.muted }}>
                          {badges.length} issue{badges.length > 1 ? "s" : ""}
                        </span>
                      )}
                    </td>

                    <td
                      style={{
                        padding: "10px 24px 10px 8px",
                        verticalAlign: "top",
                      }}
                    >
                      <div
                        style={{
                          height: 4,
                          borderRadius: 2,
                          background: c.border.subtle,
                          overflow: "hidden",
                          marginTop: 4,
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${pct}%`,
                            background: color,
                            borderRadius: 2,
                            opacity: 0.7,
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
