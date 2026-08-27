// Cloudflare Pages Function - review storage for Meaning by W
// GET  /api/reviews  -> { reviews: [...] }
// POST /api/reviews  -> saves one review

const CODE = '2022';
const MAX_TEXT = 1200;
const MAX_NAME = 60;

function json(data, status) {
  return new Response(JSON.stringify(data), {
    status: status || 200,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
  });
}

function clean(s, max) {
  return String(s == null ? '' : s).replace(/[<>]/g, '').trim().slice(0, max);
}

export async function onRequestGet(context) {
  try {
    const kv = context.env.REVIEWS;
    if (!kv) return json({ reviews: [] });
    const list = await kv.list({ prefix: 'review:' });
    const items = [];
    for (const k of list.keys) {
      const raw = await kv.get(k.name);
      if (!raw) continue;
      try { items.push(JSON.parse(raw)); } catch (e) {}
    }
    items.sort(function (a, b) { return (b.ts || 0) - (a.ts || 0); });
    return json({ reviews: items });
  } catch (e) {
    return json({ reviews: [], error: 'read_failed' });
  }
}

export async function onRequestPost(context) {
  try {
    const kv = context.env.REVIEWS;
    if (!kv) return json({ ok: false, error: 'storage_unavailable' }, 500);

    const body = await context.request.json();

    if (clean(body.code, 20) !== CODE) {
      return json({ ok: false, error: 'bad_code' }, 403);
    }

    const name = clean(body.name, MAX_NAME);
    const text = clean(body.text, MAX_TEXT);
    if (!name || !text) {
      return json({ ok: false, error: 'missing_fields' }, 400);
    }

    let rating = parseInt(body.rating, 10);
    if (!(rating >= 1 && rating <= 5)) rating = 5;

    let img = null;
    if (typeof body.img === 'string' && body.img.indexOf('data:image/') === 0) {
      if (body.img.length <= 700000) img = body.img;
    }

    const ts = Date.now();
    const review = {
      id: String(ts),
      name: name,
      date: new Date(ts).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
      rating: rating,
      text: text,
      product: clean(body.product, 80),
      img: img,
      ts: ts
    };

    await kv.put('review:' + ts, JSON.stringify(review));
    return json({ ok: true, review: review });
  } catch (e) {
    return json({ ok: false, error: 'save_failed' }, 500);
  }
}
