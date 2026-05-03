import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "./ThemeContext";
import { FlowGraph } from "./FlowGraph";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <FlowGraph />
    </ThemeProvider>
  </StrictMode>,
);
