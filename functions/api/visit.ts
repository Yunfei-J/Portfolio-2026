interface Env {
  NTFY_TOPIC?: string;
}

const DEFAULT_NTFY_TOPIC = "portfolio-363867a07f0c979b15f51969b04d31d4d3b2";

interface VisitBody {
  path?: string;
  title?: string;
  referrer?: string;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const topic = (env.NTFY_TOPIC || DEFAULT_NTFY_TOPIC).trim();

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
  const referrer = (body.referrer || "direct").slice(0, 300);
  const country = request.headers.get("CF-IPCountry") || "unknown";
  const pageUrl = new URL(path, expected).toString();

  const sent = await fetch(`https://ntfy.sh/${topic}`, {
    method: "POST",
    headers: {
      Title: "Someone opened your portfolio",
      Click: pageUrl,
      Tags: "eyes",
    },
    body: `${path}\nFrom ${country}\nReferrer: ${referrer}`,
  });

  if (sent.ok) {
    await cache.put(
      cacheKey,
      new Response("1", { headers: { "Cache-Control": "max-age=3600" } }),
    );
  }

  return new Response(null, { status: 204 });
};
