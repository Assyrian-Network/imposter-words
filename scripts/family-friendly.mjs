/**
 * Family-friendly checks for English and Latin fields.
 * Reviewers still judge Syriac and meaning. This only blocks
 * obvious English/Latin terms that do not belong in a children's game.
 */

export const DISALLOWED_GLOSSES = new Set([
  "anal",
  "anus",
  "ass",
  "asshole",
  "bastard",
  "bitch",
  "blowjob",
  "boob",
  "boobs",
  "cock",
  "crap",
  "cunt",
  "dick",
  "dildo",
  "fuck",
  "fucker",
  "fucking",
  "handjob",
  "horny",
  "jerkoff",
  "orgasm",
  "penis",
  "piss",
  "porn",
  "pussy",
  "rape",
  "sex",
  "shit",
  "slut",
  "sperm",
  "tits",
  "vagina",
  "whore",
]);

const TOKEN_SPLIT = /[^a-z0-9']+/;

export function tokenizeGloss(value) {
  return String(value)
    .toLowerCase()
    .split(TOKEN_SPLIT)
    .filter(Boolean);
}

export function findDisallowedGloss(value) {
  for (const token of tokenizeGloss(value)) {
    if (DISALLOWED_GLOSSES.has(token)) {
      return token;
    }
  }
  return null;
}
