React    = require 'react'
_ = require 'lodash'

template = require '../templates/list-item'

module.exports = React.createClass
  mixins: [Arda.mixin]

  onClickTitle: (event) ->
    itemId = jQuery(event.target).closest('.item-title').data('itemId')
    @dispatch 'main:select-item', itemId

  onDbClick: (event) ->
    itemId = @props.item._id
    @dispatch 'main:transition:to-editor-with-item', itemId

  onContextMenu: (event) ->
    event.preventDefault()
    itemId = jQuery(event.target).closest('.item-title').data('itemId')
    @dispatch 'main:select-item', itemId

    setTimeout =>
      if global.require?
        {remote} = global.require('electron')
        {Menu, MenuItem} = remote
        menu = new Menu()
        menu.append(
          new MenuItem
            label: __ 'Edit'
            click: ->
              app.router.activeContext.emit 'main:open-item', itemId
        )
        menu.append(
          new MenuItem
            label: __ 'Delete'
            click: -> app.router.activeContext.emit 'main:send-selected-item-to-trash'
        )
        menu.append(
          new MenuItem
            label: __ 'Copy to clipboard'
            click: ->
              content = @props.item.title + '\n' + @props.item.body
              Env.copyToClipboard?(content)
        )
        menu.append(
          new MenuItem
            label: __ 'Preview with an external window'
            click: ->
              Env.openPreview itemId
        )
        menu.append(
          new MenuItem
            label: __ 'Upload'
            click: -> app.router.activeContext.emit 'main:upload-selected-item'
        )
        menu.popup remote.getCurrentWindow()
    , 120

  render: ->
    item = this.props.item
    statusColor =
      if !item.synced_at
        '#18abe5'
      else if item.local_updated_at > item.synced_at
        '#f78607'
      else
        'gray';

    # rename tags to _tags for jade registered propery name
    template _.extend {}, @, @props, @props.item,
      _tags: @props.item.tags,
      statusColor: statusColor
