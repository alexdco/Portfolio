# Scope: nextgen portfolio

**Workflow:** Alpha (assumed by /architect when this scope was started; change it with /scope)

## At a glance

| Feature | Status | Spec |
|---|---|---|
| Green accent color scheme | in-progress | [0001](../specs/0001-green-accent-color-scheme.md) |

## Features

### Green accent color scheme · in-progress

Keep the gray theme and add an emerald accent to the section headings, the navbar (floating dock), Work Experience, and Certifications.
Done when: all four areas show the brand green in light and dark mode, with AA contrast, and nothing outside them changes.
Spec: [0001](../specs/0001-green-accent-color-scheme.md)
Code: `app/globals.css`, `components/FloatingDockClient.tsx`, `components/sections/`

- [x] Design it (spec)
- [ ] Build it: /develop green accent color scheme
  - [x] Brand tokens in `globals.css` and the green section titles (AC-1, AC-2, AC-7)
  - [x] Work Experience and Certification card accents (AC-5, AC-6, AC-7)
  - [x] Navbar desktop hover and mobile open, tap, and focus states (AC-3, AC-4)
  - [ ] Lint, build, and a light and dark regression pass (AC-7, AC-8)
- [ ] Verify it: /check verify green accent color scheme

## Deferred

- Decide whether to remove or document the unused `siteSettings` color fields (from spec 0001)
- Clean up the duplicated `--chart-*` values in `app/globals.css` (from spec 0001)
