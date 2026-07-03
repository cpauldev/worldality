import { defineConfig } from "astro/config";

import node from "@astrojs/node";
import { worldalityStudio } from "worldality/studio";

export default defineConfig({
  adapter: node({
    mode: "standalone",
  }),
  integrations: [worldalityStudio().astro()],
  output: "server",
});
