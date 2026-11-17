# DESIGN.md — Aglow Studios

Direction: **"First light."** A blush plaster wall at dawn: an arch opening onto
a pale sky, one glowing gold orb, steps into still water. Warm ivory pages, deep
wine for actions, and a little near-black "night" for contrast. Luxurious and
elegant, never cold. The palette is the original aglowstudios.ai palette, refined.

Every value below exists as a CSS variable in `:root` in `styles.css`.
Pages use the variable names, never raw values.

## References

Three sites the owner likes were studied (November 2026). Borrow the patterns,
never the assets, copy or exact look.

| Site | What it does | What Aglow borrows |
|---|---|---|
| unseen.co (home screen, from the owner's screenshot) | A rendered blush-plaster room with arches, steps into reflective water, a pearl sphere and a lavender sky, under film grain; italic display serif headline; white pill button | A scenic light hero in blush and lavender, an arch as the focal shape, water and reflection, film grain, pill controls, cursor-reactive depth. Our scene is our own composition with a gold orb, not a copy |
| Mariana (Squarespace demo) | Full-bleed photo hero with a 144px headline; pale background; one saturated accent on headings and pill buttons; heading top-left with body text offset lower-right; dark band for the newsletter | Oversized display type, the offset "statement" layout, one dark band per page for sign-up |
| Crosby (Squarespace demo) | Near-black photography with blush objects; charcoal and warm-grey bands; white display serif at modest sizes; small quiet buttons; full-bleed image bands between flat color bands | Blush glowing out of the dark, quiet light-colored buttons on night, alternating full-bleed and flat bands |

Deliberately not borrowed: unseen.co's entry gate, sound and click-and-hold
navigation. They suit a studio showing off; they slow down a salon owner who
wants to see packages and book a chat.

## Principles

1. **Restraint is the luxury.** One primary color, one accent, lots of space.
2. **Layers, not boxes.** Elements overlap and float at three depths
   (page → raised → floating). At most one layered composition per screen.
3. **The glow is the signature.** One glowing gold orb in the hero; elsewhere at
   most one soft gold glow per screen. Never decoration for its own sake.
4. **Motion is quiet.** Things ease, lift and draw in. Nothing bounces or spins.

## Color

Light theme only, and light-first: blush, ivory and cream carry the pages.
"Night" is an accent surface (footer, chat header, floating button, one band at
most), not a dark mode.

| Token | Value | Role |
|---|---|---|
| `--ivory` | `#FAF6F0` | Page background |
| `--cream` | `#F2EADF` | Alternate section background, card fill |
| `--blush` | `#EBD9D3` | Full blush bands (`.band-blush`), soft tint behind imagery, glow of objects on night |
| `--plaster-light` | `#F4E6DF` | Lit side of the hero wall, steps |
| `--plaster-shade` | `#DEC5BD` | Shaded side of the hero wall |
| `--mist` | `#D3D1E6` | Lavender of the dawn sky and water. Scene only, never UI |
| `--dawn` | `#F8DCC0` | Peach light at the horizon. Scene only |
| `--line` | `#E3D8CA` | Hairline borders and dividers (decorative) |
| `--line-strong` | `#9A8C7C` | Input borders (3:1 on ivory) |
| `--ink` | `#231C1D` | Headings and body text (15.5:1 on ivory) |
| `--ink-soft` | `#5E5350` | Secondary text (6.9:1 on ivory) |
| `--wine` | `#7E3D48` | **Primary**: buttons, links (7.4:1 on ivory) |
| `--wine-deep` | `#662F39` | Primary hover / pressed |
| `--gold` | `#C6A15B` | **Accent, decorative only**: hairlines, ornaments, icons. Never text on light (2.3:1) |
| `--gold-deep` | `#7D5F26` | Gold-toned text on light: labels, eyebrows (5.5:1) |
| `--glow` | `#F5C97B` | Glow gradients; label text on night (11.4:1); the color a night button lights up to on hover |
| `--night` | `#1E1618` | Dark band background, footer |
| `--night-raised` | `#2B2023` | Cards and floating elements on night |
| `--on-night` | `#F4ECE2` | Text on night (15.2:1) |
| `--on-night-soft` | `#C9BBB0` | Secondary text on night (9.5:1) |
| `--success` | `#4A6645` | Confirmation text and icons |
| `--warning` | `#8A5D0B` | Warning text and icons |
| `--error` | `#A1362E` | Error text, invalid input border |

Carried over from the current site: the ivory/cream/blush family and the wine
(was `--rose-darker`). Dropped: sage (a third hue dilutes the palette) and
bright rose as a text color (fails contrast at body size).

## Typography

Self-hosted variable fonts in `assets/fonts/` (SIL Open Font License).

- **Display: Cormorant Garamond** (kept from the current site). Used larger and
  lighter than before: weight 500, italic for one emphasized word per heading.
- **Text and UI: Jost.** Weight 400 body, 500 buttons and labels.

| Token | Size / line height | Use |
|---|---|---|
| `--text-display` | `clamp(3rem, 7.6vw, 6.5rem)` / 1 | Hero headline only |
| `--text-h1` | `clamp(2.25rem, 5vw, 4rem)` / 1.08 | Page titles |
| `--text-h2` | `clamp(1.875rem, 3.6vw, 2.875rem)` / 1.12 | Section headings |
| `--text-h3` | `1.5rem` / 1.25 | Card and sub-section headings |
| `--text-lead` | `1.25rem` / 1.6 | Intro paragraph under a heading |
| `--text-body` | `1.0625rem` (17px) / 1.7 | Body |
| `--text-small` | `0.9375rem` / 1.6 | Captions, form help, footer |
| `--text-label` | `0.75rem` / 1.2, uppercase, `0.2em` tracking, weight 500 | Eyebrows, nav, tags |

Headings: letter-spacing `-0.01em`. Body lines max `62ch`.

## Spacing

4-based scale: `--s-1` 4 · `--s-2` 8 · `--s-3` 12 · `--s-4` 16 · `--s-5` 24 ·
`--s-6` 32 · `--s-7` 48 · `--s-8` 64 · `--s-9` 96 · `--s-10` 128 (px).

- Section padding: `--section: clamp(72px, 10vw, 144px)`.
- Content width: `--max-width: 1160px`. Gutter: `--gutter: clamp(20px, 4vw, 40px)`.

## Shape and depth

| Token | Value | Use |
|---|---|---|
| `--r-sm` | `2px` | Inputs, tags |
| `--r-card` | `4px` | Cards, panels (sharp reads tailored; the old 18px read friendly) |
| `--r-pill` | `999px` | Buttons, floating chips, floating action button |
| `--r-arch` | `999px 999px 4px 4px` | Image frames: the signature shape |
| `--shadow-raised` | `0 12px 32px -16px rgba(35,28,29,.18)` | Cards on hover, raised layer |
| `--shadow-float` | `0 24px 60px -20px rgba(35,28,29,.30), 0 2px 6px rgba(35,28,29,.06)` | Floating layer: chips, FAB, chat panel |
| `--glow-shadow` | `0 0 40px rgba(245,201,123,.45)` | Night buttons and the FAB on hover |
| `--orb-glow` | two-layer gold `box-shadow` | Light around the hero orb |
| `--water` | `clamp(120px, 22vh, 220px)` | Height of the hero water band |

Layers (z-index): `--z-raised` 10 · `--z-float` 20 · `--z-nav` 100 ·
`--z-fab` 200 · `--z-chat` 300.

## Motion

| Token | Value | Use |
|---|---|---|
| `--t-micro` | `160ms` | Hover, focus, press |
| `--t-ui` | `320ms` | Panels, nav, chat open |
| `--t-reveal` | `800ms` | Scroll reveals |
| `--ease` | `cubic-bezier(.2,.7,.2,1)` | Everything |

Microinteractions in use:

- **Button hover:** lifts 2px, shadow deepens, arrow slides 4px right.
- **Quiet link:** gold underline draws in from the left.
- **Card hover:** lifts 4px, hairline turns gold.
- **Scroll reveal:** fade up 20px, children staggered by 80ms.
- **Floating chips:** slow 7s drift of 8px; pause on hover.
- **Depth:** the orb and floating chips shift slightly with the cursor in the
  hero (desktop only). The orb also drifts slowly.
- **FAB:** gentle pulse ring once, 3s after load; never loops.

All motion is disabled under `prefers-reduced-motion: reduce`.

## Components

- **Button, primary:** pill, `--wine` fill, `--ivory` text, min height 48px.
  Hover `--wine-deep`. On night: `--on-night` (ivory) fill, `--night` text; on
  hover it lights up to `--glow` with `--glow-shadow`.
- **Button, secondary:** pill, 1px `--ink` outline, transparent. Hover fills ink.
  On night: 1px `--on-night` outline.
- **Button, quiet:** text + arrow, underline draws in. For "learn more" actions.
- **All buttons:** focus ring 2px `--gold-deep` (or `--glow` on night), offset 3px.
  Disabled: 45% opacity, no hover.
- **Links in text:** `--wine`, 1px underline, offset 3px.
- **Eyebrow:** `--text-label` in `--gold-deep`, preceded by the ✦ ornament.
- **Inputs:** underline style: transparent fill, 1px `--line-strong` bottom
  border, label above in `--text-label`. Focus: border `--wine`, 2px.
  Error: border `--error` plus a text message (never color alone).
- **Bands:** sections alternate surfaces: ivory, cream, blush (`.band-blush`)
  and night (`.band-night`). One night band besides the footer, at most.
- **Hero (`.hero`):** full viewport height dawn scene. Plaster wall with a shaft
  of light and film grain, water band along the bottom, display headline left,
  the arch composition right, standing on the water line.
- **Dawn scene (`.layers`):** the arch opening onto the sky (`.arch`), the gold
  orb (`.orb`), three steps into the water (`.steps`), a reflection, and two or
  three floating chips. Drawn in CSS, no image files. If a rendered or
  photographed scene replaces it later, keep the same composition rules: light
  wall where the text sits, one arch, one orb, water at the bottom.
- **Statement (`.statement`):** oversized heading top-left, body text and a quiet
  link offset lower-right. One per page.
- **Card:** `--ivory` or `--cream` fill, 1px `--line` border, `--r-card`.
- **Floating chip:** small pill or card at the floating layer showing one live
  detail ("Booked · Sat 10:30"). Used in layered compositions, 2–3 max.
- **Navigation:** transparent with ink text over the light hero (add
  `.site-header--night` on a page with a night hero); after scroll, solid
  `--ivory` with a hairline. Links in `--text-label`. Primary button at the right. Mobile: full
  screen overlay menu.
- **Floating action button (FAB):** fixed bottom-right pill, "Ask Aglow" with the
  ✦ mark. Opens the concierge chat panel. On mobile it sits above a sticky
  "Book a free chat" bar.
- **Chat panel:** floating layer, `--r-card`, 380px wide (full width on mobile).
  Night header, ivory body. Assistant bubbles cream, visitor bubbles wine.
- **AI demo module:** a framed, interactive example of an automation, with an
  industry switcher (Salon · Medspa · Planner · Nonprofit) as pill tabs. Always
  labeled "Live demo" or "Example"; never implies a real client.
- **Footer:** night band, on-night text, gold hairline on top.

## Imagery and icons

- **Icons:** Lucide, inline SVG, 1.25px stroke, 20px or 24px. No emoji as icons.
- **Ornament:** the four-point star ✦ as an SVG in `--gold`. Sparingly.
- **Imagery:** client-site mockups and real photos in arch frames (`--r-arch`),
  layered with floating chips and one glow. When real photos exist, prefer
  full-bleed, dark-background still life (objects lit against near-black) so the
  photo merges with a night band. No stock photos of strangers
  presented as clients; no invented client work or testimonials.
- **Logo:** wordmark "Aglow *Studios*" in Cormorant Garamond with the ✦ mark.
  (Open decision: keep or retire the firefly mark from the current site.)

## Avoid

Purple or blue gradients, glass blur on everything, every section centered,
three identical feature cards, gradient text, emoji icons, more than one glow
per screen, gold as body text on light backgrounds.
