// ── Layer config ──────────────────────────────────────────────────────────────

export const LAYER = {
  router: {
    bg: "#160d2a",
    border: "#7c3aed",
    badge: "#7c3aed",
    label: "Router",
  },
  procedure: {
    bg: "#0d1a30",
    border: "#388bfd",
    badge: "#388bfd",
    label: "Procedure",
  },
  usecase: {
    bg: "#0d2525",
    border: "#39d353",
    badge: "#39d353",
    label: "Use Case",
  },
  port: {
    bg: "#1c1500",
    border: "#f0b429",
    badge: "#f0b429",
    label: "Port",
  },
  repository: {
    bg: "#1a0d1e",
    border: "#f778ba",
    badge: "#f778ba",
    label: "Repository",
  },
  db: {
    bg: "#0d1117",
    border: "#484f58",
    badge: "#484f58",
    label: "DB",
  },
} as const;

export const PROC_BADGE = {
  public: { bg: "#0d2015", text: "#3fb950", label: "public" },
  private: { bg: "#1c1500", text: "#f0b429", label: "private" },
  businessMember: { bg: "#130d2a", text: "#a78bfa", label: "member" },
};
