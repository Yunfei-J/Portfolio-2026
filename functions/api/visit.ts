interface Env {
  NOTIFY_EMAIL?: string;
}

const DEFAULT_NOTIFY_EMAIL = "yj497@cornell.edu";

interface VisitBody {
  path?: string;
  title?: string;
  referrer?: string;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const email = (env.NOTIFY_EMAIL || DEFAULT_NOTIFY_EMAIL).trim();

  const origin = request.headers.get("Origin");
  const expected = new URL(request.url).origin;
  if (origin && origin !== expected) return new Response(null, { status: 403 });

  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const cacheKey = new Request(`https://visit-notify.internal/${ip}`);
  const cache = caches.default;
  if (await cache.match(cacheKey)) return new Response(null, { status: 204 });

  let body: VisitBody = {};
  try {
    body = (await request.json()) as VisitBody;
  } catch {
    body = {};
  }

  const path = (body.path || "/").slice(0, 200);
  const title = (body.title || "Portfolio").slice(0, 160);
  const referrer = (body.referrer || "direct").slice(0, 300);
  const country = request.headers.get("CF-IPCountry") || "unknown";

  const sent = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(email)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      _subject: `Portfolio visit: ${path}`,
      _template: "box",
      page: path,
      title,
      referrer,
      country,
    }),
  });

  if (sent.ok) {
    await cache.put(
      cacheKey,
      new Response("1", { headers: { "Cache-Control": "max-age=3600" } }),
    );
  }

  return new Response(null, { status: 204 });
};
