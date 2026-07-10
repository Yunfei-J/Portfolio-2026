import Fuse from "fuse.js";
import type { SearchEntry } from "../data/search-index";

export type SearchResult = {
  project: SearchEntry;
  score: number;
  snippet: string;
};

type EmbeddingEntry = {
  slug: string;
  vector: Record<string, number>;
};

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlight(text: string, keyword: string): string {
  if (!keyword.trim()) return text;
  const re = new RegExp(`(${escapeRegex(keyword)})`, "gi");
  return text.replace(re, "<mark>$1</mark>");
}

function excerptAround(text: string, keyword: string, windowSize = 120): string | null {
  const re = new RegExp(escapeRegex(keyword), "i");
  const idx = text.search(re);
  if (idx === -1) return null;
  const start = Math.max(0, idx - windowSize / 2);
  const end = Math.min(text.length, idx + keyword.length + windowSize / 2);
  const raw =
    (start > 0 ? "…" : "") + text.slice(start, end) + (end < text.length ? "…" : "");
  return highlight(raw, keyword);
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/g)
    .filter((token) => token.length > 2);
}

function buildQueryVector(query: string): Record<string, number> {
  const vector: Record<string, number> = {};
  for (const token of tokenize(query)) {
    vector[token] = (vector[token] ?? 0) + 1;
  }
  return vector;
}

function cosineSimilarity(
  a: Record<string, number>,
  b: Record<string, number>,
): number {
  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (const key of new Set([...Object.keys(a), ...Object.keys(b)])) {
    const av = a[key] ?? 0;
    const bv = b[key] ?? 0;
    dot += av * bv;
    normA += av * av;
    normB += bv * bv;
  }

  if (!normA || !normB) return 0;
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export function createSearchEngine(
  index: SearchEntry[],
  embeddings: EmbeddingEntry[] = [],
) {
  const fuse = new Fuse(index, {
    keys: [
      { name: "title", weight: 0.45 },
      { name: "tags", weight: 0.3 },
      { name: "text", weight: 0.25 },
    ],
    threshold: 0.4,
    ignoreLocation: true,
    includeScore: true,
  });

  const embeddingMap = new Map(embeddings.map((entry) => [entry.slug, entry.vector]));

  return function search(query: string): SearchResult[] {
    const q = query.trim();
    if (!q) return [];

    const fuseResults = fuse.search(q, { limit: 12 });
    const queryVector = buildQueryVector(q);
    const seen = new Set<string>();

    const merged = fuseResults.map(({ item, score }) => {
      seen.add(item.slug);
      const fuzzyScore = 1 - (score ?? 1);
      const semanticScore = embeddingMap.has(item.slug)
        ? cosineSimilarity(queryVector, embeddingMap.get(item.slug)!)
        : 0;
      const combined = semanticScore > 0 ? fuzzyScore * 0.6 + semanticScore * 0.4 : fuzzyScore;
      const snippet =
        excerptAround(item.text, q) ||
        excerptAround(item.title, q) ||
        item.text.slice(0, 140) + (item.text.length > 140 ? "…" : "");

      return { project: item, score: combined, snippet };
    });

    if (embeddingMap.size > 0) {
      for (const item of index) {
        if (seen.has(item.slug)) continue;
        const semanticScore = cosineSimilarity(queryVector, embeddingMap.get(item.slug) ?? {});
        if (semanticScore < 0.15) continue;
        merged.push({
          project: item,
          score: semanticScore * 0.4,
          snippet: item.text.slice(0, 140) + (item.text.length > 140 ? "…" : ""),
        });
      }
    }

    return merged.sort((a, b) => b.score - a.score).slice(0, 8);
  };
}

export function trackSearch(query: string) {
  const term = query.trim();
  if (!term) return;

  const win = window as typeof window & {
    dataLayer?: Record<string, unknown>[];
    gtag?: (...args: unknown[]) => void;
  };

  win.dataLayer = win.dataLayer || [];

  if (typeof win.gtag === "function") {
    win.gtag("event", "search", { search_term: term });
    return;
  }

  win.dataLayer.push({
    event: "search",
    search_term: term,
  });
}

export { highlight };
