const ALLOWED_ORIGIN = 'https://unsupervisedleap.com';
const KIT_FORM_ID = '9113458';
const KIT_ENDPOINT = `https://api.kit.com/v4/forms/${KIT_FORM_ID}/subscribers`;

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

export default {
  async fetch(request, env) {
    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    // Only accept POST
    if (request.method !== 'POST') {
      return json({ error: 'Method not allowed' }, 405);
    }

    // Parse body
    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: 'Invalid JSON' }, 400);
    }

    const email = (body.email_address ?? '').trim().toLowerCase();

    // Basic email validation
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json({ error: 'A valid email address is required.' }, 400);
    }

    // Forward to Kit v4
    const kitRes = await fetch(KIT_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Kit-Api-Key': env.KIT_API_KEY,
      },
      body: JSON.stringify({ email_address: email }),
    });

    if (kitRes.ok) {
      return json({ success: true });
    }

    const kitData = await kitRes.json().catch(() => ({}));
    return json(
      { error: kitData?.errors?.[0] ?? 'Subscription failed. Please try again.' },
      kitRes.status,
    );
  },
};
