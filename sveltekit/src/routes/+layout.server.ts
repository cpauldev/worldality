import {
  configureServerRuntime,
  generateWorldalityScript,
  loadSSRTranslations,
} from "worldality/server/sveltekit";

configureServerRuntime({ manifestDir: "static" });

export async function load({ request, url }: { request: Request; url: URL }) {
  const worldalityData = await loadSSRTranslations({ request, url });

  return {
    worldalityData,
    worldalityScript: generateWorldalityScript(worldalityData),
  };
}
