# rollback to last space
getCursorWord = (cm) ->
  {ch, line} = cm.getCursor()
  text = cm.getLine(line)
  words = text[0...ch].split(' ')
  word = words[words.length - 1]
  {
  word
  from:
    line: line
    ch: ch - word.length
  to:
    line: line
    ch: ch
  }

# Auto complete
autocomplete = (cm, builder) ->
  return unless builder?
  cm.showHint
    completeSingle: false
    hint: ->
      cur = cm.getCursor()
      {word, from, to} = getCursorWord(cm)
      if word.length > 0
        list = builder(cm, word)
        return if list.length is 0
        {list, from, to}

module.exports = autocomplete
