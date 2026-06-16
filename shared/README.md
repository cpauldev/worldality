# Example Shared Package

Single shared package used by all framework examples.

Package name: `example-shared`
Location: `examples/shared`

## Structure

- `src/logic` - shared runtime utilities, theme helpers, Studio status helpers, and framework widget/theme adapters
- `src/ui` - shared UI variants and DOM helpers (button, card, frame, tabs, badge, etc.)
- `src/styles` - shared Tailwind, base, layout, and typography styles

## Common imports

```ts
import { buttonVariants, cn } from "example-shared/ui";
import { WORLDALITY_CONFIG } from "example-shared/constants";
```

```css
@import "example-shared/tailwind.css";
```

## Notes

- This replaces the previous split packages: `shared-logic`, `shared-variants`, and `example-ui`.
- All framework examples should depend only on `example-shared`.
