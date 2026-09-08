# Imposter Words

The official Suret word list for [Imposter](https://games.assyrian.net/imposter), published by [Assyrian Network](https://www.assyrian.net).

This repo is the public lexicon: Eastern Suret in Syriac script, a Latin spelling, an English gloss, and a category. The game itself, the lobbies, and the in-game pictures live elsewhere.

## Browse

- [Word catalog](https://assyrian-network.github.io/imposter-words/)
- [`data/words.json`](data/words.json)
- [`schema/categories.json`](schema/categories.json)
- [`schema/word.schema.json`](schema/word.schema.json)

## Contribute

You do not need Git. [Propose a word](https://github.com/Assyrian-Network/imposter-words/issues/new?template=word.yml) in an issue. We review spelling, categories, duplicates, and whether it belongs in a family game. If we take it, we add it to the list.

If you already use Git, you can still open a pull request. That is optional.

[CONTRIBUTING.md](CONTRIBUTING.md) has both paths, lookup resources, and the family-friendly bar. Imposter is played with kids in the room. Passing tests does not mean we will merge it.

## Validation

```bash
npm run catalog
npm test
```

That checks the schema, category ids, duplicates, and a short list of English/Latin terms we will never ship. Only maintainers can push to `main`.

## License

The list is [CC BY 4.0](LICENSE). Opening a word-proposal issue or a pull request also grants Assyrian Network the rights in [CONTRIBUTING.md](CONTRIBUTING.md) so we can use the word in Imposter and other Assyrian Network projects.
