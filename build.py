# -*- coding: utf-8 -*-
import os
OUT = os.path.dirname(os.path.abspath(__file__))

FONTS = ('<link rel="preconnect" href="https://fonts.googleapis.com"/>'
 '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin/>'
 '<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Montserrat:wght@200;300;400;500;600;700&display=swap" rel="stylesheet"/>')

def head(title, desc):
    return ('<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"/>'
      '<meta name="viewport" content="width=device-width, initial-scale=1.0"/>'
      f'<title>{title} — Lakeway Luxury Car Suites</title>'
      f'<meta name="description" content="{desc}"/>'
      '<meta name="theme-color" content="#000000"/>'
      '<link rel="icon" type="image/png" href="assets/img/favicon.png"/>'
      f'{FONTS}<link rel="stylesheet" href="assets/css/style.css"/></head><body class="no-js">')

def header(active=''):
    def cls(g): return ' class="active"' if g==active else ''
    return f'''<header id="header"><div class="wrap nav">
  <a href="index.html" class="brand"><img src="assets/img/logo-mark.png" alt="Lakeway Luxury Car Suites"/><span class="brand-text">Lakeway<small>Luxury Car Suites</small></span></a>
  <nav class="nav-links" id="navLinks">
    <a href="index.html"{cls('home')}>Home</a>
    <span class="has-drop"><a href="residences.html"{cls('residences')}>Residences</a>
      <div class="drop">
        <a href="residences.html">All Residences</a>
        <div class="drop-sub">The Models</div>
        <a href="summit.html">The Summit — 6,000 sf</a>
        <a href="overlook.html">The Overlook — 4,500 sf</a>
        <a href="ranch.html">The Ranch — 3,000 sf</a>
        <a href="retreat.html">The Retreat — 2,250 sf</a>
        <a href="garage-suite.html">The Garage Suite — 1,500 sf</a>
        <div class="drop-sub">Buy</div>
        <a href="availability.html">Availability &amp; Site Plan</a>
        <a href="floor-plans.html">Floor Plans &amp; Elevations</a>
      </div></span>
    <span class="has-drop"><a href="features.html"{cls('ownership')}>Ownership</a>
      <div class="drop">
        <a href="features.html">Features &amp; Craftsmanship</a>
        <a href="amenities.html">Amenities</a>
        <a href="membership.html">Membership &amp; Benefits</a>
        <a href="reservation.html">Reservation &amp; Financing</a>
      </div></span>
    <span class="has-drop"><a href="community.html"{cls('community')}>Community</a>
      <div class="drop">
        <a href="community.html">Community &amp; Lifestyle</a>
        <a href="location.html">Location &amp; Hill Country</a>
        <a href="gallery.html">Design Gallery</a>
      </div></span>
    <a href="about.html"{cls('about')}>About</a>
    <a href="faq.html"{cls('faq')}>FAQ</a>
    <a href="contact.html" class="nav-cta">Contact</a>
  </nav>
  <button class="hamburger" id="hamburger" aria-label="Menu"><span></span><span></span><span></span></button>
</div></header>'''

FOOTER = '''<footer><div class="wrap">
  <div class="foot-top">
    <div class="foot-brand"><img src="assets/img/logo-mark.png" alt="Lakeway Luxury Car Suites"/><p>Private luxury automotive gallery residences in the Texas Hill Country. Live, work, and collect under one roof.</p></div>
    <div class="foot-col"><h4>Residences</h4><a href="residences.html">All Residences</a><a href="summit.html">The Summit</a><a href="overlook.html">The Overlook</a><a href="ranch.html">The Ranch</a><a href="retreat.html">The Retreat</a><a href="garage-suite.html">The Garage Suite</a></div>
    <div class="foot-col"><h4>Ownership</h4><a href="availability.html">Availability</a><a href="floor-plans.html">Floor Plans</a><a href="features.html">Features</a><a href="amenities.html">Amenities</a><a href="membership.html">Membership</a><a href="reservation.html">Reservation</a></div>
    <div class="foot-col"><h4>Explore</h4><a href="community.html">Community</a><a href="location.html">Location</a><a href="gallery.html">Gallery</a><a href="about.html">About</a><a href="faq.html">FAQ</a><a href="contact.html">Contact</a></div>
  </div>
  <div class="foot-bottom"><p>© 2026 Lakeway Luxury Car Suites. All Rights Reserved. · <a href="privacy.html" style="color:var(--muted)">Privacy Policy</a></p><div class="socials"><a href="#">Instagram</a><a href="#">Facebook</a><a href="#">LinkedIn</a></div></div>
  <p class="disclaimer">All images are representative photography and renderings and do not depict completed residences. Models, square footage, availability, pricing, phasing, and amenities are proposed only and subject to change without notice. The Developer reserves the right to modify features, layouts, and materials at any time. Square footage is approximate.</p>
</div></footer>
<script src="assets/js/main.js"></script></body></html>'''

# ---------- section helpers ----------
def hero(eyebrow,title,sub,img,actions='',short=True):
    cl='hero short' if short else 'hero'
    return f'''<section class="{cl}"><div class="hero-media"><img src="assets/img/{img}" alt=""/></div>
    <div class="wrap"><div class="hero-inner"><div class="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{sub}</p>{actions}</div></div></section>'''

def crumb(items):
    out=[]
    for i,(label,href) in enumerate(items):
        if href: out.append(f'<a href="{href}">{label}</a>')
        else: out.append(f'<span class="cur">{label}</span>')
        if i<len(items)-1: out.append('<span class="sep">/</span>')
    return f'<nav class="breadcrumb"><div class="wrap">{"".join(out)}</div></nav>'

