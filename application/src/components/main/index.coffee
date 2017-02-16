template = require './template'
  .locals
    # Shared components
    MarkdownPreview: require '../markdown-preview'
    MarkdownEditor: require '../markdown-editor'
    # Inner components
    ListItem: require './components/list-item'
    Toolbar:  require './components/toolbar'
    Header:   require './components/header'
    SearchInput:   require './components/search-input'

title = document.head.querySelector 'title'
lastItemPreviewTime = 0
lastSetTimeoutId = null
module.exports = React.createClass
  mixins: [Arda.mixin]

  render: ->
    # update title with team at render
    if title
      title.innerHTML = this.props.selectedTeam?.name + ' - Kobito'

    template _.extend {}, @, @props, @state,
      version: require('../../../package').version
      announcements: app?._announcements ? []

  # update
  componentWillUpdate: (nextProps, nextState) ->
    currentId = @props.selectedItem?._id
    nextId = nextProps?.selectedItem?._id
    if currentId? and nextId? and (currentId isnt nextId)
      console.log 'will change selected item id'
      now = Date.now()
      if now - lastItemPreviewTime < 500
        node = @refs.mdcontent?.getDOMNode()
        if node?
          clearTimeout(lastSetTimeoutId) if lastSetTimeoutId
          node.classList.add 'start-showing'
          node.classList.remove 'showing-done'
          lastSetTimeoutId = setTimeout ->
            node.classList.remove 'start-showing'
            node.classList.add 'showing-done'
            lastItemPreviewTime = Date.now()
          , 500
      else
        lastItemPreviewTime = now

  onClickContentBackground: (ev) ->
    @refs.header.refs.teamPulldown.setState opened: false
    @refs.header.refs.templatePulldown?.setState opened: false

  onClickTag: (event) ->
    event.stopPropagation()
    @dispatch 'main:update-query', event.target.value

  onClickDownload: (event) ->
    link = jQuery(event.target)
      .closest('.contentBody_blank_newVersionBtn').data('link')
    Env.openExternal event.target.dataset.link

  onClickContact: (event) ->
    app.router.pushContext require('../../contexts/contact/contact-context'), {}

  onClickLogin: (event) ->
    event.stopPropagation()
    @dispatch 'main:transition:to-login'

  componentDidUpdate: ->
    @fixSelectedItem()
    @autoFocus = false

  registerAutoFocus: ->
    @autoFocus = true

  fixSelectedItem: ->
    if @props.selectedItem? and @autoFocus
      @$container ?= jQuery('.titleList')
      $container = @$container
      $item = jQuery(@refs.titleList.getDOMNode())
        .find("[data-item-id=#{@props.selectedItem._id}]")
      containerTop = $container.offset().top
      itemTop      = $item.offset().top
      scrollAmount = $container.scrollTop()
      $container.scrollTop itemTop - containerTop + scrollAmount

      @$preview ?= jQuery('.contentBody_preview')
      @$preview.scrollTop(0)
