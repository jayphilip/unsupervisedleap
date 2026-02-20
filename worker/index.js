const ALLOWED_ORIGIN = 'https://unsupervisedleap.com';
const KIT_FORM_ID = '9113458';
const KIT_SUBSCRIBE_ENDPOINT = `https://api.kit.com/v4/forms/${KIT_FORM_ID}/subscribers`;
const KIT_BROADCAST_ENDPOINT = 'https://api.kit.com/v4/broadcasts';
const RSS_URL = 'https://unsupervisedleap.com/rss.xml';
const KV_LAST_KEY = 'last_sent_url';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': ALLOWED_ORIGIN,
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  });
}

// Lightweight RSS item extractor — no DOM dependency needed
function parseLatestItem(xml) {
  const item = xml.match(/<item[\s>]([\s\S]*?)<\/item>/)?.[1];
  if (!item) return null;
  const get = (tag) => {
    const m =
      item.match(new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]><\\/${tag}>`, 'i')) ||
      item.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'));
    return m?.[1]?.trim() ?? '';
  };
  return {
    title: get('title'),
    link: get('link'),
    description: get('description'),
    pubDate: get('pubDate'),
  };
}

function buildEmailHtml(post) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f9f9f9;font-family:Georgia,serif;">
  <div style="max-width:600px;margin:40px auto;background:#fff;border:1px solid #e5e5e5;border-radius:12px;overflow:hidden;">
    <div style="padding:40px 48px 32px;">
      <p style="margin:0 0 6px;font-family:system-ui,sans-serif;font-size:12px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#888;">New post</p>
      <h1 style="margin:0 0 20px;font-family:system-ui,sans-serif;font-size:26px;font-weight:800;letter-spacing:-.02em;color:#111;line-height:1.15;">${post.title}</h1>
      ${post.description ? `<p style="margin:0 0 28px;font-size:17px;line-height:1.7;color:#444;">${post.description}</p>` : ''}
      <a href="${post.link}" style="display:inline-block;background:#111;color:#fff;text-decoration:none;padding:12px 28px;border-radius:8px;font-family:system-ui,sans-serif;font-size:14px;font-weight:600;">Read the post →</a>
    </div>
    <div style="padding:20px 48px 28px;border-top:1px solid #f0f0f0;">
      <p style="margin:0;font-family:system-ui,sans-serif;font-size:12px;color:#aaa;">Unsupervised Leap · <a href="https://unsupervisedleap.com" style="color:#aaa;">unsupervisedleap.com</a></p>
    </div>
  </div>
</body>
</html>`;
}

async function runRssCron(env, ctx) {
  // 1. Fetch RSS
  const rssRes = await fetch(RSS_URL, { headers: { 'User-Agent': 'unsupervisedleap-cron/1.0' } });
  if (!rssRes.ok) throw new Error(`RSS fetch failed: ${rssRes.status}`);
  const xml = await rssRes.text();

  // 2. Parse latest post
  const post = parseLatestItem(xml);
  if (!post?.link) {
    console.log('RSS: no items found');
    return;
  }

  // 3. Compare against last sent
  const lastUrl = await env.RSS_KV.get(KV_LAST_KEY);
  if (lastUrl === post.link) {
    console.log('RSS: no new post since', post.link);
    return;
  }

  // 4. Create Kit broadcast (draft first, then send)
  const createRes = await fetch(KIT_BROADCAST_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Kit-Api-Key': env.KIT_API_KEY,
    },
    body: JSON.stringify({
      subject: post.title,
      content: buildEmailHtml(post),
      email_address: env.SENDER_EMAIL,
      email_layout_template: 'no_template',
      public: false,
    }),
  });

  const createData = await createRes.json().catch(() => ({}));
  if (!createRes.ok) {
    console.error('Kit broadcast create failed:', JSON.stringify(createData));
    throw new Error(`Kit broadcast create: ${createRes.status}`);
  }

  const broadcastId = createData?.broadcast?.id;
  if (!broadcastId) throw new Error('No broadcast ID returned');

  // 5. Send it
  const sendRes = await fetch(`${KIT_BROADCAST_ENDPOINT}/${broadcastId}/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Kit-Api-Key': env.KIT_API_KEY,
    },
    body: JSON.stringify({ scheduled_at: new Date().toISOString() }),
  });

  if (!sendRes.ok) {
    const sendData = await sendRes.json().catch(() => ({}));
    console.error('Kit broadcast send failed:', JSON.stringify(sendData));
    throw new Error(`Kit broadcast send: ${sendRes.status}`);
  }

  // 6. Persist so we don't re-send
  await env.RSS_KV.put(KV_LAST_KEY, post.link);
  console.log('RSS: broadcast sent for', post.link);
}

export default {
  // ── HTTP handler: newsletter subscribe ──────────────────────────────────────
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }
    if (request.method !== 'POST') {
      return json({ error: 'Method not allowed' }, 405);
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: 'Invalid JSON' }, 400);
    }

    const email = (body.email_address ?? '').trim().toLowerCase();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ error: 'A valid email address is required.' }, 400);
    }

    const kitRes = await fetch(KIT_SUBSCRIBE_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Kit-Api-Key': env.KIT_API_KEY,
      },
      body: JSON.stringify({ email_address: email }),
    });

    if (kitRes.ok) return json({ success: true });

    const kitData = await kitRes.json().catch(() => ({}));
    return json(
      { error: kitData?.errors?.[0] ?? 'Subscription failed. Please try again.' },
      kitRes.status,
    );
  },

  // ── Cron handler: RSS → Kit broadcast ───────────────────────────────────────
  async scheduled(event, env, ctx) {
    ctx.waitUntil(runRssCron(env, ctx));
  },
};
