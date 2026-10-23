const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { config, refresh } = require('./fetch-instagram');

const env = { IG_TOKEN: 'EAA-test-only', IG_AUTH_MODE: 'facebook' };
const page = { id: '61591662253130', access_token: 'page-test-only',
  instagram_business_account: { id: '123', username: 'lakewayluxurycarsuites' } };
const item = { id: '456', media_type: 'IMAGE', media_url: 'https://images.example/one.jpg',
  permalink: 'https://www.instagram.com/p/example/', caption: 'Our cars' };
const json = (value, status = 200) => new Response(JSON.stringify(value), { status });
const picture = () => new Response(Buffer.from([255, 216, 255, 217]), { headers: { 'content-type': 'image/jpeg' } });

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'lakeway-feed-test-'));
  // Only remove this test's freshly created temporary folder.
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  fs.mkdirSync(path.join(root, 'assets/data'), { recursive: true });
  fs.mkdirSync(path.join(root, 'assets/img/instagram'), { recursive: true });
  fs.writeFileSync(path.join(root, 'assets/data/instagram.json'), '[{"img":"old.jpg"}]');
  fs.writeFileSync(path.join(root, 'assets/img/instagram/old.jpg'), 'old image');
  return root;
}

function unchanged(root) {
  assert.equal(fs.readFileSync(path.join(root, 'assets/data/instagram.json'), 'utf8'), '[{"img":"old.jpg"}]');
  assert.deepEqual(fs.readdirSync(path.join(root, 'assets/img/instagram')), ['old.jpg']);
}

test('Facebook token reads the exact Page and uses its Page token for media', async t => {
  const root = fixture(t), calls = [];
  const count = await refresh({ env, root, fetchImpl: async (url, options) => {
    const u = new URL(url); calls.push(u);
    assert.equal(u.searchParams.has('access_token'), false);
    if (u.pathname.endsWith('/61591662253130')) return json(page);
    if (u.pathname.endsWith('/123/media')) {
      assert.equal(options.headers.Authorization, 'Bearer page-test-only');
      return json({ data: [item] });
    }
    assert.equal(u.hostname, 'images.example');
    assert.equal(options.headers, undefined);
    return picture();
  } });
  assert.equal(count, 1);
  assert.equal(calls.some(u => u.pathname.includes('/me/accounts')), false);
  const posts = JSON.parse(fs.readFileSync(path.join(root, 'assets/data/instagram.json')));
  assert.ok(fs.existsSync(path.join(root, posts[0].img)));
  assert.equal(posts[0].permalink, item.permalink);
});

test('invalid Facebook authorization is not sent to the Instagram API or logged', async t => {
  const root = fixture(t); let calls = 0;
  await assert.rejects(refresh({ env, root, fetchImpl: async url => {
    calls++; assert.equal(new URL(url).hostname, 'graph.facebook.com');
    return json({ error: { code: 190, message: 'sensitive EAA-test-only' } }, 400);
  } }), error => error.message.includes('error 190') && !error.message.includes('EAA-test-only'));
  assert.equal(calls, 1); unchanged(root);
});

test('wrong account cannot replace Lakeway content', async t => {
  const root = fixture(t);
  await assert.rejects(refresh({ env, root, fetchImpl: async () => json({ ...page,
    instagram_business_account: { id: '999', username: 'another_client' } }) }), /does not match/);
  unchanged(root);
});

test('unlinked Page preserves current content', async t => {
  const root = fixture(t);
  await assert.rejects(refresh({ env, root, fetchImpl: async () => json({ id: page.id }) }), /no linked/);
  unchanged(root);
});

test('empty feed preserves current content', async t => {
  const root = fixture(t); let calls = 0;
  await assert.rejects(refresh({ env, root, fetchImpl: async () => json(++calls === 1 ? page : { data: [] }) }), /no posts/);
  unchanged(root);
});

test('failure on second image preserves old manifest and photos', async t => {
  const root = fixture(t); let calls = 0;
  await assert.rejects(refresh({ env, root, fetchImpl: async () => {
    calls++;
    if (calls === 1) return json(page);
    if (calls === 2) return json({ data: [item, { ...item, id: '457' }] });
    return calls === 3 ? picture() : new Response('missing', { status: 404 });
  } }), /could not be downloaded/);
  unchanged(root);
});

test('Instagram Login uses Instagram host and video thumbnails', async t => {
  const root = fixture(t);
  await refresh({ env: { META_FEED_TOKEN: 'instagram-test-only', IG_AUTH_MODE: 'instagram' }, root,
    fetchImpl: async url => {
      const u = new URL(url);
      if (u.pathname.endsWith('/me')) return json({ user_id: '123', username: 'lakewayluxurycarsuites' });
      if (u.pathname.endsWith('/media')) {
        assert.equal(u.hostname, 'graph.instagram.com');
        return json({ data: [{ ...item, media_type: 'VIDEO', thumbnail_url: 'https://images.example/thumb.jpg' }] });
      }
      assert.equal(u.pathname, '/thumb.jpg'); return picture();
    } });
});

test('missing token fails explicitly; new secret takes precedence over legacy name', () => {
  assert.throws(() => config({}), /No feed token/);
  assert.equal(config({ META_FEED_TOKEN: 'new', IG_TOKEN: 'old' }).token, 'new');
});