def split(eyebrow,title,paras,img,reverse=False,btn=None,border=False):
    r=' reverse' if reverse else ''
    b=f'<a href="{btn[1]}" class="btn">{btn[0]}</a>' if btn else ''
    ps=''.join(f'<p>{p}</p>' for p in paras)
    st=' style="border-top:1px solid var(--line)"' if border else ''
    return f'''<section class="split{r}"{st}><div class="split-media"><img src="assets/img/{img}" alt=""/></div>
    <div class="split-copy reveal"><div class="eyebrow">{eyebrow}</div><h2 class="section-title">{title}</h2>{ps}{b}</div></section>'''

def cards(eyebrow,title,lead,items,cols=3,bg=False):
    st=' style="background:var(--near-black);border-top:1px solid var(--line)"' if bg else ''
    head=f'<div class="center reveal" style="max-width:700px;margin:0 auto 60px"><div class="star-rule"><span>★</span></div><div class="eyebrow center">{eyebrow}</div><h2 class="section-title">{title}</h2>'
    head+= (f'<p class="lede" style="margin:18px auto 0">{lead}</p>' if lead else '')+'</div>'
    grid='grid2' if cols==2 else 'grid3'
    cs=''.join(f'<div class="card reveal"><div class="num">{n}</div><h3>{h}</h3><p>{p}</p></div>' for n,h,p in items)
    return f'<section class="section"{st}><div class="wrap">{head}<div class="{grid}">{cs}</div></div></section>'

def stats(items):
    ss=''.join(f'<div class="stat"><div class="n">{n}</div><div class="l">{l}</div></div>' for n,l in items)
    return f'<section class="stats reveal">{ss}</section>'

def gallery(imgs):
    figs=''.join(f'<figure class="{c}"><img src="assets/img/{im}" alt=""/></figure>' for im,c in imgs)
    return f'<section class="section center"><div class="wrap"><div class="gal-grid reveal">{figs}</div></div></section>'

def cta(eyebrow,title,p,label,href,img):
    return f'''<section class="cta-band"><div class="bg"><img src="assets/img/{img}" alt="" aria-hidden="true"/></div>
    <div class="inner reveal"><div class="eyebrow center">{eyebrow}</div><h2>{title}</h2><p>{p}</p><a href="{href}" class="btn btn-solid">{label}</a></div></section>'''

def write(name, *parts):
    with open(os.path.join(OUT,name),'w',encoding='utf-8') as f:
        f.write(''.join(parts))

# ---------- model data ----------
MODELS=[
 dict(slug='summit',name='The Summit',tier='Flagship Residence',sqft='6,000 sf + mezzanine',cars='10–12 cars + full living level',ceiling='28 ft',power='250 AMP + generator',price='From $2,150,000',img='lineup.jpg',avail='1 available now',idx='01',
   blurb='The pinnacle footprint — maximum volume, presence, and living space for the most serious collections.',
   long=['The Summit is the flagship of the Lakeway collection: a two-story, 6,000-square-foot residence engineered to display a significant collection and host at scale. Twenty-eight-foot clear heights leave room for stacked lifts, a mezzanine, and the drama a great car deserves.',
     'Above the gallery sits a full living level — kitchen, lounge, and terrace — turning the suite into a genuine second home and a prestigious business address. Finish it to taste with our design team, from display lighting to bar and bath.']),
 dict(slug='overlook',name='The Overlook',tier='Signature Suite',sqft='4,500 sf + mezzanine',cars='8–10 cars + living',ceiling='26 ft',power='200 AMP + generator',price='From $1,650,000',img='dream-car.jpg',avail='2 available now',idx='02',
   blurb='Room to display, work, and entertain with streamlined, lock-and-leave ease.',
   long=['The Overlook balances serious gallery space with the effortless, lock-and-leave ownership collectors want. A finished mezzanine overlooks the floor, ideal for a lounge or office that keeps the cars always in view.',
     'A confident step up in space and capability, it suits the owner who wants to host and work from the suite without the scale of the flagship.']),
 dict(slug='ranch',name='The Ranch',tier='Collector Suite',sqft='3,000 sf + mezzanine',cars='6–8 cars + mezzanine',ceiling='24 ft',power='200 AMP + generator',price='From $1,180,000',img='mclaren.jpg',avail='2 available now',idx='03',
   blurb='A balanced, efficient layout with meaningful gallery space and a finished mezzanine.',
   long=['The Ranch is the heart of the collection — an efficient, beautifully proportioned suite with real gallery space below and a finished mezzanine above for lounge or storage.',
     'It is the sweet spot for many owners: enough room for a curated collection and the amenities that make time in the suite a pleasure, without excess.']),
 dict(slug='retreat',name='The Retreat',tier='Garage Residence',sqft='2,250 sf + loft',cars='4–6 cars + loft',ceiling='22 ft',power='150 AMP + generator ready',price='From $895,000',img='ferrari.jpg',avail='3 available now',idx='04',
   blurb='A clean, private home base with thoughtful storage and a comfortable loft above.',
   long=['The Retreat is a refined, private home base — thoughtful storage below and a comfortable finished loft above. Everything close, secure, and effortlessly ready for the drive.',
     'It is the most accessible way into the community without compromising the standard: the same construction, security, and membership as every Lakeway residence.']),
 dict(slug='garage-suite',name='The Garage Suite',tier='Studio Residence',sqft='1,500 sf',cars='3–4 cars + studio',ceiling='20 ft',power='150 AMP',price='From $645,000',img='exterior.jpg',avail='Coming in Phase II',idx='05',
   blurb='Flexible luxury that blends modern architecture with premium utility.',
   long=['The Garage Suite is a flexible, single-level studio residence — clean architecture, premium finishes, and room for a tight, well-loved collection.',
     'Ideal as a first suite, a satellite space, or a focused single-marque showcase, it carries the full Lakeway standard in a compact footprint. Released in Phase II.']),
]
MBY={m['slug']:m for m in MODELS}

