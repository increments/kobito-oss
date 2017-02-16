template = require '../templates/toolbar'
  .locals
    Pulldown: require '../../pulldown'

m = require 'moment'
module.exports = React.createClass
  mixins: [Arda.mixin]
  propTypes:
    selectedTeam: React.PropTypes.any
    teams: React.PropTypes.any
    showUpload: React.PropTypes.bool
    item: React.PropTypes.any

  onClickOpenQiita: ->
    app.track('open-on-qiita');

    qiitaId = @props.item.syncedItemId
    id = app.config.getUserObject()?.id ? ''
    link =
      if @props.item.teamId is 'qiita'
        "https://qiita.com/#{id}/items/#{qiitaId}"
      else
        "https://#{@props.item.teamId}.qiita.com/#{id}/items/#{qiitaId}"
    Env.openExternal link

  onClickClipboard: ->
    app.track('copy-to-clipboard');

    content = @props.item.title + '\n' + @props.item.body
    Env.copyToClipboard?(content)
    Logger.log('copied to clipboard: '+ @props.item.title)

  onClickOpenExternal: (event) ->
    app.track('open-external');

    itemId = event.target.dataset.itemId
    Env.openPreview itemId

  onClickDelete: (event) ->
    event.stopPropagation()
    itemId = event.target.dataset.itemId
    @dispatch 'main:send-to-trash', itemId

  onClickEdit: (event) ->
    event.stopPropagation()
    itemId = event.target.dataset.itemId
    @dispatch 'main:transition:to-editor-with-item', itemId

  onClickShare: (event) ->
    event.stopPropagation()
    itemId = event.target.dataset.itemId
    @dispatch 'main:upload-item', itemId

  onClickResolveConflict: ->
    app.popup.showWithChoices __('Select prefer item'), [
      {
        text: 'Qiita'
        type: 'negative'
        onSelect: =>
          app.popup.close()
          @dispatch 'toolbar:resolve-conflict-as-qiita'
      }
      {
        text: 'Kobito'
        type: 'negative'
        onSelect: =>
          app.popup.close()
          @dispatch 'toolbar:resolve-conflict-as-kobito'
      }
      {
        text: __('Cancel')
        onSelect: ->
          app.popup.close()
      }
    ]

  onClickMakeCoedit: ->
    @dispatch 'main:make-item-coedit', @props.item._id

  onClickExport: ->
    @dispatch 'main:export-item', @props.item._id

  onClickRecoverFromTrash: ->
    itemId = event.target.dataset.itemId
    Item.find(itemId)
    .then (item) =>
      kaita.commands.recoverFromTrash(itemId)
    .then =>
      app.router.activeContext.update() # TODO: move

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
      formatedSyncedAt: m(@props.item.synced_at * 1000).format('MM/DD HH:mm')
      teamItems: @props.teams
        # reject trash
        .filter (t) => t._id not in ['#trash']
        # reject itself team
        .filter (t) => t._id isnt @props.item.teamId
        .map (t) =>
          text: t.name
          id: t._id
          onSelect: =>
            # console.log 'team', t
            kaita.commands.transferItem(@props.item._id, t._id)
            .then =>
              app.router.activeContext.update (s) =>
                s.selectedItemId = null
                return s
