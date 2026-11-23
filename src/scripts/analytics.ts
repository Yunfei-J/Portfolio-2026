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

function track(name: string, params: Record<string, string>) {
  if (ownerExcluded()) return;
  const win = window as typeof window & {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  };
  win.dataLayer = win.dataLayer || [];
  if (typeof win.gtag === "function") {
    win.gtag("event", name, { ...params, transport_type: "beacon" });
    return;
  }
  win.dataLayer.push({ event: name, ...params });
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
