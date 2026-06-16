/**
 * Svelte utilities for ICU MessageFormat examples
 *
 * Provides state and handlers for all ICU examples using Svelte 5 runes:
 * - Plural count
 * - Gender selection
 * - Score input
 * - Combined (username + notifications)
 */
import {
  BASIC_INITIAL_STATE,
  Currency,
  DatePreset,
  ICU_INITIAL_STATE,
  TimePreset,
} from "../constants";

export function createICUExamples() {
  let basicName = $state(BASIC_INITIAL_STATE.name);
  let pluralCount = $state(ICU_INITIAL_STATE.pluralCount);
  let gender = $state<"male" | "female" | "other">(ICU_INITIAL_STATE.gender);
  let score = $state(ICU_INITIAL_STATE.score);
  let userName = $state(ICU_INITIAL_STATE.userName);
  let notificationCount = $state(ICU_INITIAL_STATE.notificationCount);
  let ordinalRank = $state(ICU_INITIAL_STATE.ordinalRank);
  let price = $state(ICU_INITIAL_STATE.price);
  let discountRate = $state(ICU_INITIAL_STATE.discountRate);
  let markupName = $state(ICU_INITIAL_STATE.markupName);
  let currency = $state<Currency>(ICU_INITIAL_STATE.currency);
  let datePreset = $state<DatePreset>(ICU_INITIAL_STATE.datePreset);
  let timePreset = $state<TimePreset>(ICU_INITIAL_STATE.timePreset);

  return {
    // Basic getters/setters
    get basicName() {
      return basicName;
    },
    set basicName(v: string) {
      basicName = v;
    },
    // ICU getters/setters
    get pluralCount() {
      return pluralCount;
    },
    get gender() {
      return gender;
    },
    get score() {
      return score;
    },
    get userName() {
      return userName;
    },
    get notificationCount() {
      return notificationCount;
    },
    get ordinalRank() {
      return ordinalRank;
    },
    get price() {
      return price;
    },
    set price(v: number) {
      price = v;
    },
    get discountRate() {
      return discountRate;
    },
    set discountRate(v: number) {
      discountRate = v;
    },
    get markupName() {
      return markupName;
    },
    set markupName(v: string) {
      markupName = v;
    },
    get currency() {
      return currency;
    },
    set currency(v: Currency) {
      currency = v;
    },
    get datePreset() {
      return datePreset;
    },
    set datePreset(v: DatePreset) {
      datePreset = v;
    },
    get timePreset() {
      return timePreset;
    },
    set timePreset(v: TimePreset) {
      timePreset = v;
    },

    // ICU handlers
    pluralHandlers: {
      increment: () => {
        pluralCount++;
      },
      decrement: () => {
        pluralCount = Math.max(0, pluralCount - 1);
      },
      reset: () => {
        pluralCount = 0;
      },
    },

    genderHandlers: {
      setMale: () => {
        gender = "male";
      },
      setFemale: () => {
        gender = "female";
      },
      setOther: () => {
        gender = "other";
      },
    },

    scoreHandlers: {
      updateFromInput: (value: string | number) => {
        score = Number(value);
      },
    },

    userNameHandler: {
      update: (value: string) => {
        userName = value;
      },
    },

    notificationHandlers: {
      increment: () => {
        notificationCount++;
      },
      decrement: () => {
        notificationCount = Math.max(0, notificationCount - 1);
      },
    },

    ordinalHandlers: {
      increment: () => {
        ordinalRank++;
      },
      decrement: () => {
        ordinalRank = Math.max(1, ordinalRank - 1);
      },
    },

    priceHandlers: {
      updateFromInput: (value: string | number) => {
        price = Number(value);
      },
    },

    discountHandlers: {
      updateFromInput: (value: string | number) => {
        discountRate = Number(value);
      },
    },
  };
}
