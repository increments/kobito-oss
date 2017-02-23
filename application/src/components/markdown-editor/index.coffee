template = require './template'
actions  = require './actions'

uploadFileToS3 = require '../../utils/upload-file-to-s3'

dataURItoBlob = (dataURI) ->
  binary = atob(dataURI.split(',')[1])
  array = []
  for i in [0...binary.length]
    array.push(binary.charCodeAt(i))
  return new Blob([new Uint8Array(array)], {type: 'image/jpeg'})

module.exports = React.createClass
  mixins: [Arda.mixin, actions]

  activateTapSounds: ->
    # Tap sounds
    cur = 0
    audios =
      for i in [1..10]
        audio = new Audio
        audio.autoplay = false
        audio.volume = 0.4
        audio.src = './assets/tap.wav'
        audio

    setTimeout =>
      cur = 0
      @codemirror.on 'change', ->
        n = cur % 10
        audio = audios[cur % 10]
        audio.play(0)
        cur++
    , 100

  componentDidMount: ->
    container = @refs.editorContainer
    self = this
    languages = require('../../fixtures/complete-languages.json')

    cmOptions =
      autocomplete: true
      usernames: []
      languages: Object.keys(languages)
      emoji: require('emosa').getMap()
      theme: app.config.getTheme()
      indentUnit: 4
      extraKeys:
        "Ctrl-W": (cm) -> cm.foldCode cm.getCursor()
        "Ctrl-Q": (cm) ->
          if @__folded = !!!@__folded
            CodeMirror.commands.foldAll cm
          else
            CodeMirror.commands.unfoldAll cm
        'Ctrl-S': ->
          self.dispatch 'markdown-editor:save'

        'Cmd-S': ->
          self.dispatch 'markdown-editor:save'

        'Ctrl--': ->
          self.dispatch 'zoom:minus'

        'Ctrl-H': (cm) ->
          cm.constructor.commands.delCharBefore(cm)

        'Ctrl-Alt-F': (cm) ->
          cm.constructor.commands.replace(cm, false)

        'Cmd-Enter': ->
          self.dispatch 'markdown-editor:save-and-quit'
        'Ctrl-Enter': ->
          self.dispatch 'markdown-editor:save-and-quit'
        'Cmd-1': ->
          self.dispatch 'markdown-editor:toggle-preview-mode'
        'Ctrl-1': ->
          self.dispatch 'markdown-editor:toggle-preview-mode'
        "Down": 'goLineDown'
        "Tab": (cm) ->
          doc = cm.getDoc()
          line = doc.getLine(doc.getCursor().line)
          if /^[ \t]*(?:[*+-]|\d+\.) /.test(line)
            cm.execCommand("indentMore")
          else
            cm.replaceSelection("    " , "end")
        "Shift-Tab": (cm) ->
          cm.execCommand("indentLess")
        'Enter': newlineAndIndentContinueMarkdownList

    isVimMode = app.config.getVimMode()
    if isVimMode
      cmOptions.vimMode = true
      cmOptions.keyMap = 'vim'
    else
      cmOptions.vimMode = false
      cmOptions.keyMap = 'default'

    @codemirror = cm = createMyEditor container, cmOptions

    # Set usernames to cm for completion
    teamId = @props.teamId
    kobito.queries.isLocalTeam(teamId)
    .then (isLocal) ->
      unless isLocal
        Username.find(teamId)
        .then (u) ->
          if u
            cm.setOption('usernames', u.usernames)
            CodeMirror.signal(cm, 'autocompleteOptionsChange', cm)

    if app.config.getTapActive()
      @activateTapSounds()

    # Upload image on drop
    cm.on 'drop', (cm, ev) ->
      ev.preventDefault()
      file = ev.dataTransfer.files[0]
      self.uploadAndInsertImage(file)

    cm.setSize 'auto', '100%'

    cm.getWrapperElement().addEventListener "paste", (e) =>
      if items = e.clipboardData.items
        fileItems = _.filter items, (i) -> i.kind is 'file'
        if fileItems.length > 0
          [file] = fileItems
          @uploadAndInsertImage(file.getAsFile())
          e.preventDefault()
          return false
      true

    # TODO: This code hacks ctrl-+ for US / JIS keyboard
    # For the details, see http://qiita.com/mizchi/items/e8f6de520527da91a0f2
    cm.getWrapperElement().addEventListener "keydown", (e) =>
      metaPressed = e.metaKey or e.ctrlKey
      #  US / JIS
      if (e.keyCode is 187 and metaPressed) or (e.keyCode is 186 and e.shiftKey and metaPressed)
        e.preventDefault()
        self.dispatch 'zoom:plus'
        return false
      return true

  uploadAndInsertImage: (file) ->
    cm = @codemirror
    name = file.name ? 'image'
    teamId = @props.teamId

    kobito.queries.isLocalTeam(teamId)
    .then (isLocal) ->
      if isLocal
        cm.replaceSelection "![#{name}](#{file.path})"
      else
        origCursor = cm.getCursor()
        uploadingText = "![#{name} uploading...]()"
        cm.replaceSelection uploadingText
        app.popup.showLoader('Uploading')

        # This func restores scroll position and cursor position
        # bringing the cursor line to the center of the editor.
        restoreScrollPosition = (cursor, linkTextLength) ->
          {clientHeight} = cm.getScrollInfo()
          margin = clientHeight / 2
          # If the user haven't moved the cursor while uploading image, `cursor`
          # should be _at the end_ of placeholder text, while `origCursor` is
          # _at the beginning_ of it.
          # If the user haven't, move the cursor at the end of the inserted image link text
          # and scroll to the cursor bringing it to the center.
          # Otherwise restore and scroll to the current cursor position.
          if (cursor.line is origCursor.line) and (cursor.ch - uploadingText.length is origCursor.ch)
            newCursor = {line: origCursor.line, ch: origCursor.ch + linkTextLength}
            cm.setCursor(newCursor)
            cm.scrollIntoView(newCursor, margin)
          else
            cm.setCursor(cursor)
            cm.scrollIntoView(cursor, margin)

        uploadFileToS3(file, teamId)
        .then (data) =>
          cursor = cm.getCursor()
          linkText = "![#{name}](#{data.download_url})"
          cm.setValue cm.getValue().replace uploadingText, linkText
          restoreScrollPosition(cursor, linkText.length)
          app.popup.close()

        .catch (error) =>
          Logger.warn __('Failed to upload:') + error.message
          cursor = cm.getCursor()
          cm.setValue cm.getValue().replace uploadingText, ''
          restoreScrollPosition(cursor, 0)
          app.popup.close()

  render: ->
    template _.extend {}, @, @props, @state


