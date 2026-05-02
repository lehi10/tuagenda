// ── Layer config ──────────────────────────────────────────────────────────────

export const LAYER = {
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

export const PROC_BADGE = {
  public: { bg: "#f0fdf4", text: "#166534", label: "public" },
  private: { bg: "#fef3c7", text: "#92400e", label: "private" },
  businessMember: { bg: "#ede9fe", text: "#5b21b6", label: "member" },
};
