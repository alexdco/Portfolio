# 0001. Add an emerald brand accent on top of the gray theme

**Date**: 2026-10-20
**Status**: In Progress

## Summary

The portfolio stays gray, but gets one green accent (emerald) in four places: section headings, the navbar (floating dock), the Work Experience cards, and the Certification cards. The green is defined once, as a new `brand` color token (a named CSS variable) in `app/globals.css`, so the gray shadcn colors that drive buttons and other UI are left alone. Building it means adding two tokens and swapping a known list of class names in five component files; no content, schema, or data changes.

## Context

The site uses the stock shadcn neutral theme: every token in `app/globals.css` (`--primary`, `--accent`, `--muted`, and so on) is a gray with zero chroma (no color). The result is clean but flat, and the page has no visual thread tying the sections together. The goal is to keep that gray base and introduce green in a controlled set of places: section headings, the navbar, Work Experience, and Certifications.

Several forces shape how to do it. `--primary` is used widely by shadcn primitives (buttons, rings, sidebar) and by sections not in scope (Blog and Education title hovers, About), so changing it would spread green far beyond the four named areas. The site has light and dark modes (`ModeToggle`, `.dark` class), so any color needs a value that reads well on both a white and a near black background. The Certification card is special: it is a fixed dark "diploma" surface (`zinc-900` to `zinc-950`) in both modes, trimmed in gold (`yellow-600`), so its accent must read on dark even when the site is in light mode.

There is also a content angle. AGENTS.md says all page content comes from Sanity, and `siteSettings` already has unused `primaryColor`, `secondaryColor`, and `accentColor` fields. Theme color is styling rather than portfolio content, but the existence of those fields means the choice of where the color lives is a real one.

Finally, accessibility: green text on white is a known contrast trap. A mid green (Tailwind emerald 600) gives only about 3.8:1 against white, which passes WCAG AA (the common accessibility contrast bar) for large text but fails it for normal sized text such as the company name on an experience card.

## Requirements

**User stories**:
- As a visitor, I want a consistent green accent across the page so that the portfolio feels designed and the sections read as one whole.
- As the site owner, I want the green defined in one place so that I can retune it later without hunting through components.

**Acceptance criteria**:
- **AC-1**: `app/globals.css` defines a `--brand` token with a light value of emerald 700 and a dark value of emerald 400, plus a `--brand-on-dark` token fixed to emerald 500 in both modes, and both are exposed to Tailwind as `brand` and `brand-on-dark` colors. No existing token (`--primary`, `--accent`, and so on) changes value.
- **AC-2**: The section title `h2` in each of the nine sections (About, Skills, Experience, Projects, Education, Certifications, Achievements, Blog, Contact) renders in the brand green, in both light and dark mode. The Hero `h1`, card titles (`h3`, `h4`), and About's Portable Text subheadings stay their current color.
- **AC-3**: On the desktop dock, item icons stay gray at rest and turn brand green on hover; the hovered item's tooltip label is brand green. The dock's glass container, borders, and shadows are unchanged.
- **AC-4**: On mobile, the round menu button's icon is brand green while the menu is open, and each menu item's icon is brand green on tap (`active`) and on keyboard focus (`focus-visible`).
- **AC-5**: On each Work Experience entry, the timeline line and dot, the company name, and the technology pills are brand green (pills as a light green fill with green text), and the card border turns brand green on hover alongside the existing shadow.
- **AC-6**: On each Certification card, every gold (`yellow-500` / `yellow-600`) element is replaced by `brand-on-dark` at the same opacity: the frame border, corner ornaments, corner diamonds, the "CERTIFICATE" label and "for" text, the skill tags, the divider above the button, and the Verify Credential button. The red "Expired" state and the zinc text are unchanged.
- **AC-7**: Every green used as text meets WCAG AA for its size against its background, in both modes (normal text 4.5:1, large text 3:1).
- **AC-8**: Areas outside the four named ones are unchanged: Blog and Education title hovers, the shadcn buttons, the ContactForm status pill, and the online status dot in `ProfileImage` keep their current colors.

