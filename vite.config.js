import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react({
        // include: "**/*.tsx",

  }), tsconfigPaths()],
  define: {
    "process.env": {
      VITE_NODE_OPTIONS: '"--max-old-space-size=7168"',
    },
  },
  // ...
});
