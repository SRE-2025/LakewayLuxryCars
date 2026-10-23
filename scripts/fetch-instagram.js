// Server-side feed refresh. Credentials stay in GitHub Actions secrets.
// A failed refresh leaves the existing manifest and photos unchanged.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const FIELDS = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp';

function config(env = process.env) {
  const token = (env.META_FEED_TOKEN || env.IG_TOKEN || '').trim();
  if (!token) throw new Error('No feed token configured. Set META_FEED_TOKEN in repository secrets. Existing photos were preserved.');
  const count = Number(env.IG_COUNT || 9);
  if (!Number.isInteger(count) || count < 1 || count > 25) throw new Error('IG_COUNT must be between 1 and 25.');
  const mode = env.IG_AUTH_MODE || (token.startsWith('EAA') ? 'facebook' : 'instagram');
  if (!['facebook', 'instagram'].includes(mode)) throw new Error('IG_AUTH_MODE must be facebook or instagram.');
  const pageId = env.FB_PAGE_ID || '61591662253130';
  if (!/^\d+$/.test(pageId)) throw new Error('FB_PAGE_ID must be numeric.');
  const version = env.META_API_VERSION || 'v21.0';
  if (!/^v\d+\.0$/.test(version)) throw new Error('Invalid Meta API version.');
  return { token, count, mode, pageId, version,
    username: env.IG_USERNAME || 'lakewayluxurycarsuites' };
}

async function request(url, options, fetchImpl) {
  for (let attempt = 0; attempt < 3; attempt++) {
    let response;
    try {
      response = await fetchImpl(url, { ...options, signal: AbortSignal.timeout(20000) });
    } catch {
      if (attempt === 2) throw new Error('Network request failed or timed out. Existing photos were preserved.');
    }
    if (response && (response.status < 500 && response.status !== 429 || attempt === 2)) return response;
    if (response) await response.body?.cancel();
    await new Promise(resolve => setTimeout(resolve, 1000 * (attempt + 1)));
  }
}

async function graph(host, endpoint, fields, token, cfg, fetchImpl, extra = {}) {
  const url = new URL('https://' + host + '/' + cfg.version + '/' + endpoint);
  url.search = new URLSearchParams({ fields, ...extra });
  const response = await request(url, { headers: { Authorization: 'Bearer ' + token } }, fetchImpl);
  let body;
  try { body = await response.json(); } catch { throw new Error('Meta returned an unreadable response.'); }
  if (!response.ok || body.error) {
    const code = Number(body.error?.code) || response.status;
    // Never print API response bodies: they may contain credentials or personal data.
    const help = code === 190 ? 'The token is invalid or expired.'
      : [10, 100, 200].includes(code) ? 'Check the token permissions and its access to the configured Facebook Page and linked Instagram account.'
      : 'Check the Meta account connection before retrying.';
    throw new Error('Meta ' + host + ' error ' + code + ' (HTTP ' + response.status + '). ' + help);
  }
  return body;
}

async function loadMedia(cfg, fetchImpl) {
  let host, account, token = cfg.token;
  if (cfg.mode === 'facebook') {
    host = 'graph.facebook.com';
    // Page/system-user tokens need not list Pages through /me/accounts.
    // Never select another client's first Page.
    const page = await graph(host, cfg.pageId,
      'id,name,access_token,instagram_business_account{id,username}', token, cfg, fetchImpl);
    account = page.instagram_business_account;
    if (!account?.id) throw new Error('The configured Facebook Page returned no linked Instagram business account. Connect Lakeway Instagram to that Page and grant the token access.');
    token = page.access_token || token;
  } else {
    host = 'graph.instagram.com';
    account = await graph(host, 'me', 'user_id,username', token, cfg, fetchImpl);
    account.id = account.user_id || account.id;
  }
  if (!account.id || account.username?.toLowerCase() !== cfg.username.toLowerCase()) {
    throw new Error('The authorized Instagram account does not match the configured Lakeway username. No photos were changed.');
  }
  const media = await graph(host, account.id + '/media', FIELDS, token, cfg, fetchImpl, { limit: String(cfg.count) });
  if (!Array.isArray(media.data) || !media.data.length) throw new Error('Meta returned no posts. Existing photos were preserved.');
  return media.data.slice(0, cfg.count);
}

async function refresh({ env = process.env, root = '.', fetchImpl = fetch } = {}) {
  const cfg = config(env);
  const items = await loadMedia(cfg, fetchImpl);
  const downloads = [], posts = [];
  for (const item of items) {
    const src = item.media_type === 'VIDEO' ? item.thumbnail_url : item.media_url;
    if (!src) throw new Error('A post has no downloadable image. Existing photos were preserved.');
    const permalink = new URL(item.permalink);
    if (permalink.protocol !== 'https:' || !['instagram.com', 'www.instagram.com'].includes(permalink.hostname)) {
      throw new Error('Invalid Instagram post link. Existing photos were preserved.');
    }
    if (new URL(src).protocol !== 'https:') throw new Error('Invalid media URL.');
    const response = await request(src, {}, fetchImpl);
    const type = (response.headers.get('content-type') || '').split(';')[0];
    const extension = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' }[type];
    if (!response.ok || !extension) throw new Error('An Instagram image could not be downloaded. Existing photos were preserved.');
    const bytes = Buffer.from(await response.arrayBuffer());
    if (!bytes.length) throw new Error('An Instagram image was empty. Existing photos were preserved.');
    const hash = crypto.createHash('sha256').update(bytes).digest('hex');
    const name = 'ig-' + hash + '.' + extension;
    downloads.push({ name, bytes });
    posts.push({ img: 'assets/img/instagram/' + name, permalink: permalink.href,
      caption: (item.caption || '').replace(/\s+/g, ' ').slice(0, 140), type: item.media_type });
  }
  // Validate the complete batch before touching the published feed.
  // Content-addressed files keep the previous manifest's images usable on failure.
  const imgDir = path.join(root, 'assets/img/instagram');
  const data = path.join(root, 'assets/data/instagram.json');
  fs.mkdirSync(imgDir, { recursive: true });
  fs.mkdirSync(path.dirname(data), { recursive: true });
  for (const { name, bytes } of downloads) fs.writeFileSync(path.join(imgDir, name), bytes);
  fs.writeFileSync(data + '.tmp', JSON.stringify(posts, null, 2) + '\n');
  fs.renameSync(data + '.tmp', data);
  return posts.length;
}

if (require.main === module) {
  refresh().then(count => console.log('Verified @lakewayluxurycarsuites; saved ' + count + ' posts.'))
    .catch(error => {
      console.error(error.message);
      process.exitCode = 1;
    });
}
module.exports = { config, refresh };