MARQUEE=('<div class="strip"><div class="strip-track">'
 +('<span>Deeded Ownership</span><span>Climate Controlled</span><span>24/7 Security</span><span>Hill Country</span><span>Live · Work · Collect</span><span>Concierge</span>'*2)
 +'</div></div>')

# ---------- 1. HOME ----------
home_actions='<div class="hero-actions"><a href="residences.html" class="btn btn-solid">View Residences</a><a href="availability.html" class="btn">See Availability</a></div>'
write('index.html',
  head('Private Automotive Gallery Residences in the Texas Hill Country','Own a private car-gallery residence in Lakeway, Texas — deeded live-work-collect suites from 1,500 to 6,000 sq ft in a gated Hill Country community.'),
  header('home'),
  hero('Lakeway · Texas Hill Country','Owning the car was <em>only the beginning.</em>',
    'Private car-gallery residences west of Austin — live, work, and collect under one roof, in a gated Hill Country community built for people who move differently.',
    'lineup.jpg', home_actions, short=False),
  MARQUEE,
  split('The Residences','Luxury found a <span class="gold">new address in Texas.</span>',
    ['Each residence pairs a private, climate-controlled car gallery with finished living space above — deeded real property, from 1,500 to 6,000 square feet.',
     'Five models across four buildings. Choose your model, then pick your exact unit on the live availability plan.'],
    'exterior.jpg', reverse=True, btn=('Explore the Residences','residences.html')),
  cards('Suite Features','Craftsmanship, from the slab up.','Every detail serves two masters: preserving the automobile, and deepening the pleasure of owning it.',
    [('01','Climate &amp; Preservation','Precision climate, humidity control, and battery tending keep every car concours-ready through a Texas summer and beyond.'),
     ('02','Fortress Security','Gated grounds, 24/7 monitoring, biometric entry, and per-suite alarms guard the irreplaceable.'),
     ('03','Bespoke Interiors','Lounges, lifts, bars, mezzanines, and museum-grade lighting — finished by our team to gallery standard.')], bg=True),
  stats([('5','Residence Models'),('28 ft','Clear Heights'),('24/7','Secured Access'),('100%','Deeded Ownership')]),
  split('Our Story','Built by Texans who <span class="gold">get it.</span>',
    ['For the true enthusiast, the hunt never ends with the keys. What follows is the search for a place to keep the car, share it, and live beside it.',
     'Lakeway Luxury Car Suites answers that: a private Hill Country destination where remarkable automobiles and the people who love them come together.'],
    'dream-car.jpg', btn=('Read Our Story','about.html')),
  cta('Founders Reservation','Secure your place in the <span class="gold">founding release.</span>',
    'A limited number of residences are available now at priority pre-sale pricing. Register for availability, pricing, and a private tour.',
    'Start Your Inquiry','contact.html','ferrari.jpg'),
  FOOTER)

# ---------- 2. RESIDENCES OVERVIEW ----------
rows=''
for m in MODELS:
    rows+=f'''<div class="model-row"><div class="model-media"><span class="idx">{m['idx']}</span><img src="assets/img/{m['img']}" alt="{m['name']}"/></div>
    <div class="model-copy reveal"><div class="eyebrow">{m['tier']}</div><h2 class="section-title">{m['name']}</h2>
    <div class="size">{m['sqft']}</div><p style="color:var(--muted)">{m['blurb']}</p>
    <div class="avail"><div><div class="n">{m['cars'].split(' ')[0]}</div><div class="l">Car Capacity</div></div><div><div class="n">{m['avail'].split(' ')[0]}</div><div class="l">{m['avail'][len(m['avail'].split(' ')[0])+1:]}</div></div></div>
    <a href="{m['slug']}.html" class="btn">Explore {m['name']}</a></div></div>'''
write('residences.html',
  head('The Residences','Five private car-gallery residence models at Lakeway, from the 1,500 sf Garage Suite to the 6,000 sf Summit flagship.'),
  header('residences'),
  crumb([('Home','index.html'),('Residences',None)]),
  hero('The Residences','Five models. <em>One standard.</em>',
    'Every residence pairs a private climate-controlled car gallery with finished living space above. Explore each model, then choose your unit.','mclaren.jpg'),
  f'<section class="section" style="padding-bottom:0"><div class="wrap center reveal" style="max-width:700px;margin:0 auto"><div class="star-rule"><span>★</span></div><div class="eyebrow center">Choose Your Model</div><h2 class="section-title">Room for every collection.</h2><p class="lede" style="margin:18px auto 40px">From a focused single-marque studio to a flagship built to host at scale — all deeded, all delivered turn-key.</p></div></section>',
  f'<section style="padding-bottom:0">{rows}</section>',
  cta('Availability','Ready to pick your <span class="gold">exact unit?</span>',
    'See the live site plan with available, reserved, and sold units across all four buildings.',
    'View Availability &amp; Site Plan','availability.html','lineup.jpg'),
  FOOTER)

