#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const INDEX = path.join(ROOT, "src/data/search-index.json");
const OUT = path.join(ROOT, "public/search-embeddings.json");

function tokenize(text) {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/g)
    .filter((t) => t.length > 2);
}

function buildVector(tokens) {
  const vector = {};
  for (const token of tokens) {
    vector[token] = (vector[token] ?? 0) + 1;
  }
  return vector;
}

const entries = JSON.parse(await fs.readFile(INDEX, "utf8"));
const output = [];

for (const entry of entries) {
  const corpus = [entry.title, entry.tags.join(" "), entry.text].join(" ");
  output.push({ slug: entry.slug, vector: buildVector(tokenize(corpus)) });
}

await fs.writeFile(OUT, JSON.stringify(output));
console.log(`Wrote ${output.length} embeddings → public/search-embeddings.json`);
