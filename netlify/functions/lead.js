// White-label lead handler — receives a form POST and emails the lead to the
// business inbox FROM the business's own domain (via Resend). No third-party
// branding is ever exposed to the site visitor or to the recipient.
//
// Required Netlify environment variable:
//   RESEND_API_KEY  — from https://resend.com (domain must be verified)
// Optional:
//   LEAD_TO         — destination inbox (defaults below)
//   LEAD_FROM       — verified sender (defaults below)

const LEAD_TO_DEFAULT = 'lakewayluxurycarsuites@gmail.com';
const LEAD_FROM_DEFAULT = 'Lakeway Luxury Car Suites <leads@lakewayluxurycarsuites.com>';

function json(status, obj) {
  return {
    statusCode: status,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(obj),
  };
}

function esc(s) {
  return String(s).replace(/[&<>"]/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
  });
}

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') return json(405, { ok: false, error: 'method' });

  let data;
  try { data = JSON.parse(event.body || '{}'); } catch (e) { return json(400, { ok: false, error: 'bad request' }); }

  // Honeypot: bots fill hidden fields. Pretend success, send nothing.
  if (data._gotcha) return json(200, { ok: true });

  const name = (data.Name || '').toString().trim();
  const email = (data.Email || '').toString().trim();
  if (!name || !email) return json(422, { ok: false, error: 'Name and email are required.' });

  const rows = [
    ['Name', data.Name],
    ['Email', data.Email],
    ['Phone', data.Phone],
    ['Inquiry', data.Inquiry],
    ['Preferred date', data.Preferred_Date],
    ['Preferred time', data.Preferred_Time],
    ['Message', data.Message],
    ['Source', data.Source_Page],
  ].filter(function (r) { return r[1] && r[1].toString().trim(); });

  const text = rows.map(function (r) { return r[0] + ': ' + r[1]; }).join('\n');
  const html =
    '<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px">' +
    '<h2 style="font-family:Georgia,serif;color:#1c1a17;border-bottom:2px solid #c9a24b;padding-bottom:10px">New inquiry &mdash; Lakeway Luxury Car Suites</h2>' +
    '<table style="font-size:14px;border-collapse:collapse;width:100%">' +
    rows.map(function (r) {
      return '<tr><td style="padding:7px 16px 7px 0;color:#8a6a24;font-weight:bold;vertical-align:top;white-space:nowrap">' +
        esc(r[0]) + '</td><td style="padding:7px 0;color:#1c1a17">' + esc(r[1]) + '</td></tr>';
    }).join('') +
    '</table></div>';

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + (process.env.RESEND_API_KEY || ''),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: process.env.LEAD_FROM || LEAD_FROM_DEFAULT,
      to: [process.env.LEAD_TO || LEAD_TO_DEFAULT],
      reply_to: email,
      subject: 'New lead — ' + name,
      text: text,
      html: html,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(function () { return ''; });
    return json(502, { ok: false, error: 'Could not send.', detail: detail.slice(0, 300) });
  }
  return json(200, { ok: true });
};
