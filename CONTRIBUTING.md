# Contributing

This is the public Suret word list for Imposter. You fork, you open a pull request, we review it. Below is what a good entry looks like and what we turn down.

## Before you start

- Fork the repository.
- Work in `data/words.json`. Leave other files alone unless we ask.
- Keep the PR small: one word, or a handful that clearly belong together.
- After you edit the list, run `npm run catalog` (copies the list into the catalog) and `npm test`.

## Adding a word

1. Fork and make a branch.
2. Add the entry to `data/words.json`.
3. Run `npm run catalog` and `npm test`.
4. Open a pull request. Say what the word is, and note dialect or spelling variants if they matter.

### Entry shape

```json
{
  "id": "w000",
  "display": {
    "eastern": {
      "syriac": "ܒܲܝܬܵܐ",
      "latin": "bayta"
    }
  },
  "categories": ["everyday_objects"],
  "english": "house"
}
```

### Required fields

| Field | Notes |
| --- | --- |
| `id` | `w` plus at least three digits (`w047`). Use `w000` if you are guessing. We set the real id when we merge. |
| `display.eastern.syriac` | Eastern Suret in Syriac script. |
| `display.eastern.latin` | Latin spelling of the same word. |
| `categories` | One or more ids from `schema/categories.json`. |
| `english` | Short English gloss. Accurate is enough. |

### Optional fields

- `display.western` — Western Suret (`syriac` + `latin`) if you know it.
- `hints.eastern` / `hints.western` — short hint pairs. Same family rules as the word itself.
- `seasonal.availableFrom` / `seasonal.availableUntil` — `MM-DD` window for holiday or seasonal words.

Do not add images, `visualAid`, or anything that only makes sense inside the game. This repo is the word list.

## Looking up words

Two places to find a form before you open a PR:

- [Chicago Assyrian Dictionary](https://isac.uchicago.edu/research/publications/chicago-assyrian-dictionary) — 21 volumes, free to read as PDFs. The largest published collection.
- [Sharrukin Assyrian Dictionary](https://www.sharrukin.io/assyrian-dictionary/) — interactive search of more than 6,000 words.

They are starting points. We still want the Eastern Suret form people actually say, and the family-friendly rules still apply.

## Spelling

- Use the Eastern Suret form people actually say.
- Match Latin spelling to nearby entries in the same category. Skim a few first.
- Vowels and dots should follow common community use, not a private system.
- If there are two accepted forms, pick one and mention the other in the PR. Do not file two entries for the same word.

## Family-friendly rules

Imposter is a family game. Kids play it. Every word, hint, and English gloss has to be something a parent is fine seeing on a child's screen.

`npm test` blocks a short list of English and Latin terms. That is the floor. We still read every PR, and our call is final. Green tests do not mean a merge.

We will not take:

- **Slurs** of any kind.
- **Swearing**, in English, Latin, or Suret.
- **Sexual or crude** words, including slang and sideways euphemisms.
- **Insults** whose main job is to put someone down.
- **Drugs, alcohol, smoking, and gambling** as playable words. Adult topics. Leave them out.
- **Gore.** Everyday words like `sword` or `army` are fine. Graphic harm is not.
- **Politics.** No parties, slogans, living politicians, or current campaign talk. Countries, cities, and older historical names are fine.
- **Religious mockery.** Everyday faith and cultural words (holidays, greetings) are welcome. Jabs and "gotcha" entries are not.
- **Bathroom jokes.** Plain body or health terms can stay. Joke words about bodily functions cannot.
- **Memes and brand gags** that will age badly. This list should still make sense in a few years.

If you are on the fence, say so in the PR. Ask. That is easier than a reject.

## Pull request checklist

- [ ] `npm run catalog` and `npm test` both pass
- [ ] No duplicate id, Syriac form, or Latin form
- [ ] Category fits
- [ ] English gloss is short and accurate
- [ ] The word meets the family-friendly rules
- [ ] The PR says what the word is and notes dialect if needed

## Review

We may ask for a spelling or category change, or we may decline the word. That includes words that pass tests but still feel wrong for a family game. We squash-merge, so `main` stays one commit per change.

## License

By opening a pull request you agree that:

1. You have the right to submit the material.
2. You license it under CC BY 4.0.
3. Assyrian Network may use it in Imposter and other Assyrian Network projects, with this repository named as the public source.
