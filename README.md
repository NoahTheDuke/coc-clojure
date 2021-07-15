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

* clojure.add-import-to-namespace
* clojure.add-missing-libspec
* clojure.clean-ns
* clojure.cycle-coll
* clojure.cycle-privacy
* clojure.expand-let
* clojure.extract-function
* clojure.inline-symbol
* clojure.introduce-let
* clojure.move-to-let
* clojure.thread-first
* clojure.thread-first-all
* clojure.thread-last
* clojure.thread-last-all
* clojure.unwind-all
* clojure.unwind-thread

## Keymaps

Every command can be bound to keymaps or Ex commands:

```vim
" Keymap
nmap <silent> rtl :call CocAction('runCommand', 'lsp-clojure.thread-last')<CR>

" Command
command! -nargs=0 RTL :call CocAction('runCommand', 'lsp-clojure.thread-last')
```

## License

MPL 2.0
