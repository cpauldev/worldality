import { detectRelativeTimeUnit } from "example-shared/format-handlers";
import IntlMessageFormat from "intl-messageformat";
import { hash } from "worldality/server";

import {
  DATE_TIME_PROFILES,
  DISPLAY_NAME_TYPES,
  LIST_TYPES,
  NUMBER_PROFILES,
} from "./page-state";

type MetaTranslator = {
  meta: (
    selector: string,
    fallbackText: string,
    params?: Record<string, unknown>,
  ) => string;
};

const DATE_TIME_FORMATS = {
  short: {
    year: "numeric",
    month: "short",
    day: "numeric",
  },
  medium: {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  },
  long: {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  },
  full: {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    timeZoneName: "short",
  },
} as const satisfies Record<
  (typeof DATE_TIME_PROFILES)[number],
  Intl.DateTimeFormatOptions
>;

function interpolate(
  message: string,
  params?: Record<string, unknown>,
): string {
  if (!params) return message;

  return Object.entries(params).reduce(
    (result, [key, value]) =>
      result.replace(new RegExp(`\\{${key}\\}`, "g"), String(value)),
    message,
  );
}

function formatMessageOutput(
  value: ReturnType<IntlMessageFormat["format"]>,
): string {
  return Array.isArray(value) ? value.map(String).join("") : String(value);
}

function getNumberOptions(
  profile: (typeof NUMBER_PROFILES)[number],
): Intl.NumberFormatOptions {
  if (profile === "currency") return { style: "currency", currency: "USD" };
  if (profile === "percent") return { style: "percent" };
  return { style: "decimal" };
}

export function createAstroServerHelpers(options: {
  defaultLocale: string;
  locale: string;
  metaTranslator: MetaTranslator;
  translationCache: Record<string, string | null>;
}) {
  const { defaultLocale, locale, metaTranslator, translationCache } = options;

  function resolveMessage(source: string): string {
    const translated = translationCache[hash(source.trim())];
    return typeof translated === "string" ? translated : source;
  }

  function translateText(
    source: string,
    params?: Record<string, unknown>,
  ): string {
    return interpolate(resolveMessage(source), params);
  }

  function translateMarkup(
    source: string,
    params?: Record<string, unknown>,
  ): string {
    return interpolate(resolveMessage(source), params);
  }

  function formatIcu(source: string, params?: Record<string, unknown>): string {
    return formatMessageOutput(
      new IntlMessageFormat(resolveMessage(source), locale).format(params),
    );
  }

  function rawTemplate(source: string): string {
    return resolveMessage(source);
  }

  function hasTranslation(source: string): boolean {
    if (locale === defaultLocale) return false;
    return typeof translationCache[hash(source.trim())] === "string";
  }

  function formatNumber(
    value: number,
    options: Intl.NumberFormatOptions,
  ): string {
    return new Intl.NumberFormat(locale, options).format(value);
  }

  function formatNumberForProfile(
    value: number,
    profile: (typeof NUMBER_PROFILES)[number],
  ): string {
    return formatNumber(value, getNumberOptions(profile));
  }

  function formatDateTime(
    value: Date,
    profile: (typeof DATE_TIME_PROFILES)[number],
  ): string {
    return new Intl.DateTimeFormat(locale, DATE_TIME_FORMATS[profile]).format(
      value,
    );
  }

  function formatDateTimeRange(
    start: Date,
    end: Date,
    profile: (typeof DATE_TIME_PROFILES)[number],
  ): string {
    const formatter = new Intl.DateTimeFormat(
      locale,
      DATE_TIME_FORMATS[profile],
    );
    if (
      "formatRange" in formatter &&
      typeof formatter.formatRange === "function"
    ) {
      return formatter.formatRange(start, end);
    }
    return `${formatter.format(start)} – ${formatter.format(end)}`;
  }

  function formatRelativeTime(seconds: number): string {
    const unit = detectRelativeTimeUnit(seconds);
    const abs = Math.abs(seconds);
    const divisor =
      unit === "second"
        ? 1
        : unit === "minute"
          ? 60
          : unit === "hour"
            ? 60 * 60
            : unit === "day"
              ? 24 * 60 * 60
              : unit === "week"
                ? 7 * 24 * 60 * 60
                : unit === "month"
                  ? 30 * 24 * 60 * 60
                  : 365 * 24 * 60 * 60;

    const value = Math.round(abs / divisor) * Math.sign(seconds || 1);
    return new Intl.RelativeTimeFormat(locale).format(value, unit);
  }

  function formatList(
    items: readonly string[],
    type: (typeof LIST_TYPES)[number],
  ): string {
    return new Intl.ListFormat(locale, { type }).format(items);
  }

  function formatDisplayName(
    code: string,
    type: (typeof DISPLAY_NAME_TYPES)[number],
  ): string {
    try {
      return new Intl.DisplayNames(locale, { type }).of(code) ?? code;
    } catch {
      return code;
    }
  }

  function tGenderLabel(value: "male" | "female" | "other"): string {
    return translateText(
      value === "male" ? "Male" : value === "female" ? "Female" : "Other",
    );
  }

  function tDatePresetLabel(value: "past" | "today" | "future"): string {
    return translateText(
      value === "past" ? "Past" : value === "today" ? "Today" : "Future",
    );
  }

  function tTimePresetLabel(value: "morning" | "noon" | "evening"): string {
    return translateText(
      value === "morning" ? "Morning" : value === "noon" ? "Noon" : "Evening",
    );
  }

  function tNumberProfileLabel(
    value: (typeof NUMBER_PROFILES)[number],
  ): string {
    return translateText(
      value === "currency"
        ? "Currency"
        : value === "percent"
          ? "Percent"
          : "Decimal",
    );
  }

  function tDateTimeProfileLabel(
    value: (typeof DATE_TIME_PROFILES)[number],
  ): string {
    return translateText(value[0].toUpperCase() + value.slice(1));
  }

  function tListTypeLabel(value: (typeof LIST_TYPES)[number]): string {
    return translateText(
      value === "conjunction"
        ? "Conjunction"
        : value === "disjunction"
          ? "Disjunction"
          : "Unit",
    );
  }

  function tDisplayNamesTypeLabel(
    value: (typeof DISPLAY_NAME_TYPES)[number],
  ): string {
    return translateText(
      value === "language"
        ? "Language"
        : value === "region"
          ? "Region"
          : value === "script"
            ? "Script"
            : "Currency",
    );
  }

  return {
    formatDateTime,
    formatDateTimeRange,
    formatDisplayName,
    formatIcu,
    formatList,
    formatNumber,
    formatNumberForProfile,
    formatRelativeTime,
    hasTranslation,
    keywords: (fallback: string) => metaTranslator.meta("keywords", fallback),
    rawTemplate,
    resolveMessage,
    title: (fallback: string, params?: Record<string, unknown>) =>
      metaTranslator.meta("title", fallback, params),
    translateMarkup,
    translateText,
    description: (fallback: string) =>
      metaTranslator.meta("description", fallback),
    tDatePresetLabel,
    tDateTimeProfileLabel,
    tDisplayNamesTypeLabel,
    tGenderLabel,
    tListTypeLabel,
    tNumberProfileLabel,
    tTimePresetLabel,
  };
}

export type AstroServerHelpers = ReturnType<typeof createAstroServerHelpers>;
