// Pulls the latest Instagram posts and writes them into the site (downloaded
// images + a JSON manifest) so the homepage feed auto-updates. Runs in GitHub
// Actions on a schedule.
//
// Works with EITHER token type:
//   - Instagram Login token (graph.instagram.com/me/media)
//   - Facebook Graph token "EAA..." (finds the connected IG Business account
//     via the Facebook Page, then reads its media)
//
// Required env: IG_TOKEN   Optional env: IG_COUNT (default 9)
// Missing token => exits 0 quietly so the curated grid stays in place.

const fs = require('fs');
const path = require('path');

const TOKEN = process.env.IG_TOKEN;
const COUNT = parseInt(process.env.IG_COUNT || '9', 10);
const FIELDS = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp';
const GV = 'v21.0';
const IMG_DIR = path.join('assets', 'img', 'instagram');
const DATA = path.join('assets', 'data', 'instagram.json');

if (!TOKEN) {
  console.log('IG_TOKEN not set — leaving the curated grid in place.');
  process.exit(0);
}

async function getJson(url) {
  const r = await fetch(url);
  const body = await r.text();
  if (!r.ok) throw new Error(r.status + ' ' + body.slice(0, 300));
  return JSON.parse(body);
}

// Path A: Instagram Login token
async function viaInstagramLogin(token) {
  const j = await getJson(`https://graph.instagram.com/me/media?fields=${FIELDS}&limit=${COUNT}&access_token=${token}`);
  return j.data || [];
}

// Path B: Facebook Graph token (EAA...) -> Page -> connected IG Business account
async function viaFacebook(token) {
  const acc = await getJson(`https://graph.facebook.com/${GV}/me/accounts?fields=name,access_token,instagram_business_account&access_token=${token}`);
  const pages = acc.data || [];
  if (!pages.length) throw new Error('This token can see 0 Facebook Pages — it is missing the pages_show_list / business_management permission. Regenerate the token and grant Page + Instagram permissions.');
  const page = pages.find((p) => p.instagram_business_account);
  if (!page) throw new Error('Token CAN see Page(s): [' + pages.map((p) => p.name).join(', ') + '] but NONE has a connected Instagram Business account. Fix: in Meta Business Suite, connect your Instagram (set to Business) to the Page, then regenerate the token.');
  console.log('Connected OK via Facebook Page:', page.name);
  const igId = page.instagram_business_account.id;
  const pageToken = page.access_token || token;
  const j = await getJson(`https://graph.facebook.com/${GV}/${igId}/media?fields=${FIELDS}&limit=${COUNT}&access_token=${pageToken}`);
  return j.data || [];
}

async function main() {
  const order = TOKEN.startsWith('EAA') ? [viaFacebook, viaInstagramLogin] : [viaInstagramLogin, viaFacebook];
  let items = null, lastErr = null;
  for (const fn of order) {
    try { items = await fn(TOKEN); break; }
    catch (e) { lastErr = e; console.error('Attempt failed:', e.message); }
  }
  if (items === null) {
    console.error('Could not fetch Instagram media. Last error:', lastErr && lastErr.message);
    process.exit(1);
  }
  items = items.slice(0, COUNT);

  fs.mkdirSync(IMG_DIR, { recursive: true });
  fs.mkdirSync(path.dirname(DATA), { recursive: true });
  for (const f of fs.readdirSync(IMG_DIR)) {
    if (/^ig-\d+\.jpg$/.test(f)) fs.unlinkSync(path.join(IMG_DIR, f));
  }

  const out = [];
  let i = 0;
  for (const item of items) {
    const src = item.media_type === 'VIDEO' ? item.thumbnail_url : item.media_url;
    if (!src) continue;
    const imgRes = await fetch(src);
    if (!imgRes.ok) continue;
    i++;
    const name = `ig-${String(i).padStart(2, '0')}.jpg`;
    fs.writeFileSync(path.join(IMG_DIR, name), Buffer.from(await imgRes.arrayBuffer()));
    out.push({
      img: `assets/img/instagram/${name}`,
      permalink: item.permalink,
      caption: (item.caption || '').replace(/\s+/g, ' ').slice(0, 140),
      type: item.media_type,
    });
  }
  fs.writeFileSync(DATA, JSON.stringify(out, null, 2));
  console.log(`Wrote ${out.length} Instagram posts.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
