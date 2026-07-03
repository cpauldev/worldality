/**
 * Format API example handlers
 *
 * Reusable logic for Format API example interactions.
 * Uses simple getter/setter interfaces compatible with all frameworks.
 */

/**
 * Detect the auto-selected unit for relativeTime formatting
 * Mirrors the logic in the Worldality formatter
 */
export function detectRelativeTimeUnit(
  seconds: number,
): Intl.RelativeTimeFormatUnit {
  const abs = Math.abs(seconds);
  if (abs < 60) return "second";
  if (abs < 3600) return "minute";
  if (abs < 86400) return "hour";
  if (abs < 604800) return "day";
  if (abs < 2592000) return "week";
  if (abs < 31536000) return "month";
  return "year";
}

/**
 * Create handlers for relative time seconds adjustment
 */
export function createRelativeTimeHandlers(
  getSeconds: () => number,
  setSeconds: (value: number) => void,
) {
  return {
    adjustBy: (delta: number) => setSeconds(getSeconds() + delta),
  };
}

/**
 * Create handlers for displayNames type + code
 * Resets code to the type's default when type changes
 */
export function createDisplayNamesHandlers(
  setType: (type: "language" | "region" | "script" | "currency") => void,
  setCode: (code: string) => void,
  defaults: Record<string, string>,
) {
  return {
    setLanguage: () => {
      setType("language");
      setCode(defaults["language"] ?? "en");
    },
    setRegion: () => {
      setType("region");
      setCode(defaults["region"] ?? "US");
    },
    setScript: () => {
      setType("script");
      setCode(defaults["script"] ?? "Latn");
    },
    setCurrency: () => {
      setType("currency");
      setCode(defaults["currency"] ?? "USD");
    },
    updateCode: (code: string) => setCode(code),
  };
}
