---
name: worldality
description: Integrate, replace an existing i18n setup with, repair, or validate Worldality in a custom-built web application. Use when replacing an existing application i18n runtime, including libraries such as react-i18next and next-intl; configuring `.worldality`, locale routing, SSR, or translated metadata; adding translated UI, rich text, or a language switcher; or debugging Worldality across React, Next.js, Vue, Nuxt, Svelte, SvelteKit, Astro, Angular, Solid, React Router, or vanilla JavaScript.
---

# Worldality

Use these references for integration patterns:

- <https://worldality.com/llms.txt>
- <https://worldality.com/docs/get-started/welcome>
- <https://worldality.com/docs/core/cli>
- <https://worldality.com/docs/api/client>
- <https://worldality.com/docs/core/studio>

The installed package is the implementation contract. Before using an API, inspect its `package.json` export map and TypeScript declarations; use the framework guide that matches the project. Documentation is integration guidance and can lag a release.

## Decide the integration boundary

1. Inspect the framework, package manager, router, rendering model, and existing localization configuration before changing files.
2. For a custom-built application, treat Worldality as the complete i18n replacement: it owns translated messages, locale selection, URL routing, SSR state, metadata, and language persistence. Existing i18n libraries are migration sources, not concurrent owners.
3. Inventory the existing system’s locales, fallback rules, route shape, SSR behavior, message format, metadata, and persistence before replacing it.
4. Treat separately managed content, such as a documentation platform with its own locale system, as an external boundary. Do not claim Worldality controls it without a supported integration. Website builders without application source access are out of scope.

## Replace or integrate

1. Run the bootstrap command for the project's package manager (e.g. `npx worldality`, `pnpm dlx worldality`, `bunx worldality`, `yarn dlx worldality`, or `deno run -A npm:worldality`), or install the package and run setup (e.g. `npx worldality setup`). Keep `.worldality/config.json` tracked; preserve it unless the task requires a deliberate change.
2. Migrate in bounded, verifiable surfaces when necessary. During a temporary migration phase, partition ownership clearly: one locale URL owner, one SSR owner, and one head-metadata owner for each rendered surface. Do not mix two i18n runtimes in the same view.
3. Retire the prior application i18n runtime and its routing/configuration after feature parity is verified. Do not claim an automatic importer or migration path unless the installed package provides one.
4. Use the package surface for the detected framework. Keep locale routing and SSR in one authoritative path; do not add duplicate framework routing or client-side timing workarounds.
5. Use `t()` for normal user-visible messages, including ICU interpolation, plurals, and selects. Use `t.rich()` only in React/Next.js for component rendering; use `t.markup()` only for trusted HTML strings. Use the client API reference for less common helpers such as `t.has()` and `t.raw()`.
6. Use the Formats API for locale-aware numbers, dates, ranges, relative time, lists, and display names when formatting happens outside a translated message.
7. Use `t.meta()` only for human-readable document-head values that need translation, such as titles, descriptions, keyword phrases, and social titles. Keep URLs, locale codes, robots directives, and other machine-readable values out of normal translation.
8. Use the built-in widget when it meets the product requirements. Otherwise build a switcher from `getAvailableLocales()`, the framework current-locale API, and `setLocale()`.
9. For Studio installed in the framework integration, start the app and open `http://localhost:<port>/worldality`. For standalone Studio, run the studio command for the project's package manager (e.g. `npx worldality studio`, `pnpm dlx worldality studio`, `bunx worldality studio`, etc.) and use the printed `http://localhost:3456` URL. Use Studio, or the package manager's `sync` or `watch` commands for the translation lifecycle appropriate to the project.

## Verify

1. Run the project’s real lint, typecheck, build, and focused runtime tests.
2. When replacing another i18n runtime, verify every migrated locale’s direct route load, fallback behavior, locale switch, and persisted language behavior before removing the old runtime.
3. When routing or SSR changes, verify direct default and non-default locale loads, locale switching, and the rendered `html lang` and `dir` values.
4. When metadata changes, inspect the rendered head for the active locale and ensure interpolation is already resolved.
5. Preserve unrelated application behavior and report any external-content boundary that cannot be brought under Worldality.

## Constraints

- Do not invent framework APIs, package exports, or undocumented migration support.
- Do not hand-edit `.worldality/locales/*.json`, generated manifests, or runtime bundles under the configured output directory; they are generated and can be overwritten. Change source text or `.worldality/config.json`, then use Studio, `sync`, or `watch`.
- Do not retain two competing i18n, routing, or metadata owners after migration.
- Prefer a package-level or routing-level fix over per-component duplication or delayed client-side patches.
- Keep the change scoped to the requested framework and integration surface.