# ---------- 3-7. MODEL PAGES ----------
def model_page(m):
    others=''.join(f'<a href="{o["slug"]}.html" class="btn btn-sm" style="margin:6px">{o["name"]}</a>' for o in MODELS if o['slug']!=m['slug'])
    specs=f'''<table class="spec-table">
      <tr><td class="k">Interior Area</td><td class="v">{m['sqft']}</td></tr>
      <tr><td class="k">Car Capacity</td><td class="v">{m['cars']}</td></tr>
      <tr><td class="k">Clear Height</td><td class="v">{m['ceiling']}</td></tr>
      <tr><td class="k">Power</td><td class="v">{m['power']}</td></tr>
      <tr><td class="k">Ownership</td><td class="v">Deeded real property</td></tr>
      <tr><td class="k">Pricing</td><td class="v gold">{m['price']}</td></tr>
      <tr><td class="k">Availability</td><td class="v">{m['avail']}</td></tr></table>'''
    longp=''.join(f'<p>{p}</p>' for p in m['long'])
    return ''.join([
      head(m['name'], f"{m['name']} at Lakeway — {m['sqft']}, {m['cars']}. {m['blurb']}"),
      header('residences'),
      crumb([('Home','index.html'),('Residences','residences.html'),(m['name'],None)]),
      hero(m['tier'], f"{m['name']}", m['blurb'], m['img']),
      f'''<section class="split"><div class="split-media"><img src="assets/img/{m['img']}" alt="{m['name']}"/></div>
      <div class="split-copy reveal"><div class="eyebrow">Overview</div><h2 class="section-title">{m['sqft']}</h2>{longp}
      <a href="contact.html?model={m['name'].replace(' ','+')}" class="btn btn-solid" style="margin-top:10px">Reserve This Residence</a></div></section>''',
      f'<section class="section" style="background:var(--near-black);border-top:1px solid var(--line)"><div class="wrap"><div class="center reveal" style="margin-bottom:40px"><div class="eyebrow center">Specifications</div><h2 class="section-title">The details.</h2></div><div style="max-width:720px;margin:0 auto" class="reveal">{specs}</div></div></section>',
      cards('Delivered With','Turn-key, to gallery standard.','',
        [('✦','Climate &amp; Power','Climate-controlled HVAC, heavy-amp service, and generator readiness — delivered ready for the collection.'),
         ('✦','Finished Shell','Insulated, finished drywall, sealed floor, and water service, with custom upgrade packages available.'),
         ('✦','Live–Work–Collect','A finished living level above the gallery: a business address and a private sanctuary in one.')]),
      gallery([('lineup.jpg','tall'),('ferrari.jpg','wide'),('mclaren.jpg',''),('dream-car.jpg','')]),
      f'<section class="section center" style="border-top:1px solid var(--line)"><div class="wrap reveal"><div class="eyebrow center">Compare</div><h2 class="section-title" style="margin-bottom:26px">Explore the other residences</h2><div>{others}</div></div></section>',
      cta('Reserve','Make <span class="gold">'+m['name']+'</span> yours.',
        'Place your unit on hold in the Founders Phase, or book a private tour of a finished residence.',
        'Reserve or Tour', f"contact.html?model={m['name'].replace(' ','+')}", m['img']),
      FOOTER])
for m in MODELS:
    write(f"{m['slug']}.html", model_page(m))

# ---------- 8. AVAILABILITY ----------
PLAN='''<svg class="plan-svg" id="plan" viewBox="0 0 640 522" role="group" aria-label="Interactive site plan">
<rect x="0" y="0" width="640" height="522" fill="#0c0c0c"></rect>
<text x="20" y="34" fill="#6a655c" font-size="12" letter-spacing="3" font-family="Montserrat">BUILDING A · THE SUMMIT</text>
<g class="unit available" data-id="A1"><rect x="20" y="46" width="294" height="90" rx="3"></rect><text class="u-label" x="167" y="97" text-anchor="middle">A1</text></g>
<g class="unit sold" data-id="A2"><rect x="326" y="46" width="294" height="90" rx="3"></rect><text class="u-label" x="473" y="97" text-anchor="middle">A2</text></g>
<text x="20" y="176" fill="#6a655c" font-size="12" letter-spacing="3" font-family="Montserrat">BUILDING B · THE OVERLOOK</text>
<g class="unit available" data-id="B1"><rect x="20" y="190" width="192" height="84" rx="3"></rect><text class="u-label" x="116" y="238" text-anchor="middle">B1</text></g>
<g class="unit reserved" data-id="B2"><rect x="224" y="190" width="192" height="84" rx="3"></rect><text class="u-label" x="320" y="238" text-anchor="middle">B2</text></g>
<g class="unit available" data-id="B3"><rect x="428" y="190" width="192" height="84" rx="3"></rect><text class="u-label" x="524" y="238" text-anchor="middle">B3</text></g>
<text x="20" y="314" fill="#6a655c" font-size="12" letter-spacing="3" font-family="Montserrat">BUILDING C · THE RANCH</text>
<g class="unit sold" data-id="C1"><rect x="20" y="328" width="142" height="80" rx="3"></rect><text class="u-label" x="91" y="373" text-anchor="middle">C1</text></g>
<g class="unit available" data-id="C2"><rect x="172" y="328" width="142" height="80" rx="3"></rect><text class="u-label" x="243" y="373" text-anchor="middle">C2</text></g>
<g class="unit reserved" data-id="C3"><rect x="324" y="328" width="142" height="80" rx="3"></rect><text class="u-label" x="395" y="373" text-anchor="middle">C3</text></g>
<g class="unit available" data-id="C4"><rect x="476" y="328" width="142" height="80" rx="3"></rect><text class="u-label" x="547" y="373" text-anchor="middle">C4</text></g>
<text x="20" y="426" fill="#6a655c" font-size="12" letter-spacing="3" font-family="Montserrat">BUILDING D · THE RETREAT</text>
<g class="unit available" data-id="D1"><rect x="20" y="440" width="142" height="66" rx="3"></rect><text class="u-label" x="91" y="478" text-anchor="middle">D1</text></g>
<g class="unit available" data-id="D2"><rect x="172" y="440" width="142" height="66" rx="3"></rect><text class="u-label" x="243" y="478" text-anchor="middle">D2</text></g>
<g class="unit reserved" data-id="D3"><rect x="324" y="440" width="142" height="66" rx="3"></rect><text class="u-label" x="395" y="478" text-anchor="middle">D3</text></g>
<g class="unit available" data-id="D4"><rect x="476" y="440" width="142" height="66" rx="3"></rect><text class="u-label" x="547" y="478" text-anchor="middle">D4</text></g>
</svg>'''
write('availability.html',
  head('Availability & Site Plan','Live availability plan for Lakeway Luxury Car Suites — select any unit across Buildings A–D to see size, capacity, and price.'),
  header('residences'),
  crumb([('Home','index.html'),('Residences','residences.html'),('Availability',None)]),
  hero('Availability &amp; Site Plan','Choose <em>your</em> address.','Tap any unit on the plan to see its residence, size, and price — then reserve it or book a private tour.','mclaren.jpg'),
  f'''<section class="section"><div class="wrap"><div class="suites-layout">
    <div class="siteplan reveal"><h3 class="serif">The Lakeway Collection — Buildings A–D</h3><div class="hint">Select a unit to view details</div>{PLAN}
    <div class="legend"><span><i class="a"></i>Available</span><span><i class="r"></i>Reserved</span><span><i class="s"></i>Sold</span></div></div>
    <aside class="suite-detail" id="suiteDetail" aria-live="polite"><div class="placeholder"><span class="big">Select a unit</span>Tap any unit on the plan to view details.</div></aside>
  </div></div></section>''',
  cards('Every Residence','Delivered ready. Owned outright.','',
    [('✦','Deeded Ownership','Own your suite as real property — an appreciating Hill Country asset, financing available through Texas partners.'),
     ('✦','Turn-Key Delivery','Climate HVAC, heavy-amp power, generator readiness, water, and finished shell — custom upgrades on request.'),
     ('✦','Live–Work–Collect','Finished living space above the gallery: a business address and a private sanctuary in one.')], bg=True),
  cta('How to Reserve','Secure your unit in the <span class="gold">Founders Phase.</span>',
    'Schedule a site visit, review the reservation packet, and place your unit on hold. Reservations are prioritized in the order received.',
    'Start Your Reservation','reservation.html','lineup.jpg'),
  FOOTER)

