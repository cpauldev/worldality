import { defineConfig } from "vite";

import { worldalityStudio } from "worldality/studio";

export default defineConfig({
  plugins: [worldalityStudio().vite()],
});

