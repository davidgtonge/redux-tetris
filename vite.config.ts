/// <reference types="vitest/config" />
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const base = process.env.GITHUB_PAGES === "true" ? "/redux-tetris/" : "/";

export default defineConfig({
  base,
  plugins: [react()],
  test: {
    environment: "node",
    include: ["test/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "text-summary", "html"],
      reportsDirectory: "coverage",
      include: ["src/tetris/**/*.ts"],
      exclude: ["src/tetris/index.ts"],
    },
  },
});
