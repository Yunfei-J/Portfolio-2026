import { defineConfig } from "astro/config";

export default defineConfig({
  redirects: {
    "/research/[slug]": "/[slug]",
    "/halfsies": "/",
    "/cruz-roja": "/",
  },
});
