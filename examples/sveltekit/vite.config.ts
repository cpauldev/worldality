import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import { worldalityStudio } from "worldality/studio";

export default defineConfig({
  plugins: [worldalityStudio().vite(), sveltekit()],
});

