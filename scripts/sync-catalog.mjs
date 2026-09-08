#!/usr/bin/env node
/**
 * Copies data/words.json to docs/words.json so the Pages catalog
 * can fetch a same-origin file.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.join(root, "data", "words.json");
const dest = path.join(root, "docs", "words.json");

const words = JSON.parse(fs.readFileSync(source, "utf8"));
if (!Array.isArray(words)) {
  console.error("data/words.json must be a JSON array");
  process.exit(1);
}

fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.writeFileSync(dest, `${JSON.stringify(words, null, 2)}\n`);
console.log(`Wrote ${words.length} words to docs/words.json`);
