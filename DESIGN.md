---
name: Probo
description: Marketing site and docs for Probo, compliance done for you by experts on an open-source platform.
colors:
  ink: "#141e12"
  ink-foreground: "#fcfdfc"
  muted: "#626861"
  tertiary: "#606760"
  ground: "#fffffb"
  card: "#ffffff"
  card-sage: "#f7f9f7"
  border-solid: "#ecefec"
  border-low: "#022a0213"
  border-mid: "#001a0027"
  highlight: "#0027000d"
  subtle: "#054d0507"
  signal-yellow: "#e6ff03"
  leaf: "#93c926"
  moss: "#5d770d"
  sprout: "#e4f7c7"
typography:
  h1:
    fontFamily: "Geist, sans-serif"
    fontSize: "4rem"
    fontWeight: 500
    lineHeight: 1
    letterSpacing: "-1.4px"
  h2:
    fontFamily: "Geist, sans-serif"
    fontSize: "2.75rem"
    fontWeight: 500
    lineHeight: 1.09
    letterSpacing: "-1.4px"
  h3:
    fontFamily: "Geist, sans-serif"
    fontSize: "2rem"
    fontWeight: 500
    lineHeight: 1.09
    letterSpacing: "-0.6px"
  h4:
    fontFamily: "Geist, sans-serif"
    fontSize: "1.4375rem"
    fontWeight: 500
    lineHeight: 1.08
    letterSpacing: "-0.6px"
  h5:
    fontFamily: "Geist, sans-serif"
    fontSize: "1.3125rem"
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "-0.4px"
  quote:
    fontFamily: "Geist, sans-serif"
    fontSize: "1.5rem"
    lineHeight: 1.33
    letterSpacing: "-0.6px"
  lead:
    fontFamily: "Geist, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.529
    letterSpacing: "-0.2px"
  body:
    fontFamily: "Geist, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 400
    lineHeight: 1.4666
    letterSpacing: "-0.1px"
  label:
    fontFamily: "Geist, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 500
    lineHeight: 1.428
    letterSpacing: "-0.1px"
  caption:
    fontFamily: "Geist, sans-serif"
    fontSize: "0.8125rem"
    lineHeight: 1.384
    letterSpacing: "-0.1px"
  micro:
    fontFamily: "Geist, sans-serif"
    fontSize: "0.75rem"
    lineHeight: 1.58888
    letterSpacing: "0px"
rounded:
  md: "6px"
  lg: "8px"
  xl: "12px"
  2xl: "16px"
  3xl: "24px"
  full: "9999px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "24px"
  lg: "40px"
  xl: "80px"
  gutter: "20px"
  container: "1280px"
components:
  button-primary:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ink-foreground}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    padding: "0 12px"
    height: "32px"
  button-primary-lg:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ink-foreground}"
    typography: "{typography.lead}"
    rounded: "{rounded.full}"
    padding: "0 20px"
    height: "48px"
  button-secondary:
    backgroundColor: "{colors.card}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    padding: "0 12px"
    height: "32px"
  button-highlight:
    backgroundColor: "{colors.highlight}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
  nav-link:
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0 9px"
    height: "32px"
  pill-signal:
    backgroundColor: "{colors.signal-yellow}"
    textColor: "{colors.ink}"
    typography: "{typography.caption}"
    rounded: "{rounded.full}"
    padding: "4px 12px"
  pill-sprout:
    backgroundColor: "{colors.sprout}"
    textColor: "{colors.moss}"
    typography: "{typography.caption}"
    rounded: "{rounded.full}"
    padding: "4px 10px"
  card-story:
    backgroundColor: "{colors.card-sage}"
    rounded: "{rounded.3xl}"
    padding: "32px"
  card-media:
    rounded: "{rounded.2xl}"
---

# Design System: Probo

## Overview

**Creative North Star: "The Calm Auditor"**

Probo sells relief: compliance experts run the program so the customer does not have to. The site should feel the way a good auditor behaves: composed, exact, and quietly confident, never alarmist. Pages are bright and airy on a warm near-white ground, set in one typeface (Geist) with tight negative tracking on headlines, and carried by real product footage and screenshots rather than illustration.

