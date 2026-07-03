import { defineConfig } from "vite";

import { reactRouter } from "@react-router/dev/vite";
import { worldalityStudio } from "worldality/studio";

export default defineConfig({
  plugins: [worldalityStudio().vite(), reactRouter()],
});
