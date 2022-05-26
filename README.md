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

[refactoring]: https://clojure-lsp.io/clojure-lsp/capabilities/#refactorings

- lsp-clojure-add-import-to-namespace
- lsp-clojure-add-missing-import
- lsp-clojure-add-missing-libspec
- lsp-clojure-add-require-suggestion
- lsp-clojure-change-coll
- lsp-clojure-change-collection
- lsp-clojure-clean-ns
- lsp-clojure-create-function
- lsp-clojure-create-test
- lsp-clojure-cursor-info
- lsp-clojure-cycle-coll
- lsp-clojure-cycle-privacy
- lsp-clojure-demote-fn
- lsp-clojure-docs
- lsp-clojure-drag-backward
- lsp-clojure-drag-forward
- lsp-clojure-expand-let
- lsp-clojure-extract-function
- lsp-clojure-inline-symbol
- lsp-clojure-introduce-let
- lsp-clojure-move-coll-entry-down
- lsp-clojure-move-coll-entry-down
- lsp-clojure-move-coll-entry-up
- lsp-clojure-move-coll-entry-up
- lsp-clojure-move-form
- lsp-clojure-move-to-let
- lsp-clojure-promote-fn
- lsp-clojure-resolve-macro-as
- lsp-clojure-server-info
- lsp-clojure-sort-map
- lsp-clojure-suppress-diagnostic
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

## License

MPL 2.0
