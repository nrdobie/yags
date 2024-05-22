import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-vite-plugin";
import Unfonts from "unplugin-fonts/vite";
import path from "node:path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    Unfonts({
      custom: {
        families: [
          {
            name: "ITC Korinna",
            local: "ITC Korinna",
            src: "./src/assets/fonts/itc-korinna/*.otf",
          },
          {
            name: "Swiss 911 Condensed",
            local: "Swiss 911 Condensed",
            src: "./src/assets/fonts/swiss-911-condensed/*.otf",
          },
        ],
        display: "block",
        preload: true,
        prefetch: true,
      },
    }),
    TanStackRouterVite({
      generatedRouteTree: "src/route-tree.gen.ts",
    }),
  ],
  resolve: {
    alias: {
      "~": path.resolve(__dirname, "./src"),
    },
  },
});