## Options considered

### Option 1: New `brand` CSS token, applied per area

Add `--brand` (light and dark values) and `--brand-on-dark` to `app/globals.css`, map them in the `@theme inline` block, and use `text-brand`, `bg-brand/10`, and so on only in the named areas.

**Pros**:
- One place to tune the green; light and dark handled by the existing `.dark` mechanism.
- Gray `--primary` untouched, so shadcn primitives and out of scope sections do not change.
- Semantic name (`brand`) survives a later color change without renaming classes.

**Cons**:
- One more token pair to know about; a future contributor could still reach for raw `emerald-*` classes.
- Each area still needs its classes edited by hand (five files).

### Option 2: Read `siteSettings.accentColor` from Sanity

Fetch the existing `accentColor` field in the portfolio layout and inject it as a CSS variable on `<html>`.

**Pros**:
- Editable from Studio without a deploy; uses a field that already exists.
- Fits the letter of the "content comes from Sanity" rule.

**Cons**:
- The field is one hex string, so there is no dark mode value and no fixed on dark value for the certificate; contrast cannot be guaranteed for whatever an editor types.
- Adds a fetch and a fallback path to the root layout for something that changes almost never.
- Theme color is presentation, not portfolio content; the rule exists to keep data out of components, not styling.

### Option 3: Remap `--primary` to green

Change the shadcn `--primary` token in both modes.

**Pros**:
- Smallest diff; existing `text-primary` uses (company name, tech pills) turn green for free.

**Cons**:
- Turns every primary button, focus ring, sidebar item, and Blog and Education hover green, breaking the "only these four areas" requirement.
- Section headings and the dock do not use `primary`, so they still need edits anyway.
- `--primary-foreground` would need retuning for every button.

### Option 4: Hardcoded Tailwind emerald classes

Write `text-emerald-700 dark:text-emerald-400` and friends directly in each component.

**Pros**:
- No theme changes at all; obvious at the call site.

**Cons**:
- The light and dark pair is repeated in every place; a retune means editing every file.
- Easy to drift (one place uses 600, another 700) and to miss the contrast rule.

## Decision

**Chosen option**: Option 1: New `brand` CSS token, applied per area

Add `--brand` and `--brand-on-dark` tokens to `app/globals.css`, expose them as Tailwind colors, and apply them only to section headings, the dock, Work Experience, and Certifications.

**Implementation skills**: `shadcn` (`shadcn-ui/ui`, `.agents/skills/shadcn/`)

**Decisions made here** (settled during design, no need to ask again):
- **Light value is emerald 700, not 600.** Emerald 600 is about 3.8:1 on white and fails AA for the company name (normal text); emerald 700 is about 5.5:1 and passes for all sizes. Runner up: emerald 600 for headings only, rejected because two light greens would drift.
- **Dark value is emerald 400** (about 10:1 on the dark background). Runner up: emerald 500, a little dim on near black.
- **Certificates use a separate fixed token, `--brand-on-dark` = emerald 500.** The card is dark in both modes, so a value that flips with the theme would put emerald 700 on near black in light mode. Emerald 500 on `zinc-900` is about 7:1, and `zinc-900` text on an emerald 500 button is also about 7:1. Runner up: reuse emerald 400, rejected because the button then looks washed out.
- **The Sanity `accentColor` field is left untouched** (not wired up, not removed). See Follow-up.

## Rationale

The requirement is narrow on purpose: keep the gray and add green in four named places. That rules out remapping `--primary` (Option 3), which is the one token most shadcn parts and several out of scope sections already consume. Green would leak into buttons and focus rings everywhere. A dedicated token matches how the theme already works: every color is a CSS variable with a `.dark` override, mapped to Tailwind in `@theme inline`. So the new color behaves like the existing ones and needs no new mechanism.

