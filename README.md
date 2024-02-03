# coc-clojure

coc.nvim wrapper for [clojure-lsp]. Heavily inspired by and some code borrowed from
[calva].

[clojure-lsp]: https://clojure-lsp.io/
[calva]: https://github.com/BetterThanTomorrow/calva

## Install

`:CocInstall coc-clojure`

## Refactoring commands

Every refactoring command listed on the [refactoring] page is available. They
are provided with the `lsp-clojure-` prefix:

[refactoring]: https://clojure-lsp.io/capabilities/#refactorings

- lsp-clojure-add-missing-import
- lsp-clojure-add-missing-libspec
- lsp-clojure-add-require-suggestion
- lsp-clojure-backward-barf
- lsp-clojure-backward-slurp
- lsp-clojure-change-coll
- lsp-clojure-change-collection
- lsp-clojure-clean-ns
- lsp-clojure-create-function
- lsp-clojure-create-test
- lsp-clojure-cursor-info
- lsp-clojure-cycle-coll
- lsp-clojure-cycle-privacy
- lsp-clojure-demote-fn
- lsp-clojure-destructure-keys
- lsp-clojure-docs
- lsp-clojure-drag-backward
- lsp-clojure-drag-forward
- lsp-clojure-drag-param-backward
- lsp-clojure-drag-param-forward
- lsp-clojure-expand-let
- lsp-clojure-extract-function
- lsp-clojure-extract-to-def
- lsp-clojure-forward-barf
- lsp-clojure-forward-slurp
- lsp-clojure-get-in-all
- lsp-clojure-get-in-less
- lsp-clojure-get-in-more
- lsp-clojure-get-in-none
- lsp-clojure-inline-symbol
- lsp-clojure-introduce-let
- lsp-clojure-kill-sexp
- lsp-clojure-move-coll-entry-down
- lsp-clojure-move-coll-entry-up
- lsp-clojure-move-form
- lsp-clojure-move-to-let
- lsp-clojure-project-tree
- lsp-clojure-promote-fn
- lsp-clojure-raise-sexp
- lsp-clojure-replace-refer-all-with-alias
- lsp-clojure-replace-refer-all-with-refer
- lsp-clojure-resolve-macro-as
- lsp-clojure-restructure-keys
- lsp-clojure-server-info
- lsp-clojure-sort-clauses
- lsp-clojure-sort-map
- lsp-clojure-suppress-diagnostic
- lsp-clojure-test-tree
- lsp-clojure-thread-first
- lsp-clojure-thread-first-all
- lsp-clojure-thread-last
- lsp-clojure-thread-last-all
- lsp-clojure-unwind-all
- lsp-clojure-unwind-thread

## Keymaps

By default, every command is bound to `<leader>cl[SHORTCUT]`, as defined by the
clojure-lsp website. This can be disabled in the configuration with
`clojure.keymaps.enable`.

If desired, these can be bound manually any way you want by relying on coc.nvim's
built-in `CocAsyncAction` function:

```vim
" Keymap
nmap <silent> rtl :call CocAsyncAction('runCommand', 'lsp-clojure-thread-last-all')<CR>

" Command
command! -nargs=0 RTL :call CocAsyncAction('runCommand', 'lsp-clojure-thread-last-all')
```

## Configuration

To be expanded/cleaned up at a later date. Also includes all initialization options from
`clojure-lsp` itself, not listed here for concision.

```json
"clojure.enable": {
    "type": "boolean",
    "default": true,
    "description": "Enable/disable coc-clojure extension"
},
"clojure.lsp-version": {
    "type": "string",
    "default": "latest",
    "description": "The version of clojure-lsp to install, aka '2022.05.31-17.35.50'. Can also be 'latest' or 'nightly'"
},
"clojure.lsp-check-on-start": {
    "type": "boolean",
    "default": true,
    "description": "Check for newer versions of clojure-lsp on start"
},
"clojure.lsp-install-path": {
    "type": "string",
    "description": "Where to install clojure-lsp. If blank, defaults to coc's data folder"
},
"clojure.executable": {
    "type": "string",
    "default": "clojure-lsp",
    "description": "Path to executable"
},
"clojure.executable-args": {
    "type": "array",
    "description": "Executable args",
    "items": {
        "type": "string"
    }
},
"clojure.keymaps.enable": {
    "type": "boolean",
    "default": true,
    "description": "Create normal-mode mappings for clojure-lsp commands"
},
"clojure.keymaps.shortcut": {
    "type": "string",
    "default": "<leader>cl",
    "description": "The keyboard shortcut that will prepend the created commands"
},
"clojure.startup-message": {
    "type": "boolean",
    "default": false,
    "description": "Enable/disable coc-clojure's message on startup"
},
"clojure.trace.server": {
    "type": "string",
    "default": "verbose",
    "enum": [
        "off",
        "messages",
        "verbose"
    ],
    "description": "Trace level between vim and clojure-lsp. Trace messages can be seen by calling CocCommand workspace.showOutput."
},
```

## License

MPL 2.0
