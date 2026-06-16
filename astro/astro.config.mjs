import node from "@astrojs/node";
import { defineConfig } from "astro/config";
import { worldalityStudio } from "worldality/studio";

export default defineConfig({
  adapter: node({
    mode: "standalone",
  }),
  integrations: [worldalityStudio().astro()],
  output: "server",
  vite: {
    optimizeDeps: {
      include: ["shiki"],
    },
    ssr: {
      noExternal: ["shiki"],
    },
  },
});