# Modified version of newlineAndIndentContinueMarkdownList.
# Original code can be found at http://codemirror.net/addon/edit/continuelist.js
newlineAndIndentContinueMarkdownList = `(function() {
  "use strict";

  var listRE = /^(\s*)(>[> ]*|[*+-]\s|(\d+)([.)]))(\s*)/,
      emptyListRE = /^(\s*)(>[> ]*|[*+-]|(\d+)[.)])(\s*)$/,
      unorderedListRE = /[*+-]\s/;

  return function(cm) {
    if (cm.getOption("disableInput")) return cm.constructor.Pass;
    var ranges = cm.listSelections(), replacements = [];
    for (var i = 0; i < ranges.length; i++) {
      var pos = ranges[i].head;
      var eolState = cm.getStateAfter(pos.line);
      var inList = eolState.list !== false;
      var inQuote = eolState.quote !== 0;

      var line = cm.getLine(pos.line), match = listRE.exec(line);
      if (!ranges[i].empty() || (!inList && !inQuote) || !match) {
        cm.execCommand("newlineAndIndent");
        return;
      }
      if (emptyListRE.test(line)) {
        cm.replaceRange("", {
          line: pos.line, ch: 0
        }, {
          line: pos.line, ch: pos.ch + 1
        });
        replacements[i] = "\n";
      } else {
        var indent = match[1], after = match[5];
        var bullet = unorderedListRE.test(match[2]) || match[2].indexOf(">") >= 0
          ? match[2]
          : (parseInt(match[3], 10) + 1) + match[4];

        // Modified:
        // Don't insert a new bullet if the cursor position is at or before the
        // original bullet.
        var prefix = indent + bullet;
        if (pos.ch <= prefix.length) {
          replacements[i] = "\n" + prefix.slice(0, pos.ch);
        } else {
          replacements[i] = "\n" + indent + bullet + after;
        }
      }
    }

    cm.replaceSelections(replacements);
  };
})()`