Colour is held back. Almost everything is green-tinted ink on warm white, with greys that lean faintly green so the palette never reads as cold corporate grey. The one loud note is the signal yellow (`#e6ff03`), which appears as a soft blurred glow or a small pill, never as a large flat fill. Depth is light: hairline borders, soft layered shadows on media, and gentle lift on hover.

Motion is springy and brief: headlines and CTAs rise into place on load, sections reveal once on scroll, and everything respects `prefers-reduced-motion`.

**Key Characteristics:**

- One typeface, Geist, with medium (500) weight headlines and tight negative tracking.
- Green-black ink (`#141e12`) instead of pure black; warm near-white ground (`#fffffb`).
- Signal yellow used sparingly as glow or pill, never as a background block.
- Pill-shaped buttons; generously rounded cards and media (12 to 24px).
- Real product UI and video as the main visual material.
- Centered hero and section intros, with lead copy in muted grey.

## Colors

A near-monochrome, green-tinted palette with one electric yellow accent and a small family of leaf greens for status.

### Primary

- **Green-Black Ink** (`colors.ink`): all headings and primary text, the primary button fill, and dark surfaces. It is the brand's main colour, not a neutral.
- **Off-White on Ink** (`colors.ink-foreground`): text and icons sitting on ink surfaces (primary buttons, dark bands).

### Secondary

- **Signal Yellow** (`colors.signal-yellow`): the brand's signature. Used as a heavily blurred stroked ring behind hero or feature visuals (see `public/trust-center/ellipse.svg`), as a small label pill, and in the logo. Pale at the edges, saturated at the centre.

### Tertiary

- **Leaf** (`colors.leaf`): UI accent green for small indicators and illustrations.
- **Moss** (`colors.moss`): success text, check marks, and the left rule on callout blocks.
- **Sprout** (`colors.sprout`): pale active or selected background, and soft label pills paired with moss text.

### Neutral

- **Warm Ground** (`colors.ground`): the page background.
- **Card White** (`colors.card`): raised cards and secondary buttons on the ground.
- **Sage Card** (`colors.card-sage`): story and feature cards that need to sit slightly apart from the ground.
- **Muted Grey-Green** (`colors.muted`): body copy, lead paragraphs, and descriptions. This is the most used text colour on the site.
- **Tertiary Grey-Green** (`colors.tertiary`): small eyebrow headings such as "Trusted by leading teams".
- **Hairline** (`colors.border-low`): the default border for every element (set globally on `*`) and `<hr>`.
- **Mid Line** (`colors.border-mid`) and **Solid Line** (`colors.border-solid`): stronger dividers, image frames, and the separator inside the GitHub star button.
- **Highlight Tint** (`colors.highlight`) and **Subtle Tint** (`colors.subtle`): translucent ink washes for hover states, nav items, and quiet panels.

All of these are Tailwind theme tokens in `src/styles/theme.css` (`--color-foreground`, `--color-muted-foreground`, `--color-level-0`, and so on). Use the utility names (`text-muted-foreground`, `bg-level-0`, `border-border-low`), not raw hex.

### Named Rules

**The Ink Not Black Rule.** Text and dark fills are always `#141e12`. Pure `#000` and Tailwind `gray-*` / `neutral-*` scales are off-brand.

**The Yellow Is Light Rule.** Signal yellow behaves like light, not paint: a blurred glow, a pill, a thin highlight. It never fills a section, a card, or a large button.

**The Tokens Only Rule.** Reach for theme tokens first. A new hex value in a component needs a reason; `src/pages/hub/*` shows what happens without one (`#f0ff3c`, `#f8f9f7`, `bg-gray-50` drifting away from the system).

## Typography

**Display Font:** Geist (with sans-serif fallback)
**Body Font:** Geist (with sans-serif fallback)

**Character:** A single neutral grotesk does all the work; hierarchy comes from size and tracking, not from a second family or heavy weights. Headlines are tight and compact, body text is calm and slightly loose.

### Hierarchy

