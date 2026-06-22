import {
  generateWorldalityScript,
  loadSSRTranslations,
} from "worldality/server/react-router";

export async function loader({ request }: { request: Request }) {
  const worldalityData = await loadSSRTranslations(request);

  return {
    worldalityData,
    worldalityScript: generateWorldalityScript(worldalityData),
  };
}
