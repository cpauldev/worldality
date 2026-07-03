import { defineConfig } from "vite";
import solid from "vite-plugin-solid";
import { worldalityStudio } from "worldality/studio";

export default defineConfig({
  plugins: [worldalityStudio().vite(), solid()],
});