- **H1** (500, 4rem / 64px, line-height 1, -1.4px): the home and landing hero headline only. On mobile, heroes step down to H2 (`text-h2 sm:text-h1`).
- **H2** (500, 2.75rem / 44px, 1.09, -1.4px): section titles. Steps down to H3 on mobile (`text-h3 sm:text-h2`).
- **H3** (500, 2rem / 32px, 1.09, -0.6px): sub-section titles.
- **H4** (500, 1.4375rem / 23px, 1.08, -0.6px): feature and card titles (for example `SaleArg`).
- **H5** (500, 1.3125rem / 21px, 1.2, -0.4px): small card titles.
- **Quote** (1.5rem, 2rem from `sm`): testimonials.
- **Lead** (400, 1.0625rem / 17px, 1.529, -0.2px): the default paragraph on marketing pages (`text-lg`), usually in muted grey and capped around `max-w-150` to `max-w-200`.
- **Body** (400, 0.9375rem / 15px, 1.4666): base text and docs.
- **Label** (500, 0.875rem / 14px): buttons, nav, form labels.
- **Caption / Micro** (13px / 12px): pills, framework labels, metadata.

Headings use `text-wrap: balance`; paragraphs and list items use `text-wrap: pretty` (set globally).

### Named Rules

**The Medium Weight Rule.** Headlines are `font-medium` (500). The core pages use it; semibold and bold headlines are a hub-page drift, not the system.

**The Tight Tracking Rule.** Never remove the negative letter-spacing on H1 to H3. It is the signature of the type; use the `text-h*` utilities rather than raw `text-5xl` sizes, which carry no tracking.

## Layout

Content sits in a centered container (`container` utility: max 1280px, 20px side gutters). Sections stack vertically with `py-10` on mobile and `py-20` from `sm` (40px / 80px). Section intros are centered: H2, then a muted lead paragraph with a max width, then content. Inside sections, spacing steps through 8, 16, 24, 40 and 80px (`gap-2`, `gap-4`, `gap-6`, `gap-10`, `gap-20`).

Feature grids go from a single column on mobile to two columns from `sm` (640px). Custom breakpoints: `sm` 640px, `md` 1120px, `lg` 64rem (1024px), `xl` 72rem (1152px). Note that `md` is wider than `lg`; prefer `sm` and `lg` for layout changes.

The hero pulls up under the sticky header (`-mt-16`) and stacks: YC badge, H1, lead, CTA pair, framework badges, customer logos. CTAs stack full-width on mobile and sit in a row from `sm`.

## Elevation & Depth

Mostly flat, with light layering. Surfaces separate by tone (ground vs. white vs. sage) and hairline borders first; shadows are soft and reserved for media, cards and interactive lift.

### Shadow Vocabulary

- **Button** (`shadow-btn`: `0 1px 3px #0b13241a, inset 0 1px 0 rgba(0,0,0,0.1)`): a barely-there press edge on buttons.
- **Image** (`shadow-image`: a six-layer stack from 1px to 24px at 4 to 6% opacity, plus a 1px ring): product screenshots and hero visuals.
- **Mid** (`shadow-mid`: `0 2px 12px #0000000f, 0 2px 4px #00000014`): floating panels such as menus.
- **Card at rest / hover** (`shadow-sm` to `shadow-md` or `shadow-lg`): cards lift on hover together with `-translate-y-1`.
- **Prose figures**: images in articles get a 12px radius, a 1px solid border, 6px padding and a soft three-layer green-tinted shadow (`.prose img` in `global.css`), so screenshots read as figures, not live UI.

### Named Rules

**The Lift On Intent Rule.** Shadows grow only in response to hover or focus. A card at rest is quiet.

## Shapes

Soft and friendly geometry. Buttons, pills, badges and avatars are fully round (`rounded-full`). Containers are generously rounded and get rounder as they get bigger: 6px for nav items, 8 to 12px for small panels and inputs, 16px for media and feature visuals, 24px for large story cards. Media inside a card uses the card's top radius (`rounded-t-3xl`) or a slightly smaller one than its container. Borders are 1px, or 0.5px on cards, in the hairline colour.

## Components

### Buttons

Pill-shaped, compact and confident.

