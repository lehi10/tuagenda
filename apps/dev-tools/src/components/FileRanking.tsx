import { useEffect, useState } from "react";

interface FileEntry {
  path: string;
  lines: number;
}

// Refactor urgency: top 10% of files are flagged
function urgencyColor(i: number, total: number): string {
  const pct = i / Math.max(total - 1, 1);
  if (pct < 0.05) return "#f85149"; // top 5% — high priority
  if (pct < 0.15) return "#e3b341"; // top 15% — medium
  if (pct < 0.35) return "#8b949e"; // top 35% — low
  return "#484f58"; // rest — fine
}

function urgencyLabel(
  i: number,
  total: number,
): { label: string; color: string; bg: string } | null {
  const pct = i / Math.max(total - 1, 1);
  if (pct < 0.05) return { label: "refactor", color: "#f85149", bg: "#2d0f0f" };
  if (pct < 0.15) return { label: "review", color: "#e3b341", bg: "#2a1f00" };
  return null;
}

export function FileRanking() {
  const [files, setFiles] = useState<FileEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("");

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/file-ranking");
      const data: FileEntry[] | { error: string } = await res.json();
      if ("error" in data) throw new Error(data.error);
      setFiles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const maxLines = files[0]?.lines ?? 1;
  const filtered = filter.trim()
    ? files.filter((f) =>
        f.path.toLowerCase().includes(filter.trim().toLowerCase()),
      )
    : files;

  const badge = (filePath: string) => {
    if (filePath.endsWith(".tsx"))
      return { label: "tsx", bg: "#0d1a3a", color: "#79c0ff" };
    return { label: "ts", bg: "#1a0d30", color: "#d2a8ff" };
  };

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        background: "#0d1117",
        fontFamily: "sans-serif",
      }}
    >
      {/* Toolbar */}
      <div
        style={{
          padding: "8px 16px",
          borderBottom: "1px solid #21262d",
          display: "flex",
          alignItems: "center",
          gap: 10,
          flexShrink: 0,
        }}
      >
        <div style={{ position: "relative" }}>
          <svg
            style={{
              position: "absolute",
              left: 8,
              top: "50%",
              transform: "translateY(-50%)",
              color: "#6e7681",
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
              border: "1px solid #30363d",
              borderRadius: 6,
              fontSize: 12,
              width: 220,
              outline: "none",
              fontFamily: "monospace",
              background: "#161b22",
              color: "#e6edf3",
            }}
          />
        </div>
        {!loading && (
          <span style={{ fontSize: 11, color: "#c9d1d9" }}>
            {filtered.length} / {files.length} files
          </span>
        )}
        <button
          onClick={load}
          style={{
            marginLeft: "auto",
            padding: "5px 12px",
            background: "#1c2128",
            color: "#c9d1d9",
            border: "1px solid #30363d",
            borderRadius: 6,
            fontSize: 11,
            cursor: "pointer",
            fontWeight: 500,
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#282e36";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#1c2128";
          }}
        >
          Refresh
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: "auto" }}>
        {loading && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              color: "#8b949e",
              fontSize: 13,
            }}
          >
            Scanning files...
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
            <div style={{ color: "#f85149", fontWeight: 700 }}>
              Failed to load
            </div>
            <div
              style={{
                fontSize: 12,
                fontFamily: "monospace",
                background: "#1a0a0a",
                padding: "8px 14px",
                borderRadius: 6,
                color: "#f85149",
                border: "1px solid #3d1c1c",
              }}
            >
              {error}
            </div>
            <button
              onClick={load}
              style={{
                padding: "6px 14px",
                background: "#3d1c1c",
                color: "#f85149",
                border: "1px solid #612020",
                borderRadius: 6,
                cursor: "pointer",
                fontSize: 12,
              }}
            >
              Retry
            </button>
          </div>
        )}

        {!loading && !error && (
          <table
            style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}
          >
            <thead>
              <tr
                style={{
                  borderBottom: "1px solid #21262d",
                  position: "sticky",
                  top: 0,
                  background: "#0d1117",
                  zIndex: 1,
                }}
              >
                <th
                  style={{
                    padding: "8px 12px",
                    color: "#adbac7",
                    fontWeight: 600,
                    fontSize: 10,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    width: 48,
                    textAlign: "right",
                  }}
                >
                  #
                </th>
                <th
                  style={{
                    padding: "8px 12px",
                    color: "#adbac7",
                    fontWeight: 600,
                    fontSize: 10,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    textAlign: "left",
                  }}
                >
                  File
                </th>
                <th
                  style={{
                    padding: "8px 12px",
                    color: "#adbac7",
                    fontWeight: 600,
                    fontSize: 10,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    width: 80,
                    textAlign: "right",
                  }}
                >
                  Lines
                </th>
                <th
                  style={{
                    padding: "8px 12px",
                    color: "#adbac7",
                    fontWeight: 600,
                    fontSize: 10,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    width: 100,
                  }}
                >
                  &nbsp;
                </th>
                <th style={{ padding: "8px 24px 8px 0", width: 200 }} />
              </tr>
            </thead>
            <tbody>
              {filtered.map((entry, i) => {
                const b = badge(entry.path);
                const pct = Math.max(
                  3,
                  Math.round((entry.lines / maxLines) * 100),
                );
                const color = urgencyColor(i, filtered.length);
                const tag = urgencyLabel(i, filtered.length);
                const dir = entry.path.split("/").slice(0, -1).join("/");
                const filename = entry.path.split("/").pop() ?? entry.path;

                return (
                  <tr
                    key={entry.path}
                    style={{
                      borderBottom: "1px solid #161b22",
                      transition: "background 0.1s",
                    }}
                    onMouseEnter={(e) => {
                      (
                        e.currentTarget as HTMLTableRowElement
                      ).style.background = "#161b22";
                    }}
                    onMouseLeave={(e) => {
                      (
                        e.currentTarget as HTMLTableRowElement
                      ).style.background = "transparent";
                    }}
                  >
                    {/* Rank */}
                    <td
                      style={{
                        padding: "9px 12px",
                        textAlign: "right",
                        fontFamily: "monospace",
                        fontSize: 11,
                        color: "#8b949e",
                      }}
                    >
                      {i + 1}
                    </td>

                    {/* File path */}
                    <td style={{ padding: "9px 12px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        <span
                          style={{
                            display: "inline-block",
                            padding: "1px 6px",
                            borderRadius: 4,
                            fontSize: 9,
                            fontWeight: 700,
                            background: b.bg,
                            color: b.color,
                            fontFamily: "monospace",
                            letterSpacing: "0.03em",
                            flexShrink: 0,
                          }}
                        >
                          {b.label}
                        </span>
                        <span style={{ fontFamily: "monospace", fontSize: 12 }}>
                          {dir && (
                            <span style={{ color: "#8b949e" }}>{dir}/</span>
                          )}
                          <span style={{ color: "#e6edf3", fontWeight: 500 }}>
                            {filename}
                          </span>
                        </span>
                      </div>
                    </td>

                    {/* Line count */}
                    <td
                      style={{
                        padding: "9px 12px",
                        textAlign: "right",
                        fontFamily: "monospace",
                        fontWeight: 700,
                        color: color,
                        fontSize: 12,
                      }}
                    >
                      {entry.lines.toLocaleString()}
                    </td>

                    {/* Urgency tag */}
                    <td style={{ padding: "9px 12px" }}>
                      {tag && (
                        <span
                          style={{
                            fontSize: 10,
                            fontWeight: 600,
                            padding: "2px 7px",
                            background: tag.bg,
                            color: tag.color,
                            borderRadius: 4,
                            fontFamily: "sans-serif",
                            border: `1px solid ${tag.color}33`,
                          }}
                        >
                          {tag.label}
                        </span>
                      )}
                    </td>

                    {/* Bar */}
                    <td style={{ padding: "9px 24px 9px 0" }}>
                      <div
                        style={{
                          height: 4,
                          borderRadius: 2,
                          background: "#21262d",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            height: "100%",
                            width: `${pct}%`,
                            background: color,
                            borderRadius: 2,
                            opacity: 0.7,
                            transition: "width 0.4s ease",
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
