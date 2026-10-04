import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Local dev: forward API calls to the backend (npm start / docker compose in the repo root).
    proxy: { "/api": "http://localhost:3000" },
  },
});