Sanity (Option 2) looks attractive because the field exists, but it cannot express what this design needs: two theme values plus a fixed on dark value with guaranteed contrast. Wiring it would add a root layout fetch for a value that changes maybe once a year. Hardcoded classes (Option 4) work on day one but fail the "tune it in one place" story by day 180.

The contrast forces drive the exact values. Light mode text needs emerald 700 to pass AA on the small company name. The certificate's always dark surface is why there is a second, fixed token instead of trying to make one token work on two opposite backgrounds.

## Feature design

**Data model sketch**: none. No schema, query, or Sanity content changes; `npm run typegen` is not needed.

**Theme tokens** (in `app/globals.css`):

| Token | `:root` (light) | `.dark` | Tailwind color |
|---|---|---|---|
| `--brand` | `oklch(0.508 0.118 165.612)` (emerald 700) | `oklch(0.765 0.177 163.223)` (emerald 400) | `--color-brand: var(--brand)` |
| `--brand-on-dark` | `oklch(0.696 0.17 162.48)` (emerald 500) | same as light | `--color-brand-on-dark: var(--brand-on-dark)` |

Add the two `--color-*` lines inside the existing `@theme inline` block, next to the other color mappings. Opacity modifiers (`bg-brand/10`, `border-brand-on-dark/40`) then work as with any other theme color.

**Class changes per area** (old to new; keep every other class as it is):

| Area | File | Element | Change |
|---|---|---|---|
| Headings | `components/sections/{About,Skills,Experience,Projects,Education,Certifications,Achievements,Blog,Contact}Section.tsx` | the section title `h2` (`text-4xl md:text-5xl font-bold mb-4`) | add `text-brand` |
| Navbar desktop | `components/FloatingDockClient.tsx` | dock item icon wrapper, horizontal branch | replace the `group-hover:!text-neutral-600 dark:group-hover:!text-neutral-200` pair with `group-hover:!text-brand` |
| Navbar desktop | same | the desktop menu toggle icon (`IconX` / `IconMenu2` wrapper) | same hover swap |
| Navbar desktop | same | `Tooltip` label text | `group-hover:text-brand` on the label (keep `text-neutral-800 dark:text-neutral-200` at rest) |
| Navbar mobile | same | round menu button | icon gets `text-brand` while `isOpen` (conditional class), gray otherwise |
| Navbar mobile | same | vertical item icon wrapper | add `group-active:text-brand group-focus-visible:text-brand` |
| Experience | `components/sections/ExperienceSection.tsx` | timeline item `border-muted` | `border-brand/30` |
| Experience | same | timeline dot `bg-primary` | `bg-brand` |
| Experience | same | company name `text-primary` | `text-brand` |
| Experience | same | tech pill `bg-primary/10 text-primary` | `bg-brand/10 text-brand` |
| Experience | same | card `hover:shadow-lg` | add `hover:border-brand/50` (and `transition-colors` with the existing transition, for example `transition-[box-shadow,border-color]`) |
| Certifications | `components/sections/CertificationsSection.tsx` | every `yellow-600/NN` (border, ornaments, diamonds, label, "for", tag fill and border, divider, icon ring) | `brand-on-dark/NN`, same opacity |
| Certifications | same | skill tag text `text-yellow-500` | `text-brand-on-dark` |
| Certifications | same | button `bg-yellow-600/90 hover:bg-yellow-500` | `bg-brand-on-dark/90 hover:bg-brand-on-dark`, keep `text-zinc-900` |

**Value sourcing**:

| Action | Value produced / displayed | Source |
|---|---|---|
| Render any brand green in light mode | the green color | `--brand` in `:root` |
| Render any brand green in dark mode | the green color | `--brand` in `.dark`, selected by the existing `ModeToggle` / `.dark` class |
| Render certificate accents | the green color | `--brand-on-dark` (theme independent) |
| Mobile menu button color | open or closed | the existing `isOpen` state in `FloatingDockClient` |

