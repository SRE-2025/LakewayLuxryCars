# CLAUDE.md — Lakeway Luxury Car Suites Website

This file briefs Claude Code on the project. Read it fully before making changes.

## What this is
A 20-page marketing website for **Lakeway Luxury Car Suites** — a luxury **car-condo / gallery-residence community** in Lakeway, Texas (Hill Country, ~25 min west of Austin, near Lake Travis). Owners buy a deeded private car gallery with finished living space above ("live–work–collect"). It is a pre-sale / reservation-phase site whose job is **lead generation**.

## Business model (important context)
- Units are sold in limited **phases**: sell the current release, then build more. Copy uses a "Founders Reservation Phase" framing.
- The owner (agency operator) wants the site **hand-coded and owner-managed** so the end client depends on them for edits (a monthly retainer model). Do **not** move this to WordPress/Elementor or a CMS the client can self-edit.

## Tech stack
- **Plain static multi-page HTML + one shared CSS + one shared JS.** No framework, no build tooling required to run.
- Pages are **generated** by `build.py` (Python 3 + Pillow only used for image prep, not required to run the site). `build.py` writes all 20 `.html` files from shared header/footer/section helpers, so **structural/nav/footer changes should be made in `build.py` and regenerated** with `python3 build.py`. One-off content tweaks can be made directly in the HTML.
- Deploys as-is to **GitHub Pages, Netlify, or AWS S3+CloudFront** — it is just static files; `index.html` is the entry point.

## Run / preview locally
```bash
cd <this folder>
python3 -m http.server 8000
# open http://localhost:8000  (Claude Code can view this live while iterating)
```

## Project structure
```
index.html ... contact.html   # 20 pages (see sitemap below)
build.py                       # regenerates all pages (edit shared parts here)
assets/css/style.css           # full design system (brand tokens at top under :root)
assets/js/main.js              # nav, dropdowns, scroll reveal, FAQ, interactive site plan
assets/img/                    # 6 brand images (see "Assets" — currently reused as placeholders)
AUDIT-and-sitemap.md           # deep audit of the 4 reference sites
```

## The 20 pages (sitemap)
Home · Residences (overview) · **5 model pages** (summit, overlook, ranch, retreat, garage-suite) · Availability & Site Plan (interactive) · Floor Plans · Features · Amenities · Membership · Reservation & Financing · Community · Location · Gallery · About · FAQ · Contact · Privacy.
Nav groups: Home · Residences ▾ · Ownership ▾ · Community ▾ · About · FAQ · Contact. Every internal link resolves (verified: 918 links, 0 broken, 0 orphan pages).

## Brand / design system (in `:root` of style.css)
- Gold `#c9a24b` (light `#e2c987`), near-black `#0a0a0a`, off-white `#f4f2ee`.
- Fonts: **Cormorant Garamond** (serif headings) + **Montserrat** (sans body).
- Logo: `assets/img/logo-mark.png` (gold "L" mark). Cinematic black/gold luxury aesthetic modeled on the reference sites.

## Reference sites (see AUDIT-and-sitemap.md for the deep dive)
1. collection-suites.com — Miami/Palm Beach collector suites (original design reference).
2. concoursdelegancetexas.com — Lake Travis car-condo community; named models + site plan (R/S) + reservation phase. **Closest business model.**
3. t11carcondos.com — COTA car condos; per-model detail pages + owner benefits (drove the 20-page architecture).
4. OneHome portal listing — the ACTUAL property. **Locked behind login; could not be accessed. Real photos + facts must come from the owner.**

## ⚠️ What is REAL vs PLACEHOLDER (fix before launch)
- **Images:** only 6 brand images exist (logo + 5 photos), reused across pages. **Real property/renderings not yet provided** — get them from the owner / OneHome listing and replace files in `assets/img/` (keep the same filenames or update refs in `build.py`).
- **Unit data:** model names (Summit/Overlook/Ranch/Retreat/Garage Suite), square footages, prices, availability counts, and the A–D site plan are **invented placeholders**. Replace with the owner's real models, sizes, prices, and building layout. Model data lives in `build.py` (`MODELS`) and the site plan in `assets/js/main.js` (`SUITES`) + `availability.html` SVG.
- **Contact info:** `info@lakewayluxurycarsuites.com`, `+1 (512) 555-0123`, and social links are placeholders.
- **Contact form:** front-end only (shows a thank-you). Wire to a backend — Formspree/Basin (fastest) or AWS API Gateway + Lambda + SES.

## Suggested next tasks for Claude Code
1. Run a local server and confirm all 20 pages render and link correctly.
2. Replace placeholder images with the owner's real photos/renderings.
3. Replace placeholder unit models, sizes, prices, and site plan with real data.
4. Set real contact details + social links.
5. Wire the contact form to a working backend.
6. Add a favicon set, sitemap.xml, robots.txt, and per-page Open Graph images.
7. Deploy (GitHub Pages / Netlify / AWS) and connect the custom domain.

## Conventions
- Keep it static and owner-managed (no CMS).
- Regenerate via `build.py` for anything touching nav/footer/shared sections; keep the 918-link integrity (no dead links).
- Maintain the black/gold luxury aesthetic and the exact brand hex values.
