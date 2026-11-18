import rawIndex from "./search-index.json";

export type SearchEntry = {
  slug: string;
  title: string;
  href: string;
  tags: string[];
  thumbnail: string;
  text: string;
  lightbox?: boolean;
};

export const SEARCH_INDEX: SearchEntry[] = rawIndex;
