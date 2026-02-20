## 2025-05-14 - [Consistent Accessibility for Icon-only Elements]
**Learning:** Icon-only interactive elements (buttons, links) are often missing ARIA labels, making them inaccessible to screen reader users. Additionally, mobile menus without `aria-expanded` and `aria-controls` fail to communicate their state to assistive technologies.
**Action:** Always ensure icon-only buttons have `aria-label`, and mobile menus have `aria-expanded` and `aria-controls` correctly synchronized with their state.

## 2025-05-14 - [Semantic Labels vs ARIA Labels]
**Learning:** While `aria-label` provides accessibility, using a semantic `<label>` element with `htmlFor` is preferred as it follows the HTML standard more closely. For cases where the label should not be visible, the `sr-only` class is an effective way to maintain a clean UI while providing full accessibility.
**Action:** Prefer semantic `<label>` elements over `aria-label` for form inputs when possible, using `sr-only` to hide them visually if necessary.
