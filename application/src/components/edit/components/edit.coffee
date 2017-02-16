template = require '../templates/edit'
  .locals
    MarkdownEditor: require '../../markdown-editor'
    MarkdownPreview: require '../../markdown-preview'
    Pulldown: require '../../pulldown'
    OnelineEditor: require '../../oneline-editor'

module.exports = React.createClass
  mixins: [Arda.mixin, require('../actions')]
  startAutoSaving: ->
    @stopAutoSaving()
    @autosaveIntervalId = setInterval =>
      @stopAutoSaving()
      @dispatch 'edit:save' # TODO
    , 60 * 1000
    console.log('auto save started', @autosaveIntervalId);

  onClickOpenQiita: ->
    qiitaId = @props.item.syncedItemId
    id = app.config.getUserObject()?.id ? ''
    link =
      if @props.item.teamId is 'qiita'
        "https://qiita.com/#{id}/items/#{qiitaId}"
      else
        "https://#{@props.item.teamId}.qiita.com/#{id}/items/#{qiitaId}"
    Env.openExternal link

  onChangeInsertImageInput: (ev) ->
    input = ev.target
    if input.files.length > 0
      @refs.editor.uploadAndInsertImage input.files[0]

  stopAutoSaving: ->
    if @autosaveIntervalId?
      console.log('auto save stopped', @autosaveIntervalId)
      @autosaveIntervalId = null
      clearInterval @autosaveIntervalId

  componentWillUnmount: ->
    @stopAutoSaving()

  getInitialState: ->
    startBuffer: ''
    startTagTextBuffer: ''
    isUpdated: false
    editorInitialized: false

  componentDidMount: ->
    {title, body, tags} = @context.shared.state.buffer
    tagBuffer = this.refs.tagBuffer.codemirror
    tagBuffer.setValue(tags.map((tag) => tag.name).join(' ') ? '')
    tagBuffer.on 'change', @onChangeTagBuffer

    # Eject return for codemirror placehodler
    initialValue =
      if body.length > 0
        title+'\n'+body
      else
        title ? ''
    @refs.editor.codemirror.setValue initialValue
    @refs.editor.codemirror.clearHistory() # Guard by undo
    @refs.editor.codemirror.focus()
    @refs.editor.codemirror.on 'change', @onChangeCodemirror

    # Scroll adjustment
    # TODO: apply correct scroll ammount

    $preview = null
    $mdContent = null
    @refs.editor.codemirror.on 'scroll', (cm) =>
      $preview ?= jQuery('.preview')
      $mdContent ?= jQuery('.preview .markdown-content')

      {top, height, clientHeight} = cm.getScrollInfo()
      scrolledRate = top/(height-clientHeight)
      previewHeight = $mdContent.height()
      $preview.scrollTop previewHeight*scrolledRate

    @startAutoSaving()

  render: ->
    tagExtraKeys =
      Enter: (cm) =>
        @dispatch 'edit:saveAndBack'
      Tab: (cm) =>

    template _.extend {tagExtraKeys}, @, @props, @state
