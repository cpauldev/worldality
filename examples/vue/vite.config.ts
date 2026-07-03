import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vite";

import { worldalityStudio } from "worldality/studio";

export default defineConfig({
  plugins: [worldalityStudio().vite(), vue()],
});