# ---------- 9. FLOOR PLANS ----------
fp_rows=''
for m in MODELS:
    fp_rows+=f'''<div class="model-row"><div class="model-media"><span class="idx">{m['idx']}</span><img src="assets/img/{m['img']}" alt=""/></div>
    <div class="model-copy reveal"><div class="eyebrow">{m['tier']}</div><h2 class="section-title">{m['name']}</h2><div class="size">{m['sqft']}</div>
    <p style="color:var(--muted)">Ground-level gallery with {m['cars']}, {m['ceiling']} clear height{', plus a finished level above' if 'mezz' in m['cars'] or 'loft' in m['cars'] or 'living' in m['cars'] else ''}. Detailed elevations and plan sets are provided in the reservation packet.</p>
    <a href="{m['slug']}.html" class="btn" style="margin-right:10px">View {m['name']}</a><a href="contact.html?model={m['name'].replace(' ','+')}" class="btn">Request Plan Set</a></div></div>'''
write('floor-plans.html',
  head('Floor Plans & Elevations','Floor plans and elevations for each Lakeway residence model, from the 1,500 sf Garage Suite to the 6,000 sf Summit.'),
  header('residences'),
  crumb([('Home','index.html'),('Residences','residences.html'),('Floor Plans',None)]),
  hero('Floor Plans &amp; Elevations','Designed around <em>the drive.</em>','Every model is engineered for volume, flexibility, and presence. Full plan sets and elevations are included in the reservation packet.','exterior.jpg'),
  f'<section style="padding-bottom:0">{fp_rows}</section>',
  cta('Customization','Make the plan <span class="gold">your own.</span>',
    'Lifts, lounges, baths, mezzanines, and display lighting — our design team tailors each residence to your collection.',
    'Talk to Design','contact.html','dream-car.jpg'),
  FOOTER)

# ---------- 10. FEATURES ----------
write('features.html',
  head('Features & Craftsmanship','Climate control, fortress security, bespoke interiors, concierge, and deeded ownership — the craftsmanship behind every Lakeway residence.'),
  header('ownership'),
  crumb([('Home','index.html'),('Ownership','features.html'),('Features',None)]),
  hero('Features &amp; Craftsmanship','Craftsmanship, <em>from the slab up.</em>','Every decision serves two masters: preserving the automobile, and deepening the pleasure of owning it.','ferrari.jpg'),
  cards('Suite Features','The essentials, done right.','',
    [('01','Climate &amp; Preservation','Precision temperature and humidity control, filtered air, and battery tending keep every car concours-ready.'),
     ('02','Fortress Security','Gated grounds, 24/7 monitored surveillance, biometric entry, and individual suite alarms.'),
     ('03','Bespoke Interiors','Lounges, four-post lifts, bars, mezzanines, and museum-grade display lighting, finished by our team.'),
     ('04','Concierge &amp; Detailing','On-site detailing, transport, fuel and startup service, and white-glove concierge.'),
     ('05','The Members Community','A private circle of Texas collectors — curated drives, track days, and gatherings.'),
     ('06','Deeded Ownership','Own your suite outright as real property — an appreciating Hill Country asset.')]),
  split('Architecture','Engineered for the <span class="gold">Hill Country.</span>',
    ['Steel-and-stone construction, oversized glass bay doors, and clear heights to 28 feet give room for lifts, mezzanines, and drama.',
     'Landscaped grounds, paved motor courts, and long sightlines make arriving as satisfying as the drive out.'],
    'exterior.jpg', reverse=True, btn=('See the Amenities','amenities.html'), border=True),
  stats([('28 ft','Clear Heights'),('6,000 sf','Largest Residence'),('250','Amp Service'),('365','Days Climate Controlled')]),
  cta('See It','Come see the <span class="gold">craftsmanship</span> in person.','Book a private walkthrough of the grounds and a finished residence.','Request a Private Tour','contact.html','dream-car.jpg'),
  FOOTER)

