import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Port: see ../../PORTS.md (work-together block 5100–5199).
  // Local dev moved 5173 -> 5101 to avoid colliding with ai_companion /
  // automatische_bewerbungen, which also defaulted to 5173.
  server: {
    port: 5101,
  },
});
