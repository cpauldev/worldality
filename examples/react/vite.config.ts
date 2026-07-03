import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

import { worldalityStudio } from "worldality/studio";

export default defineConfig({
  plugins: [worldalityStudio().vite(), react()],
});