# ---------- 11. AMENITIES ----------
AM=[('01','The Owners Club','A members-only clubhouse for hosting, meetings, and unwinding — the heart of the community, appointed to the same standard as the residences.'),
    ('02','Resort-Style Grounds','Landscaped Hill Country grounds, shaded motor courts, and gathering space designed for cars-and-coffee mornings and evening events.'),
    ('03','Concierge Service','Detailing, transport coordination, fuel and startup, and trusted specialist referrals — handled, so you only enjoy the drive.'),
    ('04','Catering &amp; Event Kitchen','A full prep kitchen supporting private chefs, curated dinners, and elevated gatherings without leaving the property.'),
    ('05','Secure Smart Access','Gated entry, 24/7 monitoring, and smart access control across the community and every private suite.'),
    ('06','EV &amp; Startup Ready','Integrated EV charging and battery maintenance keep every vehicle — classic or electric — ready to roll.')]
am_html=''.join(f'<div class="amenity reveal"><div class="an">{n}</div><div><h3>{h}</h3><p>{p}</p></div></div>' for n,h,p in AM)
write('amenities.html',
  head('Amenities','The owners club, concierge, secured grounds, and community amenities at Lakeway Luxury Car Suites.'),
  header('ownership'),
  crumb([('Home','index.html'),('Ownership','features.html'),('Amenities',None)]),
  hero('Amenities','More than a place <em>to park.</em>','Ownership reaches well beyond four walls — into a community and a set of services built around the way collectors actually live.','lineup.jpg'),
  f'<section class="section"><div class="wrap" style="max-width:900px">{am_html}</div></section>',
  cta('Membership','Every residence includes <span class="gold">the community.</span>','See the full slate of owner benefits and how membership works.','Explore Membership','membership.html','ferrari.jpg'),
  FOOTER)

# ---------- 12. MEMBERSHIP ----------
write('membership.html',
  head('Membership & Owner Benefits','Ownership at Lakeway includes membership in a private community of Texas collectors — curated drives, events, concierge, and priority access.'),
  header('ownership'),
  crumb([('Home','index.html'),('Ownership','features.html'),('Membership',None)]),
  hero('Members Only','Belonging, <em>included.</em>','An address is where it starts. What keeps owners here is the company they keep — a private circle of Texas collectors.','ferrari.jpg'),
  cards("What's Included",'More than ownership.','Every Lakeway residence includes membership in the community.',
    [('01','Curated Drives','Members-only Hill Country routes, sunrise runs, and seasonal rallies through some of Texas’s best driving country.'),
     ('02','Private Events','Cars &amp; coffee, marque nights, catered dinners, and off-site experiences built around the collection.'),
     ('03','Concierge Service','Detailing, transport, startup and fueling, and trusted specialist referrals — a call away.'),
     ('04','The Owners Lounge','A shared members’ space to host, unwind, and talk shop with people who understand the obsession.'),
     ('05','Priority Access','First look at future phases and residences before they are released to the public.'),
     ('06','A Real Network','Buy, sell, and discover among fellow owners — a trusted circle for the cars and the connections.')]),
  cta('Sign In. Start Up.','Membership begins with <span class="gold">ownership.</span>','Register to learn more about joining the founding circle.','Request Membership Details','contact.html','lineup.jpg'),
  FOOTER)

# ---------- 13. RESERVATION ----------
STEPS=[('1','Schedule a Private Site Visit','Tour the grounds and a finished residence with our team, and talk through the models, buildings, and available units.'),
   ('2','Select Your Unit','Choose your model and exact unit on the live site plan. We confirm availability, pricing, and any customization you have in mind.'),
   ('3','Review the Reservation Packet','You receive the full packet — plans, elevations, specifications, pricing, and terms — to review with your advisors.'),
   ('4','Place Your Unit on Hold','Submit your reservation with earnest money to secure the unit. Reservations are prioritized in the order received.'),
   ('5','Financing &amp; Closing','Work with our Texas private-lending partners or close in cash. We coordinate through to a smooth closing and delivery.')]
steps_html=''.join(f'<div class="step reveal"><div class="sn">{n}</div><div><h3>{h}</h3><p>{p}</p></div></div>' for n,h,p in STEPS)
write('reservation.html',
  head('Reservation Process & Financing','How to reserve a residence at Lakeway — site visit, unit selection, reservation packet, earnest money, and Texas-based financing.'),
  header('ownership'),
  crumb([('Home','index.html'),('Ownership','features.html'),('Reservation',None)]),
  hero('Reservation &amp; Financing','A clear path <em>to ownership.</em>','The Founders Reservation Phase is open — a limited release at priority pre-sale pricing. Here is how it works.','dream-car.jpg'),
  f'<section class="section"><div class="wrap"><div class="center reveal" style="margin-bottom:44px"><div class="eyebrow center">The Process</div><h2 class="section-title">Five steps.</h2></div><div class="steps" style="max-width:820px;margin:0 auto">{steps_html}</div></div></section>',
  split('Financing','Texas lending, <span class="gold">made simple.</span>',
    ['We have partnered with Texas-based private lending groups to offer competitive financing for qualified buyers, alongside cash purchase.',
     'Loan qualification and earnest-money confirmation are part of securing a unit — our team guides you through each step.'],
    'exterior.jpg', reverse=True, border=True, btn=('View Availability','availability.html')),
  cta('Get Started','Begin your <span class="gold">reservation</span> today.','Tell us what you drive and what you are looking for, and we will send availability, pricing, and a tour.','Start Your Reservation','contact.html','lineup.jpg'),
  FOOTER)

