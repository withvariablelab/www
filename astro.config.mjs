import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://lab.variable.land",
  output: "static",
  // Pages build to /<page>.html and are served at /<page>, with no trailing slash.
  // wrangler.jsonc's html_handling ("drop-trailing-slash") redirects /<page>/ and /<page>.html there.
  // The stylesheets are small: inlined, they cost no request before a page can paint.
  build: { format: "file", inlineStylesheets: "always" },
  trailingSlash: "never",
});
