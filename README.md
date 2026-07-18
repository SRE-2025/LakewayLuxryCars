# Lakeway Luxury Car Suites — Website

A 20-page static marketing site (plain HTML/CSS/JS) for a luxury car-condo community in Lakeway, Texas. Built for lead generation with an interactive availability site plan.

**New here? Read `CLAUDE.md` first** — it's the full project brief (business model, design system, what's real vs placeholder, and the next tasks).

## Preview it locally
```bash
python3 -m http.server 8000
```
Open http://localhost:8000 — `index.html` is the home page.

## Edit it
- Shared header, footer, nav, and section templates live in `build.py`. Change them there, then run `python3 build.py` to regenerate all 20 pages.
- Brand colors and all styling: `assets/css/style.css` (tokens in `:root`).
- Behavior (nav, dropdowns, scroll reveal, FAQ, interactive site plan): `assets/js/main.js`.
- One-off text edits can be made directly in the individual `.html` files.

## Deploy (any of these — it's just static files)
- **GitHub Pages:** push to a repo → Settings → Pages → Deploy from branch `main`, folder `/root`.
- **Netlify:** drag the folder to app.netlify.com/drop, or connect the repo.
- **AWS:** upload to an S3 bucket behind CloudFront.

## Structure
```
*.html                 20 pages
build.py               regenerates all pages
assets/css/style.css   design system
assets/js/main.js      shared behavior
assets/img/            brand images (placeholders — replace with real photos)
CLAUDE.md              project brief for Claude Code
AUDIT-and-sitemap.md   deep audit of the 4 reference sites
KICKOFF-PROMPT.md      paste this into Claude Code to get started
```