# ---------- 14. COMMUNITY ----------
write('community.html',
  head('Community & Lifestyle','A private community of Texas collectors at Lakeway — drives, events, and a shared culture around the cars.'),
  header('community'),
  crumb([('Home','index.html'),('Community','community.html'),('Community &amp; Lifestyle',None)]),
  hero('Community &amp; Lifestyle','The people make <em>the place.</em>','A residence is where it begins. What owners come back for is the company — a private circle that speaks the same language.','mclaren.jpg'),
  split('The Culture','A shared <span class="gold">obsession.</span>',
    ['Lakeway is built around the simple truth that cars are better shared. Owners gather for morning coffee runs, marque nights, and long Hill Country drives.',
     'It is a community of collectors, entrepreneurs, and enthusiasts — discreet, welcoming, and genuinely into the machines.'],
    'dream-car.jpg'),
  cards('Life at Lakeway','What the calendar looks like.','',
    [('01','Cars &amp; Coffee','Relaxed weekend mornings on the motor court, collections out, conversation easy.'),
     ('02','Hill Country Drives','Curated routes through some of the best driving roads in Texas, run by members.'),
     ('03','Marque Nights &amp; Dinners','Catered evenings and marque celebrations hosted in the owners club.')], bg=True),
  cta('Join','Come see where you <span class="gold">belong.</span>','Book a visit and feel the community for yourself.','Request a Private Tour','contact.html','ferrari.jpg'),
  FOOTER)

# ---------- 15. LOCATION ----------
write('location.html',
  head('Location — Lakeway & the Hill Country','Lakeway, Texas — minutes from Austin in the heart of the Hill Country, near Lake Travis.'),
  header('community'),
  crumb([('Home','index.html'),('Community','community.html'),('Location',None)]),
  hero('Location','Lakeway, <em>Texas Hill Country.</em>','Minutes west of Austin, wrapped in Hill Country calm and close to Lake Travis — a setting as considered as the residences.','exterior.jpg'),
  split('The Setting','Where the city <span class="gold">meets the hills.</span>',
    ['Lakeway sits in the rolling Texas Hill Country just west of Austin — big skies, long views, and open roads, yet close to everything the city offers.',
     'It is one of the most desirable addresses in Central Texas: private and green, minutes from downtown, dining, and the shores of Lake Travis.'],
    'dream-car.jpg', reverse=True),
  stats([('~25 min','From Downtown Austin'),('Lake Travis','Minutes Away'),('Hill Country','Open Roads'),('ABIA','~35 min to Airport')]),
  cta('Visit','See the setting <span class="gold">for yourself.</span>','Directions and private tours are arranged through our sales team.','Plan a Visit','contact.html','lineup.jpg'),
  FOOTER)

# ---------- 16. GALLERY ----------
write('gallery.html',
  head('Design Gallery','A look inside Lakeway Luxury Car Suites — architecture, the machines, and the Hill Country setting.'),
  header('community'),
  crumb([('Home','index.html'),('Community','community.html'),('Gallery',None)]),
  hero('Design Gallery','A destination worthy of <em>the drive.</em>','The architecture, the machines, and the Hill Country light that makes Lakeway feel less like storage and more like home.','lineup.jpg'),
  gallery([('mclaren.jpg','tall'),('lineup.jpg','wide'),('ferrari.jpg',''),('exterior.jpg',''),('dream-car.jpg','wide'),('exterior.jpg','tall'),('ferrari.jpg','wide')]),
  f'<section class="center" style="padding-bottom:80px"><div class="wrap"><p class="lede" style="margin:0 auto">Photography and renderings are representative. Real residence and site imagery is added as each phase completes.</p></div></section>',
  cta('In Person','Photos only go <span class="gold">so far.</span>','Book a private tour and experience the scale and finishes for yourself.','Request a Private Tour','contact.html','dream-car.jpg'),
  FOOTER)

# ---------- 17. ABOUT ----------
write('about.html',
  head('About / Our Story','A private automotive residence community in the Texas Hill Country, built by collectors for collectors.'),
  header('about'),
  crumb([('Home','index.html'),('About',None)]),
  hero('Our Story','Where the car <em>comes home.</em>','A private automotive residence community in the Texas Hill Country, built by collectors who know the keys were never the finish line.','exterior.jpg'),
  split('The Idea','A home for the <span class="gold">machines you love.</span>',
    ['Most garages are an afterthought. We started with the opposite question: what would a space look like if the car — and the hours you spend with it — actually mattered?',
     'The answer is Lakeway: deeded automotive residences finished to gallery standard, minutes from Austin, wrapped in Hill Country calm.'],
    'dream-car.jpg'),
  split('The Approach','Rare by <span class="gold">design.</span>',
    ['We build in deliberate, limited phases. The founding residences release first; as they find owners, the next are built — so the community stays small and the standard stays high.',
     'Quality before quantity. Owners before units. It is a different way to grow, and it is the whole point.'],
    'lineup.jpg', reverse=True, border=True, btn=('View the Founders Release','availability.html')),
  stats([('Lakeway','Texas Hill Country'),('~25 min','From Austin'),('Phase I','Founders Release'),('Deeded','Real Property')]),
  cta('Come See It','The best way to understand Lakeway is to <span class="gold">stand in it.</span>','Schedule a private tour of the grounds and a finished residence.','Request a Private Tour','contact.html','mclaren.jpg'),
  FOOTER)

