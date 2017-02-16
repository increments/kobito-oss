###
# Composition Mod for CodeMirror
# v2.0.2
# Zhusee <zhusee2@gmail.com>
#
# Additional instance properties added to CodeMirror:
#   - cm.display.inCompositionMode (Boolen)
#   - cm.display.compositionHead (Pos)
#   - cm.display.textMarkerInComposition (TextMarker)
###

modInitialized = false
TEXT_MARKER_CLASS_NAME = "CodeMirror-text-in-composition"
TEXT_MARKER_OPTIONS = {
  inclusiveLeft: true,
  inclusiveRight: true,
  className: TEXT_MARKER_CLASS_NAME
}
PREFIX_LIST = ['webkit', 'moz', 'o']

capitalizeString = (string) ->
  return string.charAt(0).toUpperCase() + string.slice(1)

getPrefixedPropertyName = (propertyName) ->
  tempElem = document.createElement('div')

  return propertyName if tempElem.style[propertyName]?

  for prefix in PREFIX_LIST
    prefixedPropertyName = prefix + capitalizeString(propertyName)
    return prefixedPropertyName if tempElem.style[prefixedPropertyName]?

  return false

CodeMirror.defineOption 'enableCompositionMod', false, (cm, newVal, oldVal) ->
  if newVal and !modInitialized
    if window.CompositionEvent?
      initCompositionMode(cm)
    else
      console.warn("Your browser doesn't support CompositionEvent.")
      cm.setOption('enableCompositionMod', false)

CodeMirror.defineOption 'debugCompositionMod', false, (cm, newVal, oldVal) ->
  inputField = cm.display.input

  return if !jQuery?

  if newVal
    $(inputField).on 'input.composition-debug keypress.composition-debug compositionupdate.composition-debug', (e) ->
      console.log "[#{e.type}]", e.originalEvent.data, inputField.value, e.timeStamp

    $(inputField).on 'compositionstart.composition-debug compositionend.composition-debug', (e) ->
      console.warn "[#{e.type}]", e.originalEvent.data, inputField.value, cm.getCursor(), e.timeStamp
  else
    $(inputField).off('.composition-debug')

setInputTranslate = (cm, translateValue) ->
  transformProperty = getPrefixedPropertyName("transform")
  # cm.display.input.style[transformProperty] = translateValue
  cm.display.input.textarea.style[transformProperty] = translateValue

resetInputTranslate = (cm) ->
  setInputTranslate("")

clearCompositionTextMarkers = (cm)->
  # Clear previous text markers
  textMarkersArray = cm.getAllMarks()
  for textMarker in textMarkersArray
    if textMarker? and textMarker.className is TEXT_MARKER_CLASS_NAME
      textMarker.clear()
      console.log "[TextMarker] Cleared" if cm.options.debugCompositionMod

  return true

initCompositionMode = (cm) ->
  inputField = cm.display.input
  # inputWrapper = cm.display.inputDiv
  cmWrapper = cm.display.wrapper
  inputWrapper = cm.display.input.textarea.parentElement
  inputWrapper.classList.add('CodeMirror-input-wrapper')

  input = inputField.textarea

  input.addEventListener 'compositionstart', (event) ->
    console.log 'composition started'

    return if !cm.options.enableCompositionMod

    cm.display.inCompositionMode = true
    cm.setOption('readOnly', true)

    cm.replaceSelection("") if cm.somethingSelected() # Clear the selected text first

    cm.display.compositionHead = cm.getCursor()

    console.log "[compositionstart] Update Composition Head", cm.display.compositionHead  if cm.options.debugCompositionMod

    inputField.value = ""
    console.log "[compositionstart] Clear cm.display.input", cm.display.compositionHead  if cm.options.debugCompositionMod

    inputWrapper.classList.add('in-composition')

  # CodeMirror.on inputField, 'compositionupdate', (event) ->
  input.addEventListener 'compositionupdate', (event) ->
    return if !cm.options.enableCompositionMod
    headPos = cm.display.compositionHead
    console.log 'composition update'

    if cm.display.textMarkerInComposition
      markerRange = cm.display.textMarkerInComposition.find()

      cm.replaceRange(event.data, headPos, markerRange.to)
      cm.display.textMarkerInComposition.clear()
      cm.display.textMarkerInComposition = undefined
    else
      cm.replaceRange(event.data, headPos, headPos)

    endPos = cm.getCursor()
    cm.display.textMarkerInComposition = cm.markText(headPos, endPos, TEXT_MARKER_OPTIONS)

    pixelToTranslate = cm.charCoords(endPos).left - cm.charCoords(headPos).left
    setInputTranslate(cm, "translateX(-#{pixelToTranslate}px)")

  # CodeMirror.on inputField, 'compositionend', (event) ->
  input.addEventListener 'compositionend', (event) ->
    return if !cm.options.enableCompositionMod

    event.preventDefault()

    textLeftComposition = event.data
    headPos = cm.display.compositionHead
    endPos = cm.getCursor()

    cm.replaceRange(textLeftComposition, headPos, endPos)
    console.log 'composition end', textLeftComposition

    cm.display.inCompositionMode = false
    cm.display.compositionHead = undefined
    cm.display.textMarkerInComposition?.clear()
    cm.display.textMarkerInComposition = undefined
    cm.setOption('readOnly', false)

    inputWrapper.classList.remove('in-composition')

    clearCompositionTextMarkers(cm)

    postCompositionEnd = ->
      return false if cm.display.inCompositionMode

      inputField.value = ""
      console.warn "[postCompositionEnd] Input Cleared" if cm.options.debugCompositionMod

      # CodeMirror.off(inputField, 'input', postCompositionEnd)
      input.removeEventListener 'input', postCompositionEnd
      console.log "[postCompositionEnd] Handler unregistered for future input events" if cm.options.debugCompositionMod

    # CodeMirror.on(inputField, 'input', postCompositionEnd)
    input.addEventListener 'input', postCompositionEnd
