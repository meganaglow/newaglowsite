# CLAUDE.md

## Project
Redesign of aglowstudios.ai (Aglow Studios): AI-enabled websites for businesses
that serve people face to face (salons, medspas, planners, nonprofits).
Static site: plain HTML, CSS, JS. No framework, no build step, no npm.

## Design
- `DESIGN.md` is the source of truth for the look ("First light": light blush
  dawn scene, luxurious, elegant, layered). Read it before building or changing any page.
- `styleguide.html` is the live preview of every token and component. Add new
  components there first.
- Colors, fonts, spacing, radius, shadows and motion are CSS variables in `:root`
  in `styles.css`. Use the variable names; never raw values in pages.
- Fonts are self-hosted in `assets/fonts/` (Cormorant Garamond, Jost; OFL).
  Do not add Google Fonts links.
- All motion must respect `prefers-reduced-motion`.

## Conventions
- Mobile-first; must work at 375px wide with no horizontal scroll.
- Images go in `assets/images/`; always set `alt` text and width/height.
- Keep copy placeholders obvious ("Placeholder") until real copy is supplied.
  Never invent business facts (prices, addresses, testimonials, client names).
- The current live site (aglowstudios.ai) is the source for existing copy.

## AI demos
- The concierge chat in `script.js` is scripted (canned replies), labeled
  "Scripted demo". It is not a live AI.
- A live AI demo needs a server-side function (e.g. a Netlify Function calling
  the Claude API) so the API key is never in browser code. Not built yet.
- Demo content must always be labeled as an example; never imply a real client.

## Concept portfolio (planned, not built)
Goal: a "Concept designs" section on the home page linking to four live example
sites, to show range. Decisions already made with the owner:
- Build each concept as a real mini-site in `concepts/<name>/` (own `index.html`
  and its own small stylesheet and tokens; do not reuse Aglow's look).
- Use Canva AI images for photography only (2 to 3 per concept), never for
  pictures of layouts. Owner's standing preference: Claude generates the images
  directly in Canva (Canva connector, `generate-image`) instead of handing the
  owner prompts. Claude cannot download full-size files from Canva, so the owner
  picks, downloads and sends them (chat or `assets/images/concepts/`); Claude
  then converts them to WebP. Why: `generate-image` returns only a media id and
  a 200px preview, and the connector has no media download. The only route is
  placing the image in a design and using `export-design`, whose signed link is
  on `export-download.canva.com` (host now allowed in this environment), but
  auto mode blocked fetching that link (Nov 2026). Revisit only if the owner
  adds a permission rule for it. Prefer faceless shots and still life. Check every
  image for real brand names or logos (AI often adds them) and remove or
  regenerate before use.
- Label every concept "Concept" on the card and on the page. Never present one
  as client work. No testimonials, before-and-after results or return figures.
- Build order: hair salon first as a pilot; the owner decides on the rest after.

| Concept | Look | Layout idea | AI demo |
|---|---|---|---|
| Hair salon | Fashion editorial: warm black, copper, cream; bold condensed headlines | Full-bleed portraits, sideways-scrolling lookbook | Stylist-match quiz, booking concierge |
| Injectable medspa | Clinical calm: white, stone, soft sage; light airy type | Generous space, treatment menu like a fine-dining menu | Treatment finder, pre-visit prep assistant |
| Financial planner | Quiet confidence: deep green or navy, cream, brass; classic serif | Structured grid, thin chart-like lines, numbered steps | Meeting-prep intake that summarizes goals |
| Wedding planner | Romantic editorial: ivory, dusty rose, olive; large italic serif | Overlapping photo collage, slow parallax gallery | Date-availability check, rough-estimate builder |

On the Aglow home page: four cards, each a browser frame that scrolls the
concept slowly on hover; click opens the live concept page.

## Status
- Done: design system, logo (glint cluster), hero render, stars, preview page.
- `index.html` is still a placeholder. Next: build the real home page from the
  live site's copy, following `DESIGN.md`.
- Open with the owner: scripted chat for launch then live later, or live now.
- Salon pilot built: `concepts/salon/` ("Cuivre Hair Studio", fictional). Own
  tokens in `salon.css`, own fonts in `concepts/salon/fonts/` (Archivo variable
  with width axis for condensed headlines, Instrument Serif italic; OFL).
  Scripted stylist-match quiz and booking concierge in `salon.js`. Menu prices
  are labeled as samples. Photos in `assets/images/concepts/salon-*.webp`
  (the comb's "Mason Pearson" brand text was painted out). Frames fall back to
  a labeled placeholder if an image is missing.
- Medspa concept built: `concepts/medspa/` ("Sauge Aesthetic Clinic",
  fictional). White, stone, sage; Newsreader (light serif) + Manrope; fonts in
  `concepts/medspa/fonts/` (OFL). Fine-dining menu with sample prices,
  scripted treatment finder and visit assistant in `medspa.js` (logistics only,
  labeled "not medical advice"). Waiting on 3 photos. First Canva set was
  rejected by the owner as too generic (dropper bottle, treatment bed). Second
  set, in the owner's Canva: hero option A sculptural vessel MAHbfXScW9I or
  option B faceless shoulder MAHbfeNccvU -> `medspa-hero-1600.webp` (3:2),
  room arch + olive tree MAHbffJXtu8 -> `medspa-room-1200.webp` (4:5),
  hand on collarbone MAHbfWvpHR4 -> `medspa-detail-1200.webp` (4:5).
  Owner to pick the hero and send the files.
  Frames show labeled placeholders until then.
- Concepts left: financial planner, wedding planner (owner decides).
- Not built yet: the concept cards on the Aglow home page.

## Preview
`python3 -m http.server 8000` from the repo root, then open `/styleguide.html`.

## Deploy
Planned: Netlify, publish directory = repo root, no build command.
