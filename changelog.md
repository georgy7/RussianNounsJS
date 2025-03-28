# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.0] - 2021-11-09
### Added
- New logo drawn by [Alexander Elgin](https://github.com/ostelaymetaule).
  This is black chokeberry. These are berries with an astringent flavor.
- An experimental solution for the Issue #4: `rne.getLocativeForms(lemma)`

## [1.2.5] - 2021-07-30
### Added
- `RussianNouns.createLemmaNoThrow` method with Go-like error handling.

### Changed
- Minor changes in Engine.decline.
- Lemma constructor no longer validates arguments. It's not for external use anyway. 