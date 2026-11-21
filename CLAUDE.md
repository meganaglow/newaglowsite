# CLAUDE.md

## Project
Redesign of aglowstudios.ai (Aglow Studios): AI-enabled websites for businesses
that serve people face to face (salons, medspas, planners, nonprofits).
Static site: plain HTML, CSS, JS. No framework, no build step, no npm.

## Positioning and voice (owner, Nov 2026)
- Customers ask for "a website"; what they value is time back with their clients.
  Keep the word "website" up front, and frame it as the home for their business
  while they are busy being its face. Booking, payments, FAQs, email sign-up, light
  AI and ongoing care are what is inside that home, never pitched as separate tech.
- Home hero (say "website" once only, in the headline): eyebrow "For
  people-first businesses", headline "A website that works as warmly as you do." Lead: "It's the
  home for your business. While you're there face to face, it
  welcomes new clients, takes bookings and answers their questions. Your time
  belongs with the people in front of you."
- Two ways to work together (owner, Nov 2026), on `services.html`:
  1. Design & hand-off: Aglow designs and builds the site, then hands it over for
     the owner to host and manage, with a full walkthrough and transition support.
  2. Full service: the owner just reaches out; Aglow makes changes, updates
     content and graphics, posts seasonal specials and promotions, and includes
     hosting and technical maintenance.
  No prices stated for either; every engagement is quoted after a chat.
  `packages.html` calls the ongoing option "Full service" too (was "Ongoing
  website care").
- Voice (from the live site copy): calm, honest, one-to-one. "I" for promises,
  "we" for the shared process, "you" for the reader. "No" lists that remove
  worries; "X, not Y" contrasts; a longer sentence then a short landing line;
  technology useful but never the point; no hype words, urgency or exclamation
  marks; never invented results or testimonials.

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
| Luxury spa & skin (medspa) | Calm luxury: white, stone, soft sage; light airy type | Full-bleed photos, generous space, rituals menu like a fine-dining menu | Online booking, "Design your day" itinerary builder, day concierge |
| Financial planner | Quiet confidence: deep green, paper, gold; classic serif; botanical line art | Structured grid, fee comparison table, numbered steps | Meeting-prep intake that summarizes each request |
| Wedding planner | Romantic editorial: ivory, dusty rose, olive; large italic serif | Overlapping photo collage, slow parallax gallery | Date-availability check, rough-estimate builder |

On the Aglow home page: four cards, each a browser frame that scrolls the
concept slowly on hover; click opens the live concept page.

## Status
- Done: design system, logo (glint cluster), stars, preview page. Home hero: the
  dawn render, without chips (owner preferred it over a website-screens hero).
- Site pages built (Nov 2026) from the live site's copy, same URLs as live:
  `index.html`, `services.html`, `who.html`, `packages.html`, `contact.html`.
  Shared header, mobile menu, footer, sticky phone booking bar and "Ask Aglow"
  chat are repeated in each file: change all five together. Home adds a
  "Concept designs" section (browser-frame cards; every card scrolls through its
  whole site on hover in about 30s, owner Nov 2026; images
  `assets/images/concepts/card-*.webp` are full-page screenshots of the concept
  sites taken with the demos mid-use: quiz answered, a day being booked, a chat
  in progress. Regenerate when a concept changes) and the "Smart site setup" demo.
- Contact form: Netlify Forms, same form name ("contact") and field names as
  live, posted by fetch from `script.js`; `?about=quote|invoice` presets kept.
  Glow List still uses the live site's interim mailto; replace when the owner
  picks Flodesk or Mailchimp.
- "Ask Aglow" uses `SCRIPTS.aglow` in `script.js`: answers only from live-site
  facts. Keep it that way.
- At launch: remove `<meta name="robots" content="noindex">` from all pages.
- To do: add the new components (concept card, compare table, package list,
  checklist, pills, page hero, mobile menu) to `styleguide.html`.
- Open with the owner: scripted chat for launch then live later, or live now.
- Salon pilot built: `concepts/salon/` ("Cuivre Hair Studio", fictional). Own
  tokens in `salon.css`, own fonts in `concepts/salon/fonts/` (Archivo variable
  with width axis for condensed headlines, Instrument Serif italic; OFL).
  Scripted stylist-match quiz and booking concierge in `salon.js`. Menu prices
  are labeled as samples. Photos in `assets/images/concepts/salon-*.webp`
  (the comb's "Mason Pearson" brand text was painted out). Frames fall back to
  a labeled placeholder if an image is missing.
- Medspa concept built: `concepts/medspa/` ("Olea Spa & Skin Retreat", fictional;
  the owner rejected the earlier name "Sauge"). Written for the target reader: a
  woman around 55 looking for a retreat (comfort in swimwear, coming alone,
  never rushed, first-timer reassurance, larger text, no light-weight body type).
  Owner's direction (Nov 2026): high-end and experiential, not clinical. A spa
  is a day of luxury with treatments customized to skin, body and the kind of
  day you want; never "a plan". Two kinds of day: the Still Day (meditation
  centre, tranquil) and the Awake Day (invigorating body scrub); sauna, steam
  and red-light therapy in both. Hero: "Be still. Or come alive." Injectables
  kept only as one "Aesthetic consultation" line on the menu.
  White, stone, sage; Newsreader (light serif) + Manrope; fonts in
  `concepts/medspa/fonts/` (OFL). Rituals menu with sample prices; scripted
  "Design your day" (builds a timed itinerary), online booking and day
  concierge in `medspa.js` (health questions go to a therapist). Booking demo
  (`#reserve`, owner request Nov 2026): choose a day and guests, a date from the
  next 12 days and an arrival time (availability is made up), name and email,
  then a confirmation. Nothing is sent, saved or charged, and it says so.
  "Reserve this day" carries the designed day into the booking. No booking step
  may scroll the page (focus uses preventScroll). Photos (owner-approved):
  full-bleed hero `medspa-hero-*.webp` (shoulder, vase, sphere; copy on the
  wall behind a light veil), full-bleed band `medspa-band-*.webp` (figure under
  an arch), `medspa-room-1200.webp` (arch + olive tree), menu thumbnail
  `medspa-detail-600.webp` (hand, cropped above the chin). Visit section has
  no placeholders (directions sent on booking, hours, alone or together, what
  to bring). Approved by the owner (Nov 2026).
- Concept card scrolling (owner, Nov 2026): all cards scroll, about 30s linear
  for the full page on hover (`--scroll-time`), quick return on leave. The 9s
  original was too fast.
- Financial concept built: `concepts/financial/` ("Horizon Financial", fictional;
  founder "Nora Ellery, CFP"). Deep green, paper, gold; Fraunces + Inter in
  `concepts/financial/fonts/` (OFL); botanical line art. One file with nine
  "pages" switched by `showPage()` in `financial.js` (home, services, approach,
  fees, about, contact, resources, insights, one sample article). Scripted demo
  on the contact page: the intro-call form becomes the summary a planner would
  read before the call (meeting prompts only, never advice; nothing is sent).
  Origin and caution: adapted from the owner's older private demo on Netlify
  (project playful-dasik-de8141), which used a real, operating firm's identity.
  Everything identifying was changed (firm, adviser, email, city, founding year,
  fee, memberships, personal details) and the long tax article was cut to a
  short sample. Never restore those details, never copy that original into this
  public repo, and never show it publicly without the firm's written permission.
  Fee figure ($6,000) is labeled as a sample.
  Waiting on 3 photos generated in the owner's Canva: coast MAHbk-sEgnY ->
  `financial-coast-1200.webp` (4:3), desk MAHbkwxZHWA ->
  `financial-desk-1200.webp` (4:3), founder seen from behind MAHbkxjixX0 (slimmer version the owner asked for; first try was MAHbk4k6J5I) ->
  `financial-founder-1000.webp` (4:5), all in `assets/images/concepts/`. Until
  then the line-art panels show. Home card image `card-financial.webp` joins the
  home page and the contact page with the summary showing.
- Concepts left: wedding planner (owner decides).

## Preview
`python3 -m http.server 8000` from the repo root, then open `/styleguide.html`.

## Deploy
Planned: Netlify, publish directory = repo root, no build command.
- OWNER RULE: never deploy to, overwrite or change any existing Netlify project
  unless the owner explicitly names it. Their team has many projects, including
  "aglowstudios", which serves the LIVE aglowstudios.ai. Previews of this
  redesign go to their own new project only.
- Preview project (created for this redesign, Nov 2026): "aglow-redesign-preview",
  https://aglow-redesign-preview.netlify.app, site id
  ad7df9fa-3cd6-4dc5-9a30-377f8b749f4b. Requires Netlify team login to view.
  Not connected to Git: redeploy manually after changes. How: call the Netlify
  connector's deploy-site with that site id, then run the npx command it returns
  from the repo root with NODE_USE_ENV_PROXY=1 and
  NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt (hosts netlify-mcp.netlify.app
  and api.netlify.com are allowed in this environment). `netlify.toml`
  publishes the repo root with no build command.
- BEFORE ANY MERGE TO `main`: check in Netlify whether "aglowstudios" (live
  site) builds from this repo's `main` (Project configuration > Build & deploy >
  Continuous deployment). If it does, merging replaces the live site. Never
  merge to `main` without the owner's explicit go-ahead.
