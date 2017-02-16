# KeyMap
require '@mizchi/codemirror/keymap/sublime.js'
require '@mizchi/codemirror/keymap/vim.js'
require '@mizchi/codemirror/keymap/emacs.js'

module.exports = extraKeys =
  'Tab': (cm) =>
    console.log 'tab'
