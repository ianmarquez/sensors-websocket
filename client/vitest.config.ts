/// <reference types="vitest" />

import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig, configDefaults } from "vitest/config";

const exclude = [
  ...configDefaults.exclude,
  "**/node_modules/**",
  "**/dist/**",
  "**/cypress/**",
  "**/.{idea,git,cache,output,temp}/**",
  "**/*.config.js",
  "**/*.d.ts",
  "**/*.cjs",
];

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    globals: true,
    environment: "jsdom",
    include: ["**/*.test.tsx"],
    setupFiles: "./src/test/setup.ts",
    exclude,
    coverage: {
      provider: "v8",
      exclude: [...exclude, "**/*.test.*"],
    },
  },
});
