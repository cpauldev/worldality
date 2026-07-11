import {
  configureServerRuntime,
  generateWorldalityScript,
  loadSSRTranslations,
} from "worldality/server/sveltekit";

configureServerRuntime({ manifestDir: "static" });

export async function load({
  cookies,
  request,
  url,
}: {
  cookies: { get(name: string): string | undefined };
  request: Request;
  url: URL;
}) {
  const worldalityData = await loadSSRTranslations({ request, url });
  const theme: "light" | "dark" =
    cookies.get("theme") === "dark" ? "dark" : "light";

  return {
    theme,
    worldalityData,
    worldalityScript: generateWorldalityScript(worldalityData),
  };
}
