# External
window.CodeMirror = require '@mizchi/codemirror/lib/codemirror.js'
extend = require 'extend'

# Plugins
require './requirements/plugins'
require './requirements/modes'
require './requirements/themes'
require './requirements/styles'
# require './plugins/codemirror-composition-mod'

# Style
require './style.css'

defaultOptions = require './default-options'

# autocomplete: boolean
# usernames: string[]
# languages: string[]
# emoji: Map<string, string>
module.exports = (container, options) ->
  if (typeof container) is 'string'
    container = document.querySelector container
  textarea = document.createElement('textarea')
  textarea.placeholder = '1行目にタイトルを入力...'
  container.appendChild(textarea)
  options = extend defaultOptions, options
  cm = CodeMirror.fromTextArea textarea, options

  if options.autocomplete
    activateAutocomplete(cm)

  cm.on 'autocompleteOptionsChange', (cm) ->
    if cm.getOption('autocomplete')
      activateAutocomplete(cm)

  cm

currentChangeEventListener = null

activateAutocomplete = (cm) ->
  usernames = cm.getOption('usernames')
  languages = cm.getOption('languages')
  emoji = cm.getOption('emoji')

  if usernames
    usernameCandidates = usernames.map (k) -> '@' + k + ' '
  if languages
    languageCandidates = languages.map (k) -> '```' + k + '\n'
  if emoji
    emojiCandidates = Object.keys(emoji).map (k) -> ':' + k + ': '

  autocomplete = require('./plugins/autocompleter')

  collect = (cm, word) ->
    {ch, line} = cm.getCursor()
    if emojiCandidates? and word[0] is ':'
      emojiCandidates.filter (w) -> w.indexOf(word) is 0
    else if usernameCandidates? and word[0] is '@'
      usernameCandidates.filter (w) -> w.indexOf(word) is 0
    else if languageCandidates? and word.indexOf('```') is 0 # and ch is 3
      if isCursorOdd(cm)
        languageCandidates.filter (w) -> w.indexOf(word) is 0
      else
        []
    else
      []

  if currentChangeEventListener
    cm.off('change', currentChangeEventListener)

  cm.on 'change', currentChangeEventListener = (cm) ->
    autocomplete(cm, collect)

isCursorOdd = (cm) ->
  findIndex = require 'find-index'
  {ch, line} = cm.getCursor()
  value = cm.getValue()
  lines = value.split('\n')
  lineObjs = lines
    .map (line, n) -> {line, n}
    .filter (o) -> o.line.indexOf('```') is 0
  index = findIndex lineObjs, (o) -> o.n is line
  index % 2 is 0
