import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { worldalityStudio } from "worldality/studio";

export default defineConfig({
  plugins: [worldalityStudio().vite(), react()],
});

