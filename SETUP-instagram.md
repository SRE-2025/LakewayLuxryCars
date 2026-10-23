# Lakeway Instagram feed

The homepage keeps its existing curated photos until an authenticated refresh succeeds.
Automatic scheduling is currently paused. Do not restore it until a real refresh and
the resulting Pages build have both succeeded.

## Account and credential

- Facebook Page: https://www.facebook.com/61591662253130
- Instagram: https://www.instagram.com/lakewayluxurycarsuites/
- Workflow: https://github.com/SRE-2025/LakewayLuxryCars/actions/workflows/instagram-feed.yml
- Secrets: https://github.com/SRE-2025/LakewayLuxryCars/settings/secrets/actions
- Meta account access: https://business.facebook.com/

This workflow currently uses **Facebook Login** and the Page's linked Instagram
professional account. A Meta Pixel or Conversions API token is not sufficient proof
of permission to read Instagram posts. The authorizing account/app must have access
to this Page and its linked Instagram account, with the applicable Instagram and
Page read permissions. A business Instagram account alone does not grant this access.

Save a replacement feed credential as **META_FEED_TOKEN** in GitHub Actions secrets.
The older **IG_TOKEN** name is still supported as a fallback. The name is only a
configuration key; renaming a token does not change its permissions.
Never put credentials in public website code or repository files.

If switching deliberately to Instagram Login, change IG_AUTH_MODE to instagram
and use that product's token. Do not try a Facebook token on the Instagram host.

## Verification

1. Sign into Meta with an account authorized for Lakeway's assets. Confirm the
   intended Facebook Page is linked to @lakewayluxurycarsuites.
2. Obtain the feed credential through the chosen Meta app's authorization flow and
   save it in the secret above. Scope access to the intended Lakeway assets.
3. Run the Instagram feed workflow manually on main.
4. Confirm Fetch latest Instagram posts succeeds, records a nonzero post count,
   and verifies the exact Instagram username.
5. Confirm the feed commit and Publish refreshed feed steps succeed, then check
   the resulting GitHub Pages deployment and homepage post links.
6. Only then restore a schedule. Credential expiration or revoked permissions can
   still interrupt future refreshes; expiry depends on the credential type.

The script queries the configured Page directly, supports Page/user/system-user
credentials only when their actual permissions allow the requested data, retries
temporary network/server errors, and never selects another client's first Page.
It downloads and validates the whole batch before replacing the manifest, preserves
older photos on failure, and reports sanitized errors. It does not hide failed
refreshes as successes.

The workflow explicitly requests a Pages build after refresh because commits made
with GITHUB_TOKEN do not automatically trigger a Pages build.
See [GitHub's publishing documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Local checks

Run `node --test scripts/fetch-instagram.test.js`. Tests use mock responses, no
credentials, and temporary files; they do not prove live Meta account access.
