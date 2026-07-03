import { defineConfig } from "vite";

import { sveltekit } from "@sveltejs/kit/vite";
import { worldalityStudio } from "worldality/studio";

export default defineConfig({
  plugins: [worldalityStudio().vite(), sveltekit()],
});

