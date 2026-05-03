// ── Typography scale ──────────────────────────────────────────────────────────

export const fs = {
  xxs: 10, // badge inner labels
  xs: 11, // uppercase section headers, timestamps
  sm: 12, // secondary text, file paths, op-type badges
  base: 13, // main body text, procedure names, code
  md: 14, // medium headings
  lg: 15, // node titles, primary labels
} as const;

// ── Dark theme ────────────────────────────────────────────────────────────────

export const darkTheme = {
  bg: {
    base: "#0d1117",
    surface: "#161b22",
    raised: "#1c2128",
    hover: "#282e36",
  },
  border: {
    faint: "#161b22",
    subtle: "#21262d",
    default: "#30363d",
  },
  text: {
    primary: "#e6edf3",
    secondary: "#c9d1d9",
    tertiary: "#adbac7",
    muted: "#8b949e",
    dim: "#7d8590",
    ghost: "#484f58",
    faint: "#30363d",
  },
  brand: {
    primary: "#7c3aed",
    secondary: "#4f46e5",
    light: "#a78bfa",
    faint: "#d2a8ff",
  },
  danger: {
    text: "#f85149",
    bg: "#2d0f0f",
    border: "#3d1c1c",
    altBg: "#1a0a0a",
    altBorder: "#612020",
  },
  warning: {
    text: "#e3b341",
    bg: "#2a1f00",
    highlight: "#3d2e00",
    highlightText: "#f0b429",
  },
  success: {
    text: "#3fb950",
  },
  info: {
    text: "#58a6ff",
    lightText: "#79c0ff",
    bg: "#0d1a3a",
    highlight: "rgba(88,166,255,0.13)",
    fnHighlight: "rgba(255,255,255,0.03)",
    fnBorder: "rgba(255,255,255,0.06)",
  },
  orange: {
    text: "#f97316",
    bg: "#2a1200",
  },
  purple: {
    text: "#d2a8ff",
    bg: "#1a0d30",
  },
  edge: {
    implements: "#a78bfa",
    default: "#94a3b8",
    sibling: "#d1d5db",
    label: "#6b7280",
    labelBg: "white",
  },
  code: {
    fg: "#abb2bf",
  },
};

// ── Light theme ───────────────────────────────────────────────────────────────

export const lightTheme = {
  bg: {
    base: "#ffffff",
    surface: "#f6f8fa",
    raised: "#eaeef2",
    hover: "#d0d7de",
  },
  border: {
    faint: "#eaeef2",
    subtle: "#d0d7de",
    default: "#afb8c1",
  },
  text: {
    primary: "#1f2328",
    secondary: "#24292f",
    tertiary: "#57606a",
    muted: "#6e7781",
    dim: "#8c959f",
    ghost: "#afb8c1",
    faint: "#d0d7de",
  },
  brand: {
    primary: "#7c3aed",
    secondary: "#4f46e5",
    light: "#6d28d9",
    faint: "#8250df",
  },
  danger: {
    text: "#cf222e",
    bg: "#fff0ee",
    border: "#ffc1ba",
    altBg: "#fff0ee",
    altBorder: "#ffc1ba",
  },
  warning: {
    text: "#9a6700",
    bg: "#fff8c5",
    highlight: "#fff8c5",
    highlightText: "#9a6700",
  },
  success: {
    text: "#116329",
  },
  info: {
    text: "#0969da",
    lightText: "#218bff",
    bg: "#ddf4ff",
    highlight: "rgba(9,105,218,0.1)",
    fnHighlight: "rgba(0,0,0,0.03)",
    fnBorder: "rgba(0,0,0,0.06)",
  },
  orange: {
    text: "#bc4c00",
    bg: "#fff1e5",
  },
  purple: {
    text: "#8250df",
    bg: "#fbefff",
  },
  edge: {
    implements: "#7c3aed",
    default: "#57606a",
    sibling: "#8c959f",
    label: "#57606a",
    labelBg: "white",
  },
  code: {
    fg: "#24292f",
  },
};

// ── Type ──────────────────────────────────────────────────────────────────────

export type ColorPalette = typeof darkTheme;
