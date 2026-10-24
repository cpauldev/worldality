import { defineConfig } from "vite";

import adapter from "@sveltejs/adapter-auto";
import { sveltekit } from "@sveltejs/kit/vite";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { worldalityStudio } from "worldality/studio";

export default defineConfig({
  plugins: [
    worldalityStudio().vite(),
    sveltekit({ adapter: adapter(), preprocess: vitePreprocess() }),
  ],
});
