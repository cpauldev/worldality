const DESCRIPTION_MONO_TOKENS = {
  "Intl.DateTimeFormat.formatRange": "Intl.DateTimeFormat.formatRange",
  "Intl.RelativeTimeFormat": "Intl.RelativeTimeFormat",
  "Intl.DateTimeFormat": "Intl.DateTimeFormat",
  "Intl.NumberFormat": "Intl.NumberFormat",
  "Intl.DisplayNames": "Intl.DisplayNames",
  "Intl.ListFormat": "Intl.ListFormat",
  "t.markup()": "t.markup()",
  "t.rich()": "t.rich()",
  "{param}": "{param}",
  innerHTML: "innerHTML",
  "Open Graph": "Open Graph",
  "CSS selector": "CSS selector",
  "worldality/react": "worldality/react",
  CLDR: "CLDR",
  "BCP 47": "BCP 47",
  ISO: "ISO",
  currency: "currency",
  decimal: "decimal",
  percent: "percent",
  false: "false",
  true: "true",
  "#": "#",
  "=0": "=0",
} as const;

export interface DescriptionPart {
  key: string;
  mono: boolean;
  text: string;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function splitMonospaceTokens(text: string): DescriptionPart[] {
  const tokenKeys = Object.keys(DESCRIPTION_MONO_TOKENS).sort(
    (a, b) => b.length - a.length,
  );
  const pattern = new RegExp(`(${tokenKeys.map(escapeRegExp).join("|")})`, "g");

  return text
    .split(pattern)
    .filter((part) => part.length > 0)
    .map((part, index) => {
      const replacement =
        DESCRIPTION_MONO_TOKENS[part as keyof typeof DESCRIPTION_MONO_TOKENS];

      return {
        key: `${part}-${index}`,
        mono: Boolean(replacement),
        text: replacement ?? part,
      };
    });
}
