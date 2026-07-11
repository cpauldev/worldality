import {
  generateWorldalityScript,
  loadSSRTranslations,
} from "worldality/server/react-router";

export async function loader({ request }: { request: Request }) {
  const worldalityData = await loadSSRTranslations(request);
  const theme =
    /(?:^|;\s*)theme=(dark|light)(?:;|$)/.exec(
      request.headers.get("Cookie") ?? "",
    )?.[1] ?? "light";

  return {
    theme,
    worldalityData,
    worldalityScript: generateWorldalityScript(worldalityData),
  };
}
