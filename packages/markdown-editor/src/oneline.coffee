# collectBufferWords = (cm, word) ->
#   _ = require 'lodash'
#   bufferWords = _.compact(cm.getValue().split(/\n|\s/))
#   _.uniq _.filter bufferWords, (w) ->
#     w.indexOf(word) > -1 and w isnt word
extend = require 'extend'
module.exports = (container, options = {}) ->
  textarea = document.createElement('textarea')
  textarea.placeholder = options.placeholder ? '検索'

  container.appendChild(textarea)

  _options = extend {}, options,
    theme: 'oneline'

  cm = CodeMirror.fromTextArea textarea, _options

  autocomplete = require('./plugins/autocompleter')

  if options.collect
    onComposition = false
    cm.display.input.textarea.addEventListener 'compositionstart', (cm) ->
      onComposition = true

    cm.display.input.textarea.addEventListener 'compositionend', (cm) ->
      onComposition = false

    cm.on 'change', (cm) ->
      return if onComposition
      autocomplete(cm, options.collect)
  cm
