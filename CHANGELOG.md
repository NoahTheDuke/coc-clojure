# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog], and
this project adheres to no versioning scheme.

[Keep a Changelog]: https://keepachangelog.com/en/1.0.0/

## Unreleased

## 0.0.16 - 2024-02-05

### Fixed
- Update .gitignore to keep lib/index.js.
- Stop using deprecated `registLanguageClient` method.

## 0.0.15 - 2024-02-05

### Added
- Support project tree view.
- Descriptions of each command to better support WhichKey. ([#10])
- New commands: `backward-barf`, `forward-barf`, `backward-slurp`, `forward-slurp`,
    `kill-sexp`, `raise-sexp`, `replace-refer-all-with-alias`,
    `replace-refer-all-with-refer`, `project-tree`.

[#10]: https://github.com/NoahTheDuke/coc-clojure/issues/10

### Fixed
- Clean up download logic. (via @laur89 [#13])

[#13]: https://github.com/NoahTheDuke/coc-clojure/pull/13

## 0.0.14

## 0.0.13

## 0.0.12

## 0.0.11

## 0.0.10

## 0.0.9

### Added
- Add config options to readme.

### Fixed
- .npmignore now ignores `.editorconfig`, `.markdownlint.json`, `.markdownlintignore`

## 0.0.8 - 2022-06-05

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
