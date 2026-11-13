/**
 * Stacked-sheet scrolling: each sheet pins once its bottom reaches the viewport
 * bottom (via --sheet-top) and the next one slides over it. Sheets must be
 * `position: sticky` with `top: var(--sheet-top)`, share a parent, and apply
 * `opacity: var(--sheet-opacity)` to whatever should fade as they're covered.
 */
export type StackedSheetsSettings = {
  /** Elements to stack, in document order. */
  selector: string;
  /** Opacity a sheet's content fades to once fully covered (1 = no fade). */
  fadeTo: number;
  /** "smooth" eases in and out of the fade; "linear" tracks coverage exactly. */
  fadeCurve: "smooth" | "linear";
  /** Gap (px) kept between the viewport top and a pinned sheet that fits on screen. */
  topOffset: number;
  /** Extra scroll (CSS length, e.g. "30vh") a sheet stays pinned before the next slides over. */
  holdDistance: string;
  /**
   * Minimum time (ms) a pinned sheet holds before the next can slide over, even on
   * fast scrolls; 0 = off. Only applies to wheel, trackpad and touch scrolling, so
   * keyboard scrolling and jumps (links, focus) are never held.
   */
  minHoldTime: number;
  /** Below this viewport width (px) sheets scroll normally; 0 = always stack. */
  minWidth: number;
};

const controllers = new Map<string, { abort: AbortController; resize: ResizeObserver }>();

const ease = {
  smooth: (t: number) => t * t * (3 - 2 * t),
  linear: (t: number) => t,
};

export function initStackedSheets(settings: StackedSheetsSettings) {
  const { selector, fadeTo, fadeCurve, topOffset, holdDistance, minHoldTime, minWidth } = settings;
  controllers.get(selector)?.abort.abort();
  controllers.get(selector)?.resize.disconnect();
  controllers.delete(selector);

  const sheets = Array.from(document.querySelectorAll<HTMLElement>(selector));
  if (!sheets.length) return;

  const abort = new AbortController();
  const { signal } = abort;
  const wide = window.matchMedia(`(min-width: ${minWidth}px)`);
  let ticking = false;

  const setCover = (sheet: HTMLElement, cover: number) => {
    sheet.style.setProperty("--sheet-opacity", (1 - ease[fadeCurve](cover) * (1 - fadeTo)).toFixed(3));
  };

  const update = () => {
    ticking = false;
    if (!wide.matches) return;
    const vh = window.innerHeight;
    sheets.forEach((sheet, i) => {
      const next = sheets[i + 1];
      if (!next) return setCover(sheet, 0);
      const rect = sheet.getBoundingClientRect();
      const visible = Math.min(rect.bottom, vh) - Math.max(rect.top, 0);
      const overlap = rect.bottom - next.getBoundingClientRect().top;
      const cover =
        visible > 0 ? Math.min(1, Math.max(0, overlap / visible)) : rect.bottom <= 0 ? 1 : 0;
      setCover(sheet, cover);
    });
  };

  const measure = () => {
    const vh = window.innerHeight;
    sheets.forEach((sheet, i) => {
      if (wide.matches) {
        sheet.style.removeProperty("position");
        sheet.style.setProperty("--sheet-top", `${Math.min(topOffset, vh - sheet.offsetHeight)}px`);
        if (i > 0) sheet.style.marginTop = holdDistance;
      } else {
        sheet.style.position = "relative";
        sheet.style.removeProperty("margin-top");
        setCover(sheet, 0);
      }
    });
    update();
  };

  const queue = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  };

  // Per transition: when the pinned sheet's hold was reached, and whether we're still in it.
  const heldSince: (number | undefined)[] = [];
  const holding: boolean[] = [];
  let lastGesture = -Infinity;
  const markGesture = () => {
    lastGesture = performance.now();
  };

  /**
   * The hold still running, if any: `remaining` px until the next sheet overlaps
   * (negative once it already has) and `timeLeft` ms until it's allowed to.
   */
  const activeHold = () => {
    const vh = window.innerHeight;
    const now = performance.now();
    for (let i = 0; i < sheets.length - 1; i++) {
      const stuckTop = parseFloat(sheets[i].style.getPropertyValue("--sheet-top")) || 0;
      const pinned = sheets[i].getBoundingClientRect().top <= stuckTop + 1;
      const remaining = sheets[i + 1].getBoundingClientRect().top - vh;
      if (!pinned) {
        heldSince[i] = undefined;
        holding[i] = false;
        continue;
      }
      if (remaining >= -0.5) {
        heldSince[i] ??= now;
        holding[i] = true;
      }
      if (!holding[i]) continue;
      const timeLeft = minHoldTime - (now - (heldSince[i] ?? now));
      if (timeLeft > 0) return { remaining, timeLeft };
      holding[i] = false;
    }
    return null;
  };

  // Momentum the page can't cancel is stopped by freezing scroll at the edge until
  // the hold ends; pulling it back every frame instead shows as a bounce.
  const root = document.documentElement;
  let unfreezeTimer: number | undefined;
  const unfreeze = () => {
    window.clearTimeout(unfreezeTimer);
    root.style.removeProperty("overflow");
    root.style.removeProperty("scrollbar-gutter");
  };
  const stopAtEdge = (hold: { remaining: number; timeLeft: number }) => {
    if (hold.remaining !== 0) window.scrollBy({ top: hold.remaining, behavior: "instant" });
    root.style.overflow = "hidden";
    root.style.scrollbarGutter = "stable";
    window.clearTimeout(unfreezeTimer);
    unfreezeTimer = window.setTimeout(unfreeze, hold.timeLeft);
  };
  signal.addEventListener("abort", unfreeze);

  const onWheel = (event: WheelEvent) => {
    if (!wide.matches || event.ctrlKey) return;
    if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) return;
    const delta =
      event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? window.innerHeight : 1);
    if (delta <= 0) return;
    const hold = activeHold();
    if (!hold) return;
    // Browsers only let the first wheel event of a gesture be cancelled; trackpad
    // swipes that began before the hold (and their momentum) arrive uncancellable.
    if (event.cancelable) {
      event.preventDefault();
      if (hold.remaining > 0) window.scrollBy({ top: Math.min(delta, hold.remaining), behavior: "instant" });
    } else if (delta >= hold.remaining) {
      stopAtEdge(hold);
    }
  };

  // Catches overshoot that slipped past onWheel (e.g. touch momentum).
  const enforceHold = () => {
    if (!wide.matches) return;
    const gestureScroll = performance.now() - lastGesture < 1000;
    const hold = activeHold();
    if (gestureScroll && hold && hold.remaining < 0) stopAtEdge(hold);
  };

  const resize = new ResizeObserver(measure);
  sheets.forEach((sheet) => resize.observe(sheet));
  controllers.set(selector, { abort, resize });

  if (minHoldTime) {
    window.addEventListener("wheel", markGesture, { passive: true, signal });
    window.addEventListener("wheel", onWheel, { passive: false, signal });
    window.addEventListener("touchmove", markGesture, { passive: true, signal });
    window.addEventListener("touchend", markGesture, { passive: true, signal });
    window.addEventListener("keydown", () => { lastGesture = -Infinity; unfreeze(); }, { signal });
    window.addEventListener("scroll", enforceHold, { passive: true, signal });
  }
  window.addEventListener("scroll", queue, { passive: true, signal });
  window.addEventListener("resize", measure, { signal });
  wide.addEventListener("change", measure, { signal });
  measure();
}
