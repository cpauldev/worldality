/**
 * Vue composable for ICU MessageFormat examples
 *
 * Provides state and handlers for all ICU examples:
 * - Plural count
 * - Gender selection
 * - Score input
 * - Combined (username + notifications)
 */
import { ref } from "vue";

import {
  BASIC_INITIAL_STATE,
  Currency,
  DatePreset,
  ICU_INITIAL_STATE,
  TimePreset,
} from "../constants";
import {
  createGenderHandlers,
  createNotificationHandlers,
  createOrdinalHandlers,
  createPluralHandlers,
  createScoreHandlers,
  createUserNameHandler,
} from "../icu-handlers";

export function useICUExamples() {
  const basicName = ref(BASIC_INITIAL_STATE.name);
  const pluralCount = ref(ICU_INITIAL_STATE.pluralCount);
  const gender = ref<"male" | "female" | "other">(ICU_INITIAL_STATE.gender);
  const score = ref(ICU_INITIAL_STATE.score);
  const userName = ref(ICU_INITIAL_STATE.userName);
  const notificationCount = ref(ICU_INITIAL_STATE.notificationCount);
  const ordinalRank = ref(ICU_INITIAL_STATE.ordinalRank);
  const price = ref(ICU_INITIAL_STATE.price);
  const discountRate = ref(ICU_INITIAL_STATE.discountRate);
  const markupName = ref(ICU_INITIAL_STATE.markupName);
  const currency = ref<Currency>(ICU_INITIAL_STATE.currency);
  const datePreset = ref<DatePreset>(ICU_INITIAL_STATE.datePreset);
  const timePreset = ref<TimePreset>(ICU_INITIAL_STATE.timePreset);

  const setPluralCount = (value: number | ((prev: number) => number)) => {
    pluralCount.value =
      typeof value === "function" ? value(pluralCount.value) : value;
  };

  const setGender = (
    value:
      | "male"
      | "female"
      | "other"
      | ((prev: "male" | "female" | "other") => "male" | "female" | "other"),
  ) => {
    gender.value = typeof value === "function" ? value(gender.value) : value;
  };

  const setScore = (value: number | ((prev: number) => number)) => {
    score.value = typeof value === "function" ? value(score.value) : value;
  };

  const setUserName = (value: string | ((prev: string) => string)) => {
    userName.value =
      typeof value === "function" ? value(userName.value) : value;
  };

  const setNotificationCount = (value: number | ((prev: number) => number)) => {
    notificationCount.value =
      typeof value === "function" ? value(notificationCount.value) : value;
  };

  const setOrdinalRank = (value: number | ((prev: number) => number)) => {
    ordinalRank.value =
      typeof value === "function" ? value(ordinalRank.value) : value;
  };

  const setPrice = (value: number | ((prev: number) => number)) => {
    price.value = typeof value === "function" ? value(price.value) : value;
  };

  const setDiscountRate = (value: number | ((prev: number) => number)) => {
    discountRate.value =
      typeof value === "function" ? value(discountRate.value) : value;
  };

  const pluralHandlers = createPluralHandlers(
    pluralCount.value,
    setPluralCount,
  );
  const genderHandlers = createGenderHandlers(setGender);
  const scoreHandlers = createScoreHandlers(setScore);
  const userNameHandler = createUserNameHandler(setUserName);
  const notificationHandlers = createNotificationHandlers(
    notificationCount.value,
    setNotificationCount,
  );
  const ordinalHandlers = createOrdinalHandlers(
    ordinalRank.value,
    setOrdinalRank,
  );
  const priceHandlers = createScoreHandlers(setPrice);
  const discountHandlers = createScoreHandlers(setDiscountRate);

  return {
    // State
    basicName,
    pluralCount,
    gender,
    score,
    userName,
    notificationCount,
    ordinalRank,
    price,
    discountRate,
    markupName,
    currency,
    datePreset,
    timePreset,
    // Handlers
    pluralHandlers,
    genderHandlers,
    scoreHandlers,
    userNameHandler,
    notificationHandlers,
    ordinalHandlers,
    priceHandlers,
    discountHandlers,
  };
}
