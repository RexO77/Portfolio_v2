# Interface Hygiene Checklist

Working checklist from the Web Interface Guidelines audit.

## Global Base

- [x] Apply font smoothing and optimized text rendering.
- [x] Style document selection.
- [x] Prevent unexpected iOS text resizing.
- [x] Disable default iOS tap highlight and provide custom feedback.
- [x] Use shadow-based focus rings so radius is respected.

## Touch And Hover

- [x] Gate hover-only visuals behind hover-capable pointer media queries.
- [x] Keep active/tap feedback available on touch.
- [x] Disable selection on interactive controls where accidental text selection hurts interaction.
- [x] Preserve explicit touch-action rules for custom drag/pan surfaces.

## Motion

- [x] Keep frequent interaction transitions at or below 200ms.
- [x] Preserve reduced-motion fallbacks.
- [x] Avoid persistent `will-change` on long-lived static elements.

## Performance

- [x] Reduce heavy decorative blur values.
- [x] Keep decorative layers pointer-safe.
- [x] Use lazy image/video loading and pause-heavy patterns where relevant.

## Accessibility And Feedback

- [x] Keep icon-only controls labelled.
- [x] Keep copy feedback inline near the trigger.
- [x] Keep skip-link and section scrolling targeted to `.scroll-root`.
- [x] Open the desktop connect dropdown on mouse down for immediate pointer response while preserving keyboard activation.

## Not Applicable In Current App

- [ ] Form labels, input types, required validation, submit disabling, and autocomplete rules are not currently exercised by this portfolio because there are no real user-input forms.
