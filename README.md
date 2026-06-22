![Worldality banner](assets/worldality-banner.png)

# Worldality

Make your website global with Worldality, an internationalization platform built for developers and enterprise teams that turns digital products into global experiences, reaching audiences in over 120 languages with an experience that feels local.

Worldality is framework-agnostic and made for custom-built websites and apps across React, Next.js, Vue, Nuxt, Svelte, and more. It combines live translation, language-based routing, translated page metadata, a language switcher, text detection, Worldality CLI, and Worldality Studio for browsing strings, translating content, and tracking locale progress.

![Worldality Studio](assets/worldality-studio.png)

### [Learn more at Worldality.com](https://worldality.com/)

This repository is the public home for runnable Worldality examples and support discussions. Each example uses the published [`worldality`](https://www.npmjs.com/package/worldality) package from npm.

## Available Examples

- `examples/react`
- `examples/solid`
- `examples/vue`
- `examples/nextjs`
- `examples/nuxt`
- `examples/astro`
- `examples/sveltekit`
- `examples/react-router`
- `examples/vanilla`

## Preview

![Worldality example](assets/example.png)

## Install

```bash
bun install
```

## Run All Examples

```bash
bun run examples
```

This starts every example on fixed local ports starting at `http://localhost:4600`.
Use `bun run examples --no-open` to start the servers without opening browser tabs.

## Run One Example

```bash
bun run dev:react
bun run dev:nextjs
bun run dev:vue
```

## Build

```bash
bun run build
```

## Get Worldality

Start the guided setup from your app's project root:

```bash
npx worldality
```

If you prefer to install the package first, run setup after installing it:

```bash
npm install worldality
npx worldality setup
```

You can also use your package manager's equivalent install command, such as `bun add worldality`, `pnpm add worldality`, or `yarn add worldality`, then run `npx worldality setup`.

## Issues

Use this repository for public bug reports, example issues, and support questions.
