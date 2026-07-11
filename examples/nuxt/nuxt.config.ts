import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import tailwindcss from "@tailwindcss/vite";
import { getLocaleRedirectPattern } from "worldality/server/config";
import { worldalityStudio } from "worldality/studio";

const currentDir = dirname(fileURLToPath(import.meta.url));
const localePattern = getLocaleRedirectPattern();

export default defineNuxtConfig({
  modules: ["@nuxtjs/color-mode", worldalityStudio().nuxt()],
  colorMode: {
    classSuffix: "",
  },
  css: ["~/app.css"],
  devtools: {
    enabled: false,
  },
  vite: {
    plugins: [worldalityStudio().vite(), tailwindcss()],
    server: {
      watch: {
        ignored: [
          "**/.worldality/**",
          "**/public/worldality/**",
          "**/public/worldality.manifest.json",
        ],
      },
    },
  },
  hooks: {
    "pages:extend"(pages) {
      // Nuxt still needs a route record, but Worldality owns locale detection
      // and content loading through its manifest and JSON bundles.
      pages.push({
        name: "localized-index",
        path: `/:locale(${localePattern})`,
        file: resolve(currentDir, "pages/index.vue"),
      });
      pages.push({
        name: "localized-about",
        path: `/:locale(${localePattern})/about`,
        file: resolve(currentDir, "pages/about.vue"),
      });
    },
  },
  compatibilityDate: "2026-03-31",
});
