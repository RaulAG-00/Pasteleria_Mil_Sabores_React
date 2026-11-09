import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";

// base "./" permite publicar el sitio en cualquier carpeta
// (por ejemplo GitHub Pages) sin que se rompan las imágenes.
export default defineConfig({
  base: "./",
  plugins: [react()],
  test: {
    environment: "jsdom",
  },
});