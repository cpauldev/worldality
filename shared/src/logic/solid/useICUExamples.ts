/**
 * Solid primitive for ICU MessageFormat examples
 *
 * Provides signals and handlers for all ICU examples:
 * - Plural count
 * - Gender selection
 * - Score input
 * - Combined (username + notifications)
 */
import { createSignal } from "solid-js";

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
  const [basicName, setBasicName] = createSignal<string>(
    BASIC_INITIAL_STATE.name,
  );
  const [pluralCount, setPluralCount] = createSignal(
    ICU_INITIAL_STATE.pluralCount,
  );
  const [gender, setGender] = createSignal<"male" | "female" | "other">(
    ICU_INITIAL_STATE.gender,
  );
  const [score, setScore] = createSignal(ICU_INITIAL_STATE.score);
  const [userName, setUserName] = createSignal(ICU_INITIAL_STATE.userName);
  const [notificationCount, setNotificationCount] = createSignal(
    ICU_INITIAL_STATE.notificationCount,
  );
  const [ordinalRank, setOrdinalRank] = createSignal(
    ICU_INITIAL_STATE.ordinalRank,
  );
  const [price, setPrice] = createSignal(ICU_INITIAL_STATE.price);
  const [discountRate, setDiscountRate] = createSignal(
    ICU_INITIAL_STATE.discountRate,
  );
  const [markupName, setMarkupName] = createSignal(
    ICU_INITIAL_STATE.markupName,
  );
  const [currency, setCurrency] = createSignal<Currency>(
    ICU_INITIAL_STATE.currency,
  );
  const [datePreset, setDatePreset] = createSignal<DatePreset>(
    ICU_INITIAL_STATE.datePreset,
  );
  const [timePreset, setTimePreset] = createSignal<TimePreset>(
    ICU_INITIAL_STATE.timePreset,
  );

  const pluralHandlers = createPluralHandlers(pluralCount(), setPluralCount);
  const genderHandlers = createGenderHandlers(setGender);
  const scoreHandlers = createScoreHandlers(setScore);
  const userNameHandler = createUserNameHandler(setUserName);
  const notificationHandlers = createNotificationHandlers(
    notificationCount(),
    setNotificationCount,
  );
  const ordinalHandlers = createOrdinalHandlers(ordinalRank(), setOrdinalRank);
  const priceHandlers = createScoreHandlers(setPrice);
  const discountHandlers = createScoreHandlers(setDiscountRate);

  return {
    // Signals
    basicName,
    setBasicName,
    // ICU
    pluralCount,
    gender,
    score,
    userName,
    notificationCount,
    ordinalRank,
    price,
    discountRate,
    markupName,
    setMarkupName,
    currency,
    setCurrency,
    datePreset,
    setDatePreset,
    timePreset,
    setTimePreset,
    setGender,
    setScore,
    setUserName,
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