- **Shape:** fully round (`rounded-full`), `font-medium`, `leading-none`, icon gap 8px.
- **Primary:** ink fill, off-white text, 36px tall on mobile and 32px from `sm`, 12px horizontal padding, 14px text. Hover drops to 80% opacity of ink (`hover:bg-primary/80`).
- **Large:** 48px tall, 20px padding, 17px text. Used for hero CTAs.
- **Secondary:** white fill, ink text, hairline border with a slightly darker bottom edge (`border-b-[#0000001A]`). Paired to the left of a primary CTA ("Deploy Open Source" next to "Talk to an expert").
- **Highlight:** translucent ink wash, ink text.
- **Navigation:** transparent, 32px tall, 6px radius, highlight wash on hover and when expanded, 2px focus ring in the current colour.

Always use `src/components/ui/Button.svelte` rather than restyling an `<a>`.

### Pills / Labels

- **Signal pill:** signal-yellow fill, ink text, 12 to 13px medium, 4px by 12px padding. One per surface at most.
- **Sprout pill:** sprout or pale-green fill with moss text, for categories and statuses.

### Cards / Containers

- **Story card:** sage fill, 24px radius, 0.5px hairline border, `shadow-sm`, lifts 4px with `shadow-lg` on hover over 300ms. Image on top at a fixed aspect ratio, body padded 24px (32px from `sm`).
- **Compact card:** 12px radius, `shadow-sm` to `shadow-md` on hover, title in H5.
- **Media frame:** 16px radius, `overflow-hidden`, a neutral `#EEEDE8` placeholder fill behind posters and video, and a gradient fade into the ground at the bottom edge where it meets text.

### Navigation

Sticky header, transparent at the top of the page. Once scrolled, it gains an 80% ground fill, `backdrop-blur-md` and a hairline bottom border. Logo left; menu entries as navigation buttons; a secondary "Star" GitHub button with live count; the primary "Get compliant" CTA on the right. Below `lg` the menu collapses into a burger with a full mobile menu.

### FAQ

Accordion rows separated by hairlines. Panels expand with a 300ms grid-row transition on the expo-out curve (`cubic-bezier(0.19, 1, 0.22, 1)`), content fades in over 160ms, and the plus icon rotates with a slight overshoot. All transitions turn off under reduced motion.

### Motion

- **Spring smooth** (`--spring-smooth`, a `linear()` spring approximation, 850 to 1200ms): the default entrance curve.
- **Perspective in** (`animate-perspective-in`): hero headline lines and CTAs, staggered with `animation-delay-*` (50 to 300ms).
- **Slide in** (`animate-slide-in`, 50px rise plus fade): logo rows and reveal-on-scroll sections.
- **Scroll** (`animate-scroll`, 4s linear): logo and testimonial marquees.

## Do's and Don'ts

### Do:

- **Do** use the theme tokens and `text-h*` utilities from `src/styles/theme.css`; extend the theme rather than hardcoding hex.
- **Do** set headlines in `font-medium` with their built-in negative tracking, and step them down one size on mobile.
- **Do** write body and lead copy in `text-muted-foreground` and keep headings in ink.
- **Do** show real product screenshots and video, framed with `shadow-image` or the prose figure treatment.
- **Do** build the signal-yellow glow as a blurred stroked circle (`ellipse.svg`), not a CSS radial gradient.
- **Do** reuse `Button.svelte`, `SaleArg`, `StoryCard` and the blocks in `src/components/block/` before creating new components.
- **Do** gate every entrance and reveal animation behind `prefers-reduced-motion: no-preference`.

### Don't:

- **Don't** use pure black, Tailwind `gray-*` or `neutral-*` colours, or new off-brand yellows such as `#f0ff3c`.
- **Don't** fill sections, cards or large buttons with signal yellow.
- **Don't** copy the styling of `src/pages/hub/*` (semibold headings, `bg-gray-50`, ad hoc hex); it predates this file and is not the reference.
- **Don't** add a second typeface or heavy (700+) headline weights.
- **Don't** use square-cornered buttons or cards; the system is pill buttons and 12 to 24px containers.
- **Don't** put strong shadows on resting elements; depth appears on hover and around media.
