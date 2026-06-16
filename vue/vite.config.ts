import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { worldalityStudio } from "worldality/studio";

export default defineConfig({
  plugins: [worldalityStudio().vite(), vue()],
});

