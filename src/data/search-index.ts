import rawIndex from "./search-index.json";

export type SearchEntry = {
  slug: string;
  title: string;
  href: string;
  tags: string[];
  thumbnail: string;
  text: string;
};

export const SEARCH_INDEX: SearchEntry[] = rawIndex;
