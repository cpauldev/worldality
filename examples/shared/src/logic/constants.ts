/**
 * Shared constants for Worldality examples
 *
 * This module contains all configuration, initial states, and translation strings
 * used across all framework examples. This ensures consistency and reduces duplication.
 */

export const THEME_STORAGE_KEY = "theme";
export const DEFAULT_THEME = "light" as const;

export type Theme = "light" | "dark";

/**
 * Worldality widget configuration
 * Used consistently across all examples
 */
export const WORLDALITY_CONFIG = {
  position: "bottom-center" as const,
  showSettings: true,
};

/**
 * Initial state values for ICU MessageFormat examples
 * Consistent across all framework examples
 */
export const CURRENCY_OPTIONS = ["USD", "EUR", "GBP", "JPY"] as const;
export type Currency = (typeof CURRENCY_OPTIONS)[number];

export const DATE_PRESETS = ["past", "today", "future"] as const;
export type DatePreset = (typeof DATE_PRESETS)[number];

export const TIME_PRESETS = ["morning", "noon", "evening"] as const;
export type TimePreset = (typeof TIME_PRESETS)[number];

export function getDateFromPreset(preset: DatePreset): Date {
  const d = new Date();
  if (preset === "past") d.setDate(d.getDate() - 30);
  else if (preset === "future") d.setDate(d.getDate() + 30);
  return d;
}

export function getTimeFromPreset(preset: TimePreset): Date {
  const d = new Date();
  if (preset === "morning") d.setHours(9, 0, 0, 0);
  else if (preset === "noon") d.setHours(12, 0, 0, 0);
  else d.setHours(18, 0, 0, 0);
  return d;
}

export const ICU_INITIAL_STATE = {
  pluralCount: 0,
  gender: "female" as "male" | "female" | "other",
  score: 9876.5,
  userName: "Alice",
  notificationCount: 3,
  ordinalRank: 1,
  price: 1234.56,
  discountRate: 0.15,
  markupName: "Alice",
  currency: "USD" as Currency,
  datePreset: "today" as DatePreset,
  timePreset: "morning" as TimePreset,
};

/**
 * Basic (non-ICU) translation strings used in examples
 */
export const BASIC_MESSAGES = {
  static: "Hello, World!",
  interpolation: "Welcome back, {name}!",
} as const;

export const BASIC_INITIAL_STATE = {
  name: "Alice",
} as const;

/**
 * ICU MessageFormat strings used in examples
 * These demonstrate various ICU features:
 * - Plural forms (zero, one, other)
 * - Select (gender-based selection)
 * - Selectordinal (ordinal number selection)
 * - Number formatting (bare, currency, percent)
 * - Date and time formatting
 * - Combined plural + interpolation
 */
export const ICU_MESSAGES = {
  plural: "{count, plural, =0 {No items} one {# item} other {# items}}",
  select:
    "{gender, select, male {He} female {She} other {They}} liked your post",
  selectordinal:
    "You ranked {rank, selectordinal, one {#st} two {#nd} few {#rd} other {#th}}",
  number: "Score: {score, number}",
  currency: "Price: {price, number, :: currency/USD}",
  percent: "Discount: {discount, number, percent}",
  date: "Today is {date, date, medium}",
  time: "Meeting at {time, time, short}",
  combined:
    "{user} has {count, plural, one {# notification} other {# notifications}}",
} as const;

/**
 * Slider configuration for number input
 */
export const SCORE_CONFIG = {
  min: 0,
  max: 100000,
  step: 100,
} as const;

/**
 * Initial state values for Format API examples
 */
export const FORMAT_INITIAL_STATE = {
  numberValue: 1234.56,
  numberProfile: "currency" as "currency" | "percent" | "decimal",
  dateTimeProfile: "medium" as "short" | "medium" | "long" | "full",
  dateTimeRangeProfile: "medium" as "short" | "medium" | "long" | "full",
  relativeTimeSeconds: -90,
  listType: "conjunction" as "conjunction" | "disjunction" | "unit",
  displayNamesType: "language" as "language" | "region" | "script" | "currency",
  displayNamesCode: "en",
};

/**
 * Default code per displayNames type
 */
export const DISPLAY_NAMES_DEFAULTS: Record<string, string> = {
  language: "en",
  region: "US",
  script: "Latn",
  currency: "USD",
};

/**
 * Fixed items for list format example
 */
export const FORMAT_LIST_ITEMS = [
  "Apples",
  "Bananas",
  "Cherries",
  "Dates",
  "Figs",
] as const;
