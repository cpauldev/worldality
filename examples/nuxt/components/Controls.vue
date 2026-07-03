<script setup lang="ts">
import { computed } from "vue";

import { buttonVariants, cn } from "example-shared/ui";
import { useTheme } from "example-shared/vue/useTheme";
import { Moon, Sun } from "lucide-vue-next";
import {
  getAvailableLocales,
  getLocalizedUrl,
  setLocale,
  t,
  useCurrentLocale,
} from "worldality/vue";

const { theme, toggle } = useTheme();
const locale = useCurrentLocale();
const route = useRoute();
const availableLocales = computed(() => {
  locale.value.code;
  return getAvailableLocales();
});
const isAboutPage = computed(() => /(?:^|\/)about\/?$/.test(route.path));
const homeHref = computed(() => {
  locale.value.code;
  return getLocalizedUrl("index");
});
const aboutHref = computed(() => {
  locale.value.code;
  return getLocalizedUrl("about");
});
</script>

<template>
  <div class="flex flex-wrap items-center justify-center gap-3">
    <nav
      class="flex items-center gap-1 rounded-xl border border-border bg-background p-1"
    >
      <NuxtLink
        :to="homeHref"
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
        <span>{{ t("Home") }}</span>
      </NuxtLink>
      <NuxtLink
        :to="aboutHref"
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
        <span>{{ t("About") }}</span>
      </NuxtLink>
    </nav>
    <div class="rounded-xl border border-border bg-background p-1">
      <button
        :class="cn(buttonVariants({ variant: 'ghost' }), 'gap-2 px-3')"
        :aria-label="t('Toggle theme')"
        @click="toggle"
      >
        <Moon v-if="theme === 'light'" class="size-4" aria-hidden="true" />
        <Sun v-else class="size-4" aria-hidden="true" />
        <span>{{ t("Toggle theme") }}</span>
      </button>
    </div>
    <div
      class="flex flex-wrap items-center justify-center gap-1 rounded-xl border border-border bg-background p-1"
      :aria-label="t('Change language')"
    >
      <button
        v-for="availableLocale in availableLocales"
        :key="availableLocale.code"
        type="button"
        :class="
          cn(
            buttonVariants({
              variant:
                availableLocale.code === locale.code ? 'secondary' : 'ghost',
            }),
            'gap-2 px-3',
          )
        "
        :aria-pressed="availableLocale.code === locale.code"
        @click="setLocale(availableLocale)"
      >
        <bdi :lang="availableLocale.code">{{ availableLocale.nativeName }}</bdi>
      </button>
    </div>
  </div>
</template>
