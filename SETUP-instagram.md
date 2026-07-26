# Instagram Feed — Setup Guide

The homepage has an Instagram section that can pull your **latest posts automatically**.
Everything is already coded. It just needs **one access token** from you to turn on,
because Instagram does not allow any website to read posts without one.

Until you complete this, the site shows a nice **curated grid** of car/interior photos
(no broken or empty section) — so there's no rush and nothing looks unfinished.

Profile: https://www.instagram.com/lakewayluxurycarsuites/

---

## What happens once it's on
- A scheduled job runs **every 6 hours**, pulls your 9 most recent posts, and updates the site.
- The homepage grid shows your **real latest posts**, each linking to Instagram.
- Fully automatic after setup. No plugins, no third-party widget, no watermark.

---

## One-time setup (~10–15 minutes)

### Step 1 — Make Instagram a Professional account
In the Instagram app: **Settings → Account type and tools → Switch to professional account**
→ choose **Business** or **Creator**. (Required by Instagram's API. It's free and reversible.)

### Step 2 — Generate an access token (Meta)
1. Go to **https://developers.facebook.com** and log in.
2. **My Apps → Create App → App type: Business → Create.**
3. In the app dashboard, **Add product → Instagram → set up.**
4. Open **"API setup with Instagram login."**
5. Add your Instagram account, then click **Generate token**.
6. **Copy the long token** it gives you (this is a long-lived token).

### Step 3 — Add the token to GitHub (this is the secure part)
1. Go to the repo: **https://github.com/SRE-2025/LakewayLuxryCars**
2. **Settings → Secrets and variables → Actions → New repository secret.**
3. Name: **`IG_TOKEN`** (exactly). Value: **paste the token.** Click **Add secret.**
   - ⚠️ Paste it here in GitHub — never in an email or chat. It's write-only; even you can't read it back.

### Step 4 — Let the job update the site
Same repo: **Settings → Actions → General → Workflow permissions →**
select **"Read and write permissions" → Save.**

### Step 5 — Run it once now
**Actions tab → "Instagram feed" (left side) → Run workflow → Run.**
Wait ~1 minute, then hard-refresh the homepage — your real posts appear.
After this, it runs by itself every 6 hours.

---

## Maintenance
- **The token expires about every 60 days.** When the feed stops updating, redo **Step 2**
  and update the `IG_TOKEN` secret with the new token.
- Want to never touch it again? Ask your developer to add the **auto-refresh** step
  (it renews the token automatically before it expires).

## How to change how many posts show
In `.github/workflows/instagram-feed.yml`, change `IG_COUNT: '9'` to any number
(6, 9, and 12 look best in the grid).

## Troubleshooting
- **Section still shows the curated photos?** The token isn't set yet, or the workflow
  hasn't run — do Steps 3–5.
- **Workflow failed?** Open the failed run in the Actions tab. The most common cause is an
  expired or wrong token (redo Step 2) or Step 4 not done (read/write permissions).
