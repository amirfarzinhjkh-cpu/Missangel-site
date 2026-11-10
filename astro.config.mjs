import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://godhand.example",
  output: "static",
  build: { format: "directory" },
});
