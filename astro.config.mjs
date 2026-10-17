import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://lab.variable.land",
  output: "static",
  // Pages build to /<page>.html and are served at /<page>, with no trailing slash.
  // wrangler.jsonc's html_handling ("drop-trailing-slash") redirects /<page>/ and /<page>.html there.
  build: { format: "file" },
  trailingSlash: "never",
});
