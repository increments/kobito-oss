template = require '../templates/header'
  .locals
    Pulldown: require('../../pulldown')
    pulldownItemsFromTeams: (teams, arrangement, toItem, makeSep) ->
      items = []
      for arr in arrangement
        switch arr
          when '-', '*'
            items.push(arr)
          else
            [[team, ...], teams] = _.partition teams, (t) ->
              t._id is arr
            items.push(toItem(team)) if team
      # replace "*" by the rest of the teams
      if (i = items.indexOf('*')) isnt -1
        items[i..i] = teams.map(toItem)
      # dedup consecutive "-"s
      items = _.uniq(items, true)
      # remove first/last "-"
      if items[0] is '-' then items.shift()
      if items[-1..][0] is '-' then items.pop()
      # replace "-" by separator item and then return items
      items.map (item) -> if item is '-' then makeSep() else item

module.exports = React.createClass
  mixins: [Arda.mixin]
  render: ->
    # rename tags to _tags for jade registered propery name
    template _.extend {}, @, @props

  onClickSetting: (event) ->
    event.stopPropagation()
    @dispatch 'main:transition:to-config'

  onClickHome: (event) ->
    event.stopPropagation()
    @dispatch 'main:go-to-home'

  onClickLogin: (event) ->
    event.stopPropagation()
    @dispatch 'main:transition:to-login'

  onClickNew: ->
    event.stopPropagation()
    @dispatch 'main:transition:to-editor-as-new-item'

  onClickDeleteAll: ->
    event.stopPropagation()
    @dispatch 'main:ask-to-delete-all'

  onClickTemplate: (event) ->
    templateId = event.target.dataset.id
    @dispatch 'main:transition:to-editor-as-new-with-template', templateId

  onClickSync: (event) ->
    event.stopPropagation()
    @dispatch 'main:sync-items'
