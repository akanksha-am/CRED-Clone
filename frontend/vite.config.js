import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 80,
    host: true,
  },
  define: {
    "process.env.VITE_KEY": JSON.stringify(process.env.VITE_KEY),
  },
});
