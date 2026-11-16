# CLAUDE.md

## Project
Redesign of the owner's business website. Static site: plain HTML, CSS, JS. No framework, no build step, no npm.

## Conventions
- Colors, fonts, spacing are CSS variables in `:root` in `styles.css`. Change tokens there, not inline.
- Mobile-first; must work at 375px wide with no horizontal scroll.
- Images go in `assets/images/`; always set `alt` text and width/height.
- Keep copy placeholders obvious ("Placeholder") until real copy is supplied. Never invent business facts (prices, addresses, testimonials).

## Preview
`python3 -m http.server 8000` from the repo root.

## Deploy
Planned: Netlify, publish directory = repo root, no build command.