**Key invariants**:
- No existing theme token changes value; `--primary` and the rest stay gray.
- Components reference `brand` / `brand-on-dark`, never raw `emerald-*` classes, so the token stays the single source.
- Any green used as text meets AA for its size on its actual background.

**Security model**: not applicable (presentation only, no data or auth surface).

**Configuration required**: none.

**Critical test scenarios**:
- Happy path: load the home page in light mode, then dark mode; all nine section titles are green, the Hero name is not, verifies **AC-1**, **AC-2**
- Navbar: hover each desktop dock icon (green icon and tooltip, gray at rest); on a phone width viewport open the menu (green button icon) and tab through items (green on focus), verifies **AC-3**, **AC-4**
- Experience: timeline, dot, company, pills green; hover a card and the border turns green, verifies **AC-5**
- Certificates: no gold left anywhere on the card in either mode; an expired certificate still shows red, verifies **AC-6**
- Contrast: check the company name and a section title in light mode, and the certificate button text, with a contrast checker (browser devtools), verifies **AC-7**
- Regression: Blog and Education title hovers, a shadcn button, and the contact form success pill look unchanged, verifies **AC-8**

## Build plan

No build approach is recorded for this project, so this assumes end to end slices (Tracer Bullet): prove the token works on one visible element first, then spread it.

1. Add `--brand` and `--brand-on-dark` to `:root` and `.dark` in `app/globals.css`, and map `--color-brand` and `--color-brand-on-dark` in `@theme inline`, satisfies **AC-1**, **AC-7**
2. Apply `text-brand` to the Work Experience section title and check it in both modes (the thin end to end thread), satisfies **AC-2**
3. Apply `text-brand` to the remaining eight section titles, satisfies **AC-2**
4. Apply the Work Experience card changes (timeline, dot, company, pills, hover border), satisfies **AC-5**, **AC-7**
5. Replace every gold class in the Certification card with `brand-on-dark` at the same opacity, satisfies **AC-6**, **AC-7**
6. Apply the desktop dock hover, toggle, and tooltip changes, satisfies **AC-3**
7. Apply the mobile menu button and item active and focus changes, satisfies **AC-4**
8. Run `npm run lint` and `npm run build`, then walk the critical test scenarios in light and dark mode, including the out of scope regression checks, satisfies **AC-7**, **AC-8**

## Consequences

**Positive**:
- One visual thread across the page with no change to the gray base.
- The green is tuned in one file; a later rebrand is a two token edit.
- The certificate gains contrast safety it did not explicitly have before.

**Negative / tradeoffs**:
- Two greens exist (`brand` and `brand-on-dark`); a contributor must know the certificate uses the fixed one.
- The certificate loses its "gold diploma" feel, which some visitors read as prestige.
- The dock gains very little color at rest; on desktop the green shows only on hover, so it is subtle by design.
- Nothing enforces "use `brand`, not `emerald-*`"; it relies on convention.

**Neutral**:
- The unused `siteSettings.primaryColor` / `secondaryColor` / `accentColor` fields remain, now clearly not the source of the site's colors.
- The existing green status colors (ContactForm success, online dot, Achievements "speaking" badge) are a different, semantic green and stay as they are.

## Follow-up

- [ ] Decide what to do with the unused `primaryColor`, `secondaryColor`, and `accentColor` fields in `sanity/schemaTypes/siteSettings.ts` (remove them, or document that the theme lives in `globals.css`) so editors are not misled into thinking they work.
- [ ] Consider adding a one line rule to `components/AGENTS.md`: use `text-brand` / `brand-on-dark` for the accent, never raw `emerald-*` classes. (`/sync` owns that file.)
- [ ] `app/globals.css` repeats the `--chart-*` values inside `@layer base`; harmless, but worth cleaning up separately.
