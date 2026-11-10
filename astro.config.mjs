import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://missangel.duckdns.org",
  output: "static",
  build: { format: "directory" },
});
