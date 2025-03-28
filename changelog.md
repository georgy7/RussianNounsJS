# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.4.2] - 2025-03-27
### Fixed
- I packed letters more tightly before hashing, which led to a smaller spread
  of values for short words. This eventually reduced the size of the gzipped script
  by about 200 bytes. To reduce the chance of collisions, I added
  a parity bit for the number of letters.

## [1.4.1] - 2025-03-25
### Added
- `RussianNouns.createLemmaOrNull`. This is a method with minimal overhead.

### Fixed
- A bug in the stress dictionary, leading to ignoring whether words are animate.
- The processing of several words.

## [1.4.0] - 2025-03-24
This is a fairly large refactoring, during which it was possible to increase the speed
of passing tests by one and a half times. I simplified the internal representation
of lemmas, moved some operations to the beginning of the script execution
(see initializing the variables `stemData`, `decline1Data`, `declinePluralData`)
and moved most of the stress dictionary to a hardcoded set of word hashes
(for aesthetic reasons).

## [1.3.1] - 2021-11-13
### Changed
- A few lines in the default locative dictionary.

## [1.3.0] - 2021-11-09
### Added
- New logo drawn by [Alexander Elgin](https://github.com/ostelaymetaule).
  This is black chokeberry. These are berries with an astringent flavor.
- An experimental solution for the Issue #4: `rne.getLocativeForms(lemma)`

## [1.2.5] - 2021-07-30
### Added
- `RussianNouns.createLemmaNoThrow`. This is a method with Go-like error handling.

### Changed
- Minor changes in Engine.decline.
- Lemma constructor no longer validates arguments. It's not for external use anyway.
