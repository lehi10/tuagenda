import { defineConfig } from "tsup";

export default defineConfig({
  entry: {
    index: "src/index.ts",
    "infrastructure/index": "src/infrastructure/index.ts",
  },
  format: ["esm"],
  external: ["bullmq"],
  dts: false,
  clean: true,
});
