# Example Shared Package

Single shared package used by all framework examples.

Package name: `example-shared`
Location: `examples/shared`

## Structure

- `src/logic` - runtime/example logic utilities and framework hooks
- `src/ui` - shared UI primitives (button, card, frame, tabs, badge, etc.)
- `src/styles` - shared base/layout typography styles

## Common imports

```ts
import { ICU_MESSAGES } from "example-shared/constants";
import { buttonVariants, cn } from "example-shared/ui";
```

```css
@import "example-shared/tailwind.css";
```

## Notes

- This replaces the previous split packages: `shared-logic`, `shared-variants`, and `example-ui`.
- All framework examples should depend only on `example-shared`.
