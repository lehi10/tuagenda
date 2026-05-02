import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { FlowGraph } from "./FlowGraph";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <FlowGraph />
  </StrictMode>,
);
