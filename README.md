# coc-clojure

coc.nvim wrapper for clojure-lsp. Heavily inspired by and some code borrowed from
[Calva].

[Calva]: https://github.com/BetterThanTomorrow/calva

## Install

`:CocInstall coc-clojure`

## Refactoring commands

Every refactoring command listed on the [refactoring] page is available. They
are provided with the `lsp-clojure-` prefix:

[refactoring]: https://clojure-lsp.github.io/clojure-lsp/capabilities/#refactorings

* lsp-clojure-add-import-to-namespace
* lsp-clojure-add-missing-libspec
* lsp-clojure-clean-ns
* lsp-clojure-cycle-coll
* lsp-clojure-cycle-privacy
* lsp-clojure-expand-let
* lsp-clojure-extract-function
* lsp-clojure-inline-symbol
* lsp-clojure-introduce-let
* lsp-clojure-move-to-let
* lsp-clojure-thread-first
* lsp-clojure-thread-first-all
* lsp-clojure-thread-last
* lsp-clojure-thread-last-all
* lsp-clojure-unwind-all
* lsp-clojure-unwind-thread

## Keymaps

Every command can be bound to keymaps or Ex commands:

```vim
" Keymap
nmap <silent> rtl :call CocAction('runCommand', 'lsp-clojure-thread-last-all')<CR>

" Command
command! -nargs=0 RTL :call CocAction('runCommand', 'lsp-clojure-thread-last-all')
```

## License

MPL 2.0
