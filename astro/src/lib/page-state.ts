import {
  BASIC_INITIAL_STATE,
  CURRENCY_OPTIONS,
  type Currency,
  DATE_PRESETS,
  DISPLAY_NAMES_DEFAULTS,
  type DatePreset,
  FORMAT_INITIAL_STATE,
  ICU_INITIAL_STATE,
  TIME_PRESETS,
  type TimePreset,
} from "example-shared/constants";

export const ASTRO_FRAMEWORK = {
  id: "astro",
  label: "Astro",
  metaDescription:
    "Interactive examples of Worldality internationalization with Astro",
  metaKeywords: "worldality, i18n, astro, translation, internationalization",
  pillBackground: "#a855f7",
  pillForeground: "#ffffff",
  titleSuffix: "Astro Example",
} as const;

export interface AstroExampleState {
  theme: "light" | "dark";
  basicName: string;
  markupName: string;
  pluralCount: number;
  gender: "male" | "female" | "other";
  score: number;
  userName: string;
  notificationCount: number;
  ordinalRank: number;
  price: number;
  discountRate: number;
  currency: Currency;
  datePreset: DatePreset;
  timePreset: TimePreset;
  numberValue: number;
  numberProfile: "currency" | "percent" | "decimal";
  dateTimeProfile: "short" | "medium" | "long" | "full";
  dateTimeRangeProfile: "short" | "medium" | "long" | "full";
  relativeTimeSeconds: number;
  listType: "conjunction" | "disjunction" | "unit";
  displayNamesType: "language" | "region" | "script" | "currency";
  displayNamesCode: string;
}

export const GENDER_OPTIONS = ["male", "female", "other"] as const;
export const NUMBER_PROFILES = ["currency", "percent", "decimal"] as const;
export const DATE_TIME_PROFILES = ["short", "medium", "long", "full"] as const;
export const LIST_TYPES = ["conjunction", "disjunction", "unit"] as const;
export const DISPLAY_NAME_TYPES = [
  "language",
  "region",
  "script",
  "currency",
] as const;
export const RELATIVE_TIME_DELTAS = [
  -86400, -3600, -30, 30, 3600, 86400,
] as const;

export const ASTRO_IDS = {
  root: "astro-example-root",
  themeToggle: "astro-theme-toggle",
  themeIcon: "astro-theme-icon",
  localeButton: "astro-locale-button",
  studioSpinner: "astro-studio-spinner",
  studioStatus: "astro-studio-status",
  studioStatusLabel: "astro-studio-status-label",
  studioUrl: "astro-studio-url",
  studioUrlSeparator: "astro-studio-url-separator",
  basicName: "astro-basic-name-input",
  markupName: "astro-markup-name-input",
  score: "astro-score-input",
  price: "astro-price-input",
  discount: "astro-discount-input",
  userName: "astro-user-name-input",
  displayNamesCode: "astro-display-names-code-input",
  displayNamesLabel: "astro-display-names-label",
  pluralCount: "astro-plural-count",
  ordinalRank: "astro-ordinal-rank",
  notificationCount: "astro-notification-count",
  numberValue: "astro-number-value",
  relativeUnit: "astro-relative-unit",
  relativeOffset: "astro-relative-offset",
} as const;

export function createInitialState(): AstroExampleState {
  return {
    theme: "light",
    basicName: BASIC_INITIAL_STATE.name,
    markupName: ICU_INITIAL_STATE.markupName,
    pluralCount: ICU_INITIAL_STATE.pluralCount,
    gender: ICU_INITIAL_STATE.gender,
    score: ICU_INITIAL_STATE.score,
    userName: ICU_INITIAL_STATE.userName,
    notificationCount: ICU_INITIAL_STATE.notificationCount,
    ordinalRank: ICU_INITIAL_STATE.ordinalRank,
    price: ICU_INITIAL_STATE.price,
    discountRate: ICU_INITIAL_STATE.discountRate,
    currency: ICU_INITIAL_STATE.currency,
    datePreset: ICU_INITIAL_STATE.datePreset,
    timePreset: ICU_INITIAL_STATE.timePreset,
    numberValue: FORMAT_INITIAL_STATE.numberValue,
    numberProfile: FORMAT_INITIAL_STATE.numberProfile,
    dateTimeProfile: FORMAT_INITIAL_STATE.dateTimeProfile,
    dateTimeRangeProfile: FORMAT_INITIAL_STATE.dateTimeRangeProfile,
    relativeTimeSeconds: FORMAT_INITIAL_STATE.relativeTimeSeconds,
    listType: FORMAT_INITIAL_STATE.listType,
    displayNamesType: FORMAT_INITIAL_STATE.displayNamesType,
    displayNamesCode: FORMAT_INITIAL_STATE.displayNamesCode,
  };
}

export { CURRENCY_OPTIONS, DATE_PRESETS, DISPLAY_NAMES_DEFAULTS, TIME_PRESETS };
