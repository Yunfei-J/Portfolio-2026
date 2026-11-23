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

const PORTFOLIO_MEASUREMENT_ID = "G-HWQWQ84N4X";

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

/** Send a GA4 event to Portfolio 2026. */
function track(name: string, params: Record<string, string>) {
  if (ownerExcluded()) return;

  const id = PORTFOLIO_MEASUREMENT_ID;
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

function searchTagEvent(el: Element): string | null {
  const slug = (el.textContent || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_|_$/g, "");
  return slug ? `click_search_${slug}` : null;
}

const PROJECT_EVENTS: Record<string, string> = {
  userve: "click_userve",
  oowls: "click_oowls",
  "forkit ai": "click_forkit",
  ubiquitous: "click_ubiquitous",
  "green it!": "click_green_it",
  halfsies: "click_halfsies",
  "cyber imposter": "click_cyber_imposter",
  "money wise": "click_money_wise",
};

function projectEvent(text: string): string | null {
  const key = text.replace(/\s+/g, " ").trim().toLowerCase();
  return PROJECT_EVENTS[key] ?? null;
}

/** Distinct event names for homepage clicks. */
function clickEventName(target: Element): string | null {
  if (target.closest(".polaroid-tuner")) return null;

  const project = target.closest(".project-card-v2");
  if (project) {
    return projectEvent(project.querySelector("h2")?.textContent || "");
  }
  const carouselItem = target.closest(".carousel-accordion__item");
  if (carouselItem) {
    const heading = carouselItem.querySelector("h3, .carousel-accordion__spine-title");
    return projectEvent(heading?.textContent || "");
  }

  if (target.closest("[data-polaroid-like]")) return "click_like";
  if (target.closest(".polaroid-wrap")) return "click_polaroid";

  const tag = target.closest("[data-search-tag]");
  if (tag) return searchTagEvent(tag);
  if (target.closest(".search-result-card")) return "click_search_result";

  const footer = target.closest(".footer-links a");
  if (!(footer instanceof HTMLAnchorElement)) return null;
  const text = (footer.textContent || "").trim().toLowerCase();
  if (text === "linkedin") return "click_linkedin";
  if (text === "cv") return "click_cv";
  if (text === "email") return "click_email";
  return null;
}

/** Record chosen homepage clicks as their own event names. */
export function initHomeClicks(root: ParentNode = document) {
  root.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const name = clickEventName(target);
    if (!name) return;
    track(name, {});
    if (Object.values(PROJECT_EVENTS).includes(name)) notifyClick(name);
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

  postNotify("/api/visit", {
    path: location.pathname,
    title: document.title,
    referrer: document.referrer,
  });
}

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

/** Push when a visitor clicks a featured project or carousel item. */
function notifyClick(eventName: string) {
  if (ownerExcluded()) return;
  const label = CLICK_LABELS[eventName];
  if (!label) return;
  postNotify("/api/click", {
    event: eventName,
    label,
    path: location.pathname,
  });
}

function postNotify(url: string, body: Record<string, string>) {
  const payload = JSON.stringify(body);
  const blob = new Blob([payload], { type: "application/json" });
  if (!navigator.sendBeacon(url, blob)) {
    void fetch(url, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => undefined);
  }
}
