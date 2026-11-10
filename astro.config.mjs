import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://missangel-site.pages.dev",
  output: "static",
  build: { format: "directory" },
});
