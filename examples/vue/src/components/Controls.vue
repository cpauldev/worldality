<script setup lang="ts">
import { computed } from "vue";

import { Moon, Sun } from "@lucide/vue";
import { buttonVariants, cn } from "example-shared/ui";
import {
  getAvailableLocales,
  setLocale,
  t,
  useCurrentLocale,
  useCurrentPage,
} from "worldality/vue";

import { useTheme } from "../composables/useTheme";

const { theme, toggleTheme } = useTheme();
const locale = useCurrentLocale();
const currentPage = useCurrentPage();
const localeCode = computed(() => locale.value.code);
const availableLocales = computed(() => {
  locale.value.code;
  return getAvailableLocales();
});
const isAboutPage = computed(() => currentPage.value === "about");
</script>

<template>
  <div class="flex flex-wrap items-center justify-center gap-3">
    <nav
      class="flex items-center gap-1 rounded-xl border border-border bg-background p-1"
    >
      <a
        href="/"
        :class="
          cn(
            buttonVariants({
              variant: isAboutPage ? 'ghost' : 'secondary',
            }),
            'gap-2 px-3',
          )
        "
        :aria-current="isAboutPage ? undefined : 'page'"
      >
        <span>{{ (localeCode, t("Home")) }}</span>
      </a>
      <a
        href="/about"
        :class="
          cn(
            buttonVariants({
              variant: isAboutPage ? 'secondary' : 'ghost',
            }),
            'gap-2 px-3',
          )
        "
        :aria-current="isAboutPage ? 'page' : undefined"
      >
        <span>{{ (localeCode, t("About")) }}</span>
      </a>
    </nav>
    <div class="rounded-xl border border-border bg-background p-1">
      <button
        :class="cn(buttonVariants({ variant: 'ghost' }), 'gap-2 px-3')"
        :aria-label="(localeCode, t('Toggle theme'))"
        @click="toggleTheme"
      >
        <Moon v-if="theme === 'light'" class="size-4" aria-hidden="true" />
        <Sun v-else class="size-4" aria-hidden="true" />
        <span>{{ (localeCode, t("Toggle theme")) }}</span>
      </button>
    </div>
    <div
      class="flex flex-wrap items-center justify-center gap-1 rounded-xl border border-border bg-background p-1"
      :aria-label="(localeCode, t('Change language'))"
    >
      <button
        v-for="availableLocale in availableLocales"
        :key="availableLocale.code"
        type="button"
        :class="
          cn(
            buttonVariants({
              variant:
                availableLocale.code === localeCode ? 'secondary' : 'ghost',
            }),
            'gap-2 px-3',
          )
        "
        :aria-pressed="availableLocale.code === localeCode"
        @click="setLocale(availableLocale)"
      >
        <bdi :lang="availableLocale.code">{{ availableLocale.nativeName }}</bdi>
      </button>
    </div>
  </div>
</template>
