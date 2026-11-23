interface Env {
  NTFY_TOPIC?: string;
}

const DEFAULT_NTFY_TOPIC = "portfolio-363867a07f0c979b15f51969b04d31d4d3b2";

const CLICK_LABELS: Record<string, string> = {
  click_userve: "USERVE",
  click_oowls: "OOWLS",
  click_forkit: "ForkIt AI",
  click_ubiquitous: "Ubiquitous",
  click_green_it: "Green it!",
  click_halfsies: "Halfsies",
  click_cyber_imposter: "Cyber Imposter",
  click_money_wise: "Money wise",
};

interface ClickBody {
  event?: string;
  label?: string;
  path?: string;
}

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const topic = (env.NTFY_TOPIC || DEFAULT_NTFY_TOPIC).trim();

  const origin = request.headers.get("Origin");
  const expected = new URL(request.url).origin;
  if (origin && origin !== expected) return new Response(null, { status: 403 });

  let body: ClickBody = {};
  try {
    body = (await request.json()) as ClickBody;
  } catch {
    return new Response(null, { status: 204 });
  }

  const eventName = body.event || "";
  const label = CLICK_LABELS[eventName];
  if (!label) return new Response(null, { status: 204 });

  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const cacheKey = new Request(`https://click-notify.internal/${ip}/${eventName}`);
  const cache = caches.default;
  if (await cache.match(cacheKey)) return new Response(null, { status: 204 });

  const path = (body.path || "/").slice(0, 200);
  const country = request.headers.get("CF-IPCountry") || "unknown";

  const sent = await fetch(`https://ntfy.sh/${topic}`, {
    method: "POST",
    headers: {
      Title: `Someone clicked ${label}`,
      Click: new URL(path, expected).toString(),
      Tags: "point_right",
    },
    body: `${label}\nFrom ${country}`,
  });

  if (sent.ok) {
    await cache.put(
      cacheKey,
      new Response("1", { headers: { "Cache-Control": "max-age=60" } }),
    );
  }

  return new Response(null, { status: 204 });
};
