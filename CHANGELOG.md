# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog], and
this project adheres to no versioning scheme.

[Keep a Changelog]: https://keepachangelog.com/en/1.0.0/

## [Unreleased]

### Added
- Add config options to readme.

### Fixed
- .npmignore now ignores `.editorconfig`, `.markdownlint.json`, `.markdownlintignore`

## [0.0.8] - 2022-06-05

### Added
- Start writing a changelog.
- Add markdown linting with [markdownlint] (configured with `.markdownlint.json` and
    `.markdownlintignore`).
- New config option: `clojure.lsp-check-on-start`, defaults to `true`.
    If `true` and coc-clojure manages clojure-lsp, checks Github to see if a new version
    can be downloaded. If so, it follows the existing download path.
- Bring in [Calva PR #1762].

[markdownlint]: https://github.com/DavidAnson/markdownlint
[Calva PR #1762]: https://github.com/BetterThanTomorrow/calva/pull/1762

### Fixed
- [#5]: Changed logic for checking existing clojure-lsp install:
    1. Is config option `clojure.executable` an executable on the PATH?
    2. Is config option `clojure.executable` a path?
    3. Did `coc-clojure` already install it previously, respecting config option
       `clojure.lsp-install-path`?

    If none of those are true, then attempt to download a native binary.
- Doesn't load if expected executable is a jar and `JAVA_HOME` is not set.

[#5]: https://github.com/NoahTheDuke/coc-clojure/issues/5

## Before 0.0.8
- Who knows, it's ancient history.

[Unreleased]: https://github.com/NoahTheDuke/coc-clojure/compare/v0.0.8...HEAD
[0.0.8]: https://github.com/NoahTheDuke/coc-clojure/compare/v0.0.7...v0.0.8
