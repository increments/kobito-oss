window.createMyEditor = require('./editor')
window.createOnelineEditor = require('./oneline')

# collectBufferWords = (cm, word) ->
#   _ = require 'lodash'
#   bufferWords = _.compact(cm.getValue().split(/\n|\s/))
#   _.uniq _.filter bufferWords, (w) ->
#     w.indexOf(word) > -1 and w isnt word
#
# window.createOnelineEditor = (container) ->
#   textarea = document.createElement('textarea')
#   textarea.placeholder = '検索'
#
#   container.appendChild(textarea)
#
#   defaultOptions = {
#
#   }
#   cm = CodeMirror.fromTextArea textarea,
#     theme: 'oneline'
#     extraKeys:
#       'Enter': -> console.log 'inhibit enter'
#
#   autocomplete = require('./plugins/autocompleter')
#   collect = (cm, word) ->
#     ['aaaa', 'bbb', 'ccc', '日本語'].filter (w) ->
#       w.indexOf(word) is 0 and w isnt word
#
#   onComposition = false
#   cm.display.input.textarea.addEventListener 'compositionstart', (cm) ->
#     onComposition = true
#
#   cm.display.input.textarea.addEventListener 'compositionend', (cm) ->
#     onComposition = false
#
#   cm.on 'change', (cm) ->
#     return if onComposition
#     autocomplete(cm, collect)
#
#   cm
