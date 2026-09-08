# Imposter Words

The official Suret word list for [Imposter](https://games.assyrian.net/imposter), published by [Assyrian Network](https://www.assyrian.net).

This repo is the public lexicon: Eastern Suret in Syriac script, a Latin spelling, an English gloss, and a category. The game itself, the lobbies, and the in-game pictures live elsewhere.

## Browse

- [Word catalog](https://assyrian-network.github.io/imposter-words/)
- [`data/words.json`](data/words.json)
- [`schema/categories.json`](schema/categories.json)
- [`schema/word.schema.json`](schema/word.schema.json)

## Contribute

Fork the repo, add a word, open a pull request. We review spelling, categories, duplicates, and whether the word belongs in a family game before it lands on `main`.

1. Fork
2. Edit `data/words.json`
3. Run `npm run catalog` then `npm test`
4. Open a pull request (one word, or a small related set)

[CONTRIBUTING.md](CONTRIBUTING.md) has the field rules, spelling notes, and the family-friendly bar. Imposter is played with kids in the room. Passing tests does not mean we will merge it.

## Validation

```bash
npm run catalog
npm test
```

That checks the schema, category ids, duplicates, and a short list of English/Latin terms we will never ship. Only maintainers can push to `main`.

## License

The list is [CC BY 4.0](LICENSE). Opening a pull request also grants Assyrian Network the rights in [CONTRIBUTING.md](CONTRIBUTING.md) so we can use the word in Imposter and other Assyrian Network projects.