# ---------- 18. FAQ ----------
FAQ=[('What exactly am I buying?','A deeded car-gallery residence — real property you own outright, not a lease or storage rental. Each suite pairs a private climate-controlled gallery with finished living space above.'),
 ('What sizes are available?','Five models from roughly 1,500 sf (The Garage Suite) to 6,000 sf (The Summit flagship), holding from 3–4 up to 10–12 cars. See the Residences pages for each.'),
 ('How much does a residence cost?','Pricing in the Founders Phase starts in the mid-six figures and varies by model, building, level, and configuration. Current figures are shown on each model page; contact us for the latest.'),
 ('Is financing available?','Yes. We have partnered with Texas-based private lending groups to offer competitive financing for qualified buyers, alongside cash purchase.'),
 ('Can I live in my residence?','The suites are designed as live–work–collect spaces with finished living areas. Residency and use are subject to local zoning and community rules — our team will walk you through the specifics.'),
 ('How do I reserve a unit?','Schedule a site visit, choose your unit on the site plan, review the reservation packet, and place the unit on hold with earnest money. Reservations are prioritized in the order received.'),
 ('What is delivered with the suite?','Climate-controlled HVAC, heavy-amp power, generator readiness, water, and a finished shell — with custom upgrade packages available for lifts, lounges, baths, and lighting.'),
 ('Does ownership include the community?','Yes — every residence includes membership in the Lakeway community, with curated drives, events, concierge service, and access to the owners club.')]
faq_html=''.join(f'<div class="faq-item reveal"><button class="faq-q">{q}</button><div class="faq-a"><p>{a}</p></div></div>' for q,a in FAQ)
write('faq.html',
  head('FAQ','Answers to common questions about owning a car-gallery residence at Lakeway — pricing, sizes, financing, reservations, and delivery.'),
  header('faq'),
  crumb([('Home','index.html'),('FAQ',None)]),
  hero('Questions','Good questions, <em>answered.</em>','Everything owners typically ask — and if yours is not here, we are a message away.','ferrari.jpg'),
  f'<section class="section"><div class="wrap"><div class="faq">{faq_html}</div></div></section>',
  cta('Still Curious','Let’s get you the <span class="gold">specifics.</span>','Send us your questions and we will follow up with availability, pricing, and a tour.','Contact the Team','contact.html','dream-car.jpg'),
  FOOTER)

# ---------- 19. CONTACT ----------
CONTACT_FORM='''<section class="section" style="padding-top:calc(var(--nav-h) + 70px)"><div class="wrap contact-grid">
  <div class="contact-info reveal"><div class="eyebrow">Let's Connect</div><h2 class="section-title">Register to learn more.</h2>
    <p>Residences are released in limited numbers. Share a few details and our team will follow up with availability, pricing, and a private tour of the grounds.</p>
    <span class="contact-line"><span class="k">Email</span><span class="v">info@lakewayluxurycarsuites.com</span></span>
    <span class="contact-line"><span class="k">Sales Inquiries</span><span class="v">+1 (512) 555‑0123</span></span>
    <span class="contact-line"><span class="k">Location</span><span class="v">Lakeway · Texas Hill Country</span></span></div>
  <form id="contactForm" class="reveal">
    <div class="two"><div class="field"><label for="fn">First Name</label><input id="fn" required/></div><div class="field"><label for="ln">Last Name</label><input id="ln" required/></div></div>
    <div class="two"><div class="field"><label for="em">Email</label><input id="em" type="email" required/></div><div class="field"><label for="ph">Phone</label><input id="ph" type="tel"/></div></div>
    <div class="field"><label for="ty">Type of Inquiry</label><select id="ty"><option>Purchasing a Residence</option><option>Membership</option><option>Private Tour</option><option>Future Phases / Waitlist</option><option>Commercial / Partnership</option></select></div>
    <div class="field"><label for="msg">Message</label><textarea id="msg" rows="3" placeholder="I'm interested in more information about..."></textarea></div>
    <button type="submit" class="btn btn-solid" style="justify-self:start">Submit Inquiry</button>
    <p class="form-note" id="formNote">Founders Release now available. Pricing varies by model, building, and configuration.</p>
  </form></div></section>'''
write('contact.html',
  head('Contact','Register to learn more about owning a car-gallery residence at Lakeway — availability, pricing, and private tours.'),
  header('contact'),
  crumb([('Home','index.html'),('Contact',None)]),
  CONTACT_FORM, FOOTER)

# ---------- 20. PRIVACY ----------
PRIV=[('Overview','This Privacy Policy explains how Lakeway Luxury Car Suites collects, uses, and protects the information you provide through this website. By using the site or submitting an inquiry, you agree to the practices described here.'),
 ('Information We Collect','We collect information you voluntarily provide — such as your name, email, phone number, and message — when you submit an inquiry or reservation request. We may also collect standard, non-identifying analytics such as pages visited and device type.'),
 ('How We Use It','We use your information solely to respond to your inquiry, share availability and pricing, arrange tours, and communicate about the community. We do not sell your personal information.'),
 ('Sharing','We may share information with service providers who help us operate the site and manage sales inquiries, under confidentiality obligations, and where required by law.'),
 ('Your Choices','You may request access to, correction of, or deletion of your information, and you may opt out of communications at any time by contacting us.'),
 ('Contact','Questions about this policy can be directed to info@lakewayluxurycarsuites.com.')]
priv_html=''.join(f'<h3 class="serif" style="font-size:24px;color:var(--gold-light);margin:34px 0 10px">{h}</h3><p style="color:var(--muted);margin-bottom:14px">{p}</p>' for h,p in PRIV)
write('privacy.html',
  head('Privacy Policy','Privacy Policy for the Lakeway Luxury Car Suites website.'),
  header(''),
  crumb([('Home','index.html'),('Privacy Policy',None)]),
  f'<section class="section" style="padding-top:calc(var(--nav-h) + 70px)"><div class="wrap" style="max-width:820px"><div class="eyebrow">Legal</div><h1 class="section-title" style="margin-bottom:10px">Privacy Policy</h1><p style="color:var(--faint);font-size:13px;margin-bottom:20px">Last updated: July 2026</p>{priv_html}</div></section>',
  FOOTER)

print("ALL 20 PAGES WRITTEN")
