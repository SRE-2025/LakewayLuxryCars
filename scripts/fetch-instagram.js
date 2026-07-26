// Pulls the latest Instagram posts via the official Instagram Graph API and
// writes them into the site (downloaded images + a JSON manifest) so the
// homepage feed auto-updates. Designed to run in GitHub Actions on a schedule.
//
// Required env:
//   IG_TOKEN   — long-lived Instagram access token (stored as a repo secret)
// Optional env:
//   IG_COUNT   — how many posts to show (default 9)
//
// If IG_TOKEN is missing it exits quietly (0) so the site keeps its curated grid.

const fs = require('fs');
const path = require('path');

const TOKEN = process.env.IG_TOKEN;
const COUNT = parseInt(process.env.IG_COUNT || '9', 10);
const IMG_DIR = path.join('assets', 'img', 'instagram');
const DATA = path.join('assets', 'data', 'instagram.json');

if (!TOKEN) {
  console.log('IG_TOKEN not set — leaving the curated grid in place.');
  process.exit(0);
}

async function main() {
  const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp';
  const url = `https://graph.instagram.com/me/media?fields=${fields}&limit=${COUNT}&access_token=${TOKEN}`;
  const res = await fetch(url);
  if (!res.ok) {
    console.error('Instagram API error', res.status, (await res.text()).slice(0, 400));
    process.exit(1);
  }
  const json = await res.json();
  const items = (json.data || []).slice(0, COUNT);

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
