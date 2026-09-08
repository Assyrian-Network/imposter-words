#!/usr/bin/env node
/**
 * Validates data/words.json against the published word-pool contract.
 * Run with: npm test
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { findDisallowedGloss } from "./family-friendly.mjs";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "..");

const WORDS_PATH = path.join(root, "data", "words.json");
const CATALOG_PATH = path.join(root, "docs", "words.json");
const CATEGORIES_PATH = path.join(root, "schema", "categories.json");
const SCHEMA_PATH = path.join(root, "schema", "word.schema.json");

const ID_PATTERN = /^w[0-9]{3,}$/;
const DATE_PATTERN = /^(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;
const SYRIAC_PATTERN = /[\u0700-\u074F]/;
const LATIN_PATTERN = /[A-Za-z]/;

const ALLOWED_WORD_KEYS = new Set([
  "id",
  "display",
  "categories",
  "english",
  "hints",
  "seasonal",
]);
const ALLOWED_DISPLAY_KEYS = new Set(["eastern", "western"]);
const ALLOWED_HINT_KEYS = new Set(["eastern", "western"]);
const ALLOWED_SEASONAL_KEYS = new Set(["availableFrom", "availableUntil"]);
const FORBIDDEN_KEYS = new Set([
  "visualAid",
  "visualAidPath",
  "image",
  "imagePath",
]);

function loadJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function isPlainObject(value) {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function rejectUnknownKeys(object, allowed, label, errors) {
  for (const key of Object.keys(object)) {
    if (FORBIDDEN_KEYS.has(key)) {
      errors.push(`${label}: '${key}' is not allowed in the public word pool`);
    } else if (!allowed.has(key)) {
      errors.push(`${label}: unexpected property '${key}'`);
    }
  }
}

function validateScriptPair(pair, label, errors) {
  if (!isPlainObject(pair)) {
    errors.push(`${label}: must be an object with syriac and latin`);
    return;
  }
  for (const key of Object.keys(pair)) {
    if (key !== "syriac" && key !== "latin") {
      errors.push(`${label}: unexpected property '${key}'`);
    }
  }
  if (!isNonEmptyString(pair.syriac)) {
    errors.push(`${label}.syriac: required non-empty string`);
  } else if (!SYRIAC_PATTERN.test(pair.syriac)) {
    errors.push(`${label}.syriac: must include Syriac script characters`);
  }
  if (!isNonEmptyString(pair.latin)) {
    errors.push(`${label}.latin: required non-empty string`);
  } else if (!LATIN_PATTERN.test(pair.latin)) {
    errors.push(`${label}.latin: must include Latin letters`);
  } else {
    const blocked = findDisallowedGloss(pair.latin);
    if (blocked) {
      errors.push(
        `${label}.latin: '${blocked}' is not allowed in this family-friendly pool`,
      );
    }
  }
}

function collectHintLists(hints) {
  const lists = [];
  if (Array.isArray(hints?.eastern)) lists.push(...hints.eastern);
  if (Array.isArray(hints?.western)) lists.push(...hints.western);
  return lists;
}

function main() {
  const errors = [];
  const warnings = [];

  let words;
  let categoriesDoc;
  let schema;
  try {
    words = loadJson(WORDS_PATH);
    categoriesDoc = loadJson(CATEGORIES_PATH);
    schema = loadJson(SCHEMA_PATH);
  } catch (error) {
    console.error(`Failed to read input files: ${error.message}`);
    process.exit(1);
  }

  if (!Array.isArray(words)) {
    console.error("data/words.json must be a JSON array");
    process.exit(1);
  }

  const allowedCategories = new Set(
    (categoriesDoc.categories || []).map((entry) => entry.id),
  );
  if (allowedCategories.size === 0) {
    console.error("schema/categories.json has no categories");
    process.exit(1);
  }

  const schemaCategories = schema?.properties?.categories?.items?.enum;
  if (Array.isArray(schemaCategories)) {
    const missing = [...allowedCategories].filter(
      (id) => !schemaCategories.includes(id),
    );
    const extra = schemaCategories.filter((id) => !allowedCategories.has(id));
    if (missing.length > 0 || extra.length > 0) {
      errors.push(
        `schema/word.schema.json categories enum is out of date with schema/categories.json`,
      );
    }
  }

  const seenIds = new Set();
  const seenEasternSyriac = new Set();
  const seenEasternLatin = new Set();
  const seenEnglish = new Set();

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const prefix = `Word ${i + 1} (${word?.id ?? "unknown"})`;

    if (!isPlainObject(word)) {
      errors.push(`${prefix}: entry must be an object`);
      continue;
    }

    rejectUnknownKeys(word, ALLOWED_WORD_KEYS, prefix, errors);

    if (!isNonEmptyString(word.id) || !ID_PATTERN.test(word.id)) {
      errors.push(`${prefix}: id must match ${ID_PATTERN}`);
    } else if (seenIds.has(word.id)) {
      errors.push(`${prefix}: duplicate id '${word.id}'`);
    } else {
      seenIds.add(word.id);
    }

    if (!isNonEmptyString(word.english)) {
      errors.push(`${prefix}: english is required`);
    } else {
      const gloss = word.english.trim().toLowerCase();
      if (seenEnglish.has(gloss)) {
        warnings.push(`${prefix}: duplicate english gloss '${word.english}'`);
      }
      seenEnglish.add(gloss);
      const blocked = findDisallowedGloss(word.english);
      if (blocked) {
        errors.push(
          `${prefix}: english '${blocked}' is not allowed in this family-friendly pool`,
        );
      }
    }

    if (!isPlainObject(word.display)) {
      errors.push(`${prefix}: display is required`);
    } else {
      rejectUnknownKeys(
        word.display,
        ALLOWED_DISPLAY_KEYS,
        `${prefix}.display`,
        errors,
      );
      if (!word.display.eastern) {
        errors.push(`${prefix}: display.eastern is required`);
      } else {
        validateScriptPair(
          word.display.eastern,
          `${prefix}.display.eastern`,
          errors,
        );
        if (isNonEmptyString(word.display.eastern?.syriac)) {
          const key = word.display.eastern.syriac.trim();
          if (seenEasternSyriac.has(key)) {
            errors.push(`${prefix}: duplicate eastern syriac '${key}'`);
          }
          seenEasternSyriac.add(key);
        }
        if (isNonEmptyString(word.display.eastern?.latin)) {
          const key = word.display.eastern.latin.trim().toLowerCase();
          if (seenEasternLatin.has(key)) {
            errors.push(`${prefix}: duplicate eastern latin '${key}'`);
          }
          seenEasternLatin.add(key);
        }
      }
      if (word.display.western !== undefined) {
        validateScriptPair(
          word.display.western,
          `${prefix}.display.western`,
          errors,
        );
      }
    }

    if (!Array.isArray(word.categories) || word.categories.length === 0) {
      errors.push(`${prefix}: categories must be a non-empty array`);
    } else {
      const seenCats = new Set();
      for (const category of word.categories) {
        if (typeof category !== "string") {
          errors.push(`${prefix}: category values must be strings`);
        } else if (!allowedCategories.has(category)) {
          errors.push(
            `${prefix}: invalid category '${category}'. Allowed: ${[...allowedCategories].join(", ")}`,
          );
        } else if (seenCats.has(category)) {
          errors.push(`${prefix}: duplicate category '${category}'`);
        }
        seenCats.add(category);
      }
    }

    if (word.hints !== undefined) {
      if (!isPlainObject(word.hints)) {
        errors.push(`${prefix}: hints must be an object if present`);
      } else {
        rejectUnknownKeys(word.hints, ALLOWED_HINT_KEYS, `${prefix}.hints`, errors);
        for (const dialect of ["eastern", "western"]) {
          const list = word.hints[dialect];
          if (list === undefined) continue;
          if (!Array.isArray(list) || list.length === 0) {
            errors.push(`${prefix}.hints.${dialect}: must be a non-empty array`);
          } else {
            list.forEach((hint, index) => {
              validateScriptPair(
                hint,
                `${prefix}.hints.${dialect}[${index}]`,
                errors,
              );
            });
          }
        }
        for (const hint of collectHintLists(word.hints)) {
          if (isNonEmptyString(hint?.latin)) {
            const blocked = findDisallowedGloss(hint.latin);
            if (blocked) {
              errors.push(
                `${prefix}: hint '${blocked}' is not allowed in this family-friendly pool`,
              );
            }
          }
        }
      }
    }

    if (word.seasonal !== undefined) {
      if (!isPlainObject(word.seasonal)) {
        errors.push(`${prefix}: seasonal must be an object if present`);
      } else {
        rejectUnknownKeys(
          word.seasonal,
          ALLOWED_SEASONAL_KEYS,
          `${prefix}.seasonal`,
          errors,
        );
        const { availableFrom, availableUntil } = word.seasonal;
        if (!isNonEmptyString(availableFrom) || !DATE_PATTERN.test(availableFrom)) {
          errors.push(`${prefix}: seasonal.availableFrom must be MM-DD`);
        }
        if (!isNonEmptyString(availableUntil) || !DATE_PATTERN.test(availableUntil)) {
          errors.push(`${prefix}: seasonal.availableUntil must be MM-DD`);
        }
        if (
          isNonEmptyString(availableFrom) &&
          isNonEmptyString(availableUntil) &&
          DATE_PATTERN.test(availableFrom) &&
          DATE_PATTERN.test(availableUntil)
        ) {
          const [fromMonth, fromDay] = availableFrom.split("-").map(Number);
          const [untilMonth, untilDay] = availableUntil.split("-").map(Number);
          if (fromMonth * 100 + fromDay > untilMonth * 100 + untilDay) {
            errors.push(
              `${prefix}: seasonal.availableFrom must be on or before availableUntil`,
            );
          }
        }
      }
    }
  }

  try {
    const catalog = loadJson(CATALOG_PATH);
    if (JSON.stringify(catalog) !== JSON.stringify(words)) {
      errors.push(
        "docs/words.json is out of date. Copy data/words.json over it before opening a PR.",
      );
    }
  } catch {
    errors.push("docs/words.json is missing. Copy data/words.json to docs/words.json.");
  }

  for (const warning of warnings) {
    console.warn(`Warning: ${warning}`);
  }

  if (errors.length > 0) {
    console.error("Validation failed:\n");
    for (const error of errors) {
      console.error(`  - ${error}`);
    }
    process.exit(1);
  }

  console.log(`Validation passed (${words.length} words).`);
}

main();
