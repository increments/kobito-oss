module.exports =
  save: ->
    console.log 'onClickSave'
    @dispatch 'edit:save'

  onClickSave: ->
    console.log 'onClickSave'
    @dispatch 'edit:save'

  onClickSaveAndBack: ->
    console.log 'onClickSaveAndBack'
    @dispatch 'edit:saveAndBack'

  onClickUpload: ->
    @dispatch 'edit:upload'

  onSelectedGroupChanged: (ev) ->
    groupUrlName = ev.target.value
    @dispatch 'edit:change-group', groupUrlName

  onClickUpdate: ->
    @dispatch 'edit:update'

  onClickBackWithoutEditing: ->
    @dispatch 'edit:back-without-editing'

  onChangeCodemirror: ->
    text = @refs.editor.codemirror.getValue()
    tagText = @refs.tagBuffer.codemirror.getValue()

    @dispatch 'markdown-editor:change', text
    @setState
      isUpdated: (
        @state.startBuffer isnt text or
        @state.startTagTextBuffer isnt tagText
      )

  onChangeTagBuffer: ->
    text = @refs.editor.codemirror.getValue()
    tagText = @refs.tagBuffer.codemirror.getValue()

    @dispatch 'edit:updateTags', tagText
    @setState
      isUpdated: (
        @state.startBuffer isnt text or
        @state.startTagTextBuffer isnt tagText
      )
  onClickPreviewToggle: ->
    @dispatch 'markdown-editor:toggle-preview-mode'
