/*!
 * Reusable Cookie Consent — standalone, no dependencies. Drop onto any site.
 *
 * USAGE:
 *   <script src="/assets/js/cookie-consent.js"></script>
 *   Place it after your Google/Meta tags (or just before </body>).
 *   For STRICT opt-in (block tracking until Accept): set MODE:'optin' below AND
 *   load this file in <head> BEFORE your gtag/fbq tags.
 *
 * What it does:
 *   - Shows a banner until the visitor chooses; remembers the choice in a real cookie (365 days).
 *   - If Google (gtag) or Meta (fbq) are present, it flips their consent automatically:
 *       Accept  -> Google Consent Mode "granted" + Meta fbq('consent','grant')
 *       Decline -> "denied" + fbq('consent','revoke')
 *   - Works on any site; edit the CONFIG block to rebrand.
 */
(function () {
  var CONFIG = {
    mode: 'notice',              // 'notice' = tracking on by default, Decline opts out | 'optin' = blocked until Accept
    cookieName: 'cookie_consent',
    days: 365,
    accent: '#c9a24b',           // button / link color
    bg: '#141210',               // banner background
    text: '#e8e4dc',             // banner text
    privacyUrl: '/privacy.html',
    message: 'We use cookies to enhance your experience and for analytics and marketing. See our '
  };

  function setCookie(v) {
    var d = new Date();
    d.setTime(d.getTime() + CONFIG.days * 86400000);
    document.cookie = CONFIG.cookieName + '=' + v + ';expires=' + d.toUTCString() + ';path=/;SameSite=Lax';
  }
  function getCookie() {
    var name = CONFIG.cookieName.replace(/([.*+?^${}()|[\]\\])/g, '\\$1');
    var m = document.cookie.match(new RegExp('(?:^|; )' + name + '=([^;]*)'));
    return m ? decodeURIComponent(m[1]) : '';
  }
  function applyConsent(granted) {
    try {
      if (window.gtag) window.gtag('consent', 'update', {
        ad_storage: granted ? 'granted' : 'denied',
        ad_user_data: granted ? 'granted' : 'denied',
        ad_personalization: granted ? 'granted' : 'denied',
        analytics_storage: granted ? 'granted' : 'denied'
      });
    } catch (e) {}
    try { if (window.fbq) window.fbq('consent', granted ? 'grant' : 'revoke'); } catch (e) {}
  }

  var choice = getCookie();
  if (choice === 'granted') { applyConsent(true); return; }
  if (choice === 'denied') { applyConsent(false); return; }
  if (CONFIG.mode === 'optin') { applyConsent(false); } // hold tracking until they Accept

  function build() {
    if (document.getElementById('cookie-consent-bar')) return;
    var css =
      '#cookie-consent-bar{position:fixed;left:0;right:0;bottom:0;z-index:2147483000;background:' + CONFIG.bg + ';color:' + CONFIG.text + ';' +
      'border-top:2px solid ' + CONFIG.accent + ';padding:16px 20px;display:flex;align-items:center;justify-content:center;gap:18px;' +
      'flex-wrap:wrap;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;font-size:13.5px;line-height:1.55;box-shadow:0 -6px 24px rgba(0,0,0,.25)}' +
      '#cookie-consent-bar a{color:' + CONFIG.accent + ';text-decoration:underline}' +
      '#cookie-consent-bar .ccc-msg{max-width:680px}' +
      '#cookie-consent-bar .ccc-btns{display:flex;gap:10px;flex-shrink:0}' +
      '#cookie-consent-bar button{cursor:pointer;border:none;border-radius:6px;padding:10px 24px;font-size:13px;font-weight:600;letter-spacing:.02em;font-family:inherit}' +
      '#cookie-consent-bar .ccc-accept{background:' + CONFIG.accent + ';color:#1a1408}' +
      '#cookie-consent-bar .ccc-decline{background:transparent;color:' + CONFIG.text + ';border:1px solid rgba(255,255,255,.35)}' +
      '@media(max-width:600px){#cookie-consent-bar{flex-direction:column;text-align:center;gap:12px}}';
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    var bar = document.createElement('div');
    bar.id = 'cookie-consent-bar';
    bar.setAttribute('role', 'dialog');
    bar.setAttribute('aria-label', 'Cookie consent');
    bar.innerHTML =
      '<div class="ccc-msg">' + CONFIG.message + '<a href="' + CONFIG.privacyUrl + '">Privacy Policy</a>.</div>' +
      '<div class="ccc-btns">' +
      '<button class="ccc-decline" type="button">Decline</button>' +
      '<button class="ccc-accept" type="button">Accept</button>' +
      '</div>';
    document.body.appendChild(bar);
    bar.querySelector('.ccc-accept').addEventListener('click', function () { setCookie('granted'); applyConsent(true); bar.remove(); });
    bar.querySelector('.ccc-decline').addEventListener('click', function () { setCookie('denied'); applyConsent(false); bar.remove(); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
})();
