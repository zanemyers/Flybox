import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  root: "./client",
  server: {
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
  resolve: {
    alias: {
      "@images": path.resolve(__dirname, "../client/src/assets/images"),
      "@components": path.resolve(__dirname, "../client/src/components"),
      "@styles": path.resolve(__dirname, "../client/src/assets/styles"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        quietDeps: true, // 👈 suppresses Bootstrap's deprecation warnings
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 1000, // increase limit from 500 kB to 1 MB
  },
});
