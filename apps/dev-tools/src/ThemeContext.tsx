import { createContext, useContext, useState } from "react";
import type { ColorPalette } from "./theme";
import { darkTheme, lightTheme } from "./theme";

// ── Context ───────────────────────────────────────────────────────────────────

interface ThemeContextValue {
  colors: ColorPalette;
  isDark: boolean;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  colors: darkTheme,
  isDark: true,
  toggle: () => {},
});

// ── Provider ──────────────────────────────────────────────────────────────────

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(true);

  return (
    <ThemeContext.Provider
      value={{
        colors: isDark ? darkTheme : lightTheme,
        isDark,
        toggle: () => setIsDark((v) => !v),
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

// ── Hooks ─────────────────────────────────────────────────────────────────────

/** Returns the active color palette — use as `const c = useTheme()` */
export function useTheme(): ColorPalette {
  return useContext(ThemeContext).colors;
}

/** Returns isDark + toggle — for the theme switch button */
export function useThemeToggle() {
  const { isDark, toggle } = useContext(ThemeContext);
  return { isDark, toggle };
}
