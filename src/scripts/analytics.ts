/** True when this browser should not be measured. Set by visiting ?internal=1. */
export function ownerExcluded(): boolean {
  const host = location.hostname;
  if (host === "localhost" || host === "127.0.0.1") return true;
  try {
    if (localStorage.getItem("ga_exclude") === "1") return true;
    if (document.cookie.indexOf("ga_exclude=1") !== -1) return true;
  } catch {
    return false;
  }
  return false;
}

const FALLBACK_MEASUREMENT_ID = "G-MBWRFHX01R";

function measurementId(): string {
  const script = document.querySelector('script[src*="gtag/js?id=G-"]');
  const match = script?.getAttribute("src")?.match(/id=(G-[A-Z0-9]+)/);
  return match?.[1] || FALLBACK_MEASUREMENT_ID;
}

function clientId(): string {
  const match = document.cookie.match(/(?:^|; )_ga=GA\d+\.\d+\.(\d+\.\d+)/);
  if (match) return match[1];
  let id = "";
  try {
    id = localStorage.getItem("ga_cid") || "";
  } catch {
    id = "";
  }
  if (!id) {
    id = `${Math.floor(Math.random() * 1e10)}.${Math.floor(Date.now() / 1000)}`;
    try {
      localStorage.setItem("ga_cid", id);
    } catch {
      /* keep the generated id for this hit */
    }
  }
  return id;
}

function sessionParts(id: string): { sid: string; sct: string } {
  const cookieName = `_ga_${id.slice(2)}=`;
  const raw = document.cookie.split("; ").find((part) => part.startsWith(cookieName));
  const value = raw ? decodeURIComponent(raw.slice(cookieName.length)) : "";
  return {
    sid: value.match(/s(\d+)/)?.[1] || String(Math.floor(Date.now() / 1000)),
    sct: value.match(/o(\d+)/)?.[1] || "1",
  };
}

let pageLoadId = 0;
let hitIndex = 0;

/** Send a GA4 event on the measurement ID already used by the live tag. */
function track(name: string, params: Record<string, string>) {
  if (ownerExcluded()) return;
  const win = window as typeof window & { gtag?: (...args: unknown[]) => void };
  if (typeof win.gtag === "function") {
    win.gtag("event", name, { ...params, transport_type: "beacon" });
    return;
  }

  const id = measurementId();
  const session = sessionParts(id);
  if (!pageLoadId) pageLoadId = Math.floor(Math.random() * 1e9);
  const url = new URL("https://www.google-analytics.com/g/collect");
  const query = url.searchParams;
  query.set("v", "2");
  query.set("tid", id);
  query.set("cid", clientId());
  query.set("sid", session.sid);
  query.set("sct", session.sct);
  query.set("seg", "1");
  query.set("_p", String(pageLoadId));
  query.set("_s", String(++hitIndex));
  query.set("en", name);
  query.set("dl", location.href);
  query.set("dt", document.title);
  query.set("ul", (navigator.language || "en-us").toLowerCase());
  query.set("sr", `${screen.width}x${screen.height}`);
  for (const [key, value] of Object.entries(params)) {
    if (value) query.set(`ep.${key}`, value.slice(0, 100));
  }
  if (!navigator.sendBeacon(url.toString())) {
    const img = new Image();
    img.src = url.toString();
  }
}

function clickLabel(el: HTMLElement): string {
  const named = el.getAttribute("aria-label")?.trim();
  if (named) return named.slice(0, 80);
  const heading = el.querySelector("h2, h3");
  const headingText = heading?.textContent?.replace(/\s+/g, " ").trim();
  if (headingText) return headingText.slice(0, 80);
  return (el.textContent || "").replace(/\s+/g, " ").trim().slice(0, 80);
}

function clickRegion(el: HTMLElement): string {
  if (el.closest(".hero-section")) return "hero";
  if (el.closest(".project-list")) return "projects";
  if (el.closest("[data-carousel-accordion]")) return "carousel";
  if (el.closest(".reading-search")) return "search";
  if (el.closest(".footer-links")) return "footer";
  return "home";
}

/** Record clicks on links and buttons on the homepage. */
export function initHomeClicks(root: ParentNode = document) {
  root.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const el = target.closest("a, button");
    if (!(el instanceof HTMLElement)) return;
    if (el.closest(".polaroid-tuner")) return;

    const label = clickLabel(el);
    if (!label) return;
    const href = el instanceof HTMLAnchorElement ? el.href : "";
    track("home_click", {
      click_label: label,
      click_url: href,
      click_region: clickRegion(el),
    });
  });
}

/** One push per browser session when a visitor opens the live site. */
export function notifyVisit() {
  if (ownerExcluded()) return;
  try {
    if (sessionStorage.getItem("visit_notified") === "1") return;
    sessionStorage.setItem("visit_notified", "1");
  } catch {
    return;
  }

  const payload = JSON.stringify({
    path: location.pathname,
    title: document.title,
    referrer: document.referrer,
  });
  const blob = new Blob([payload], { type: "application/json" });
  if (!navigator.sendBeacon("/api/visit", blob)) {
    void fetch("/api/visit", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => undefined);
  }
}
