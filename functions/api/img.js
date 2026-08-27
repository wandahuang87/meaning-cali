// Same-origin image proxy so product photos can be embedded in the order PDF.
// Locked to Etsy's CDN so this cannot be used as an open proxy.
const ALLOWED = 'i.etsystatic.com';

export async function onRequestGet(context) {
  const src = new URL(context.request.url).searchParams.get('u');
  if (!src) return new Response('missing u', { status: 400 });
  let target;
  try { target = new URL(src); } catch (e) { return new Response('bad url', { status: 400 }); }
  if (target.protocol !== 'https:' || target.hostname !== ALLOWED) {
    return new Response('forbidden', { status: 403 });
  }
  const upstream = await fetch(target.toString(), { cf: { cacheTtl: 86400, cacheEverything: true } });
  if (!upstream.ok) return new Response('upstream error', { status: 502 });
  const headers = new Headers();
  headers.set('Content-Type', upstream.headers.get('Content-Type') || 'image/jpeg');
  headers.set('Cache-Control', 'public, max-age=86400');
  headers.set('Access-Control-Allow-Origin', '*');
  return new Response(upstream.body, { status: 200, headers: headers });
}
