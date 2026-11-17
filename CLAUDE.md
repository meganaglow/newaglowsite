# CLAUDE.md

## Project
Redesign of aglowstudios.ai (Aglow Studios): AI-enabled websites for businesses
that serve people face to face (salons, medspas, planners, nonprofits).
Static site: plain HTML, CSS, JS. No framework, no build step, no npm.

## Design
- `DESIGN.md` is the source of truth for the look ("Evening glow": luxurious,
  elegant, layered). Read it before building or changing any page.
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

## Preview
`python3 -m http.server 8000` from the repo root, then open `/styleguide.html`.

## Deploy
Planned: Netlify, publish directory = repo root, no build command.
