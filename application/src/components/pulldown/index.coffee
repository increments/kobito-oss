React    = require 'react'
_ = require 'lodash'
template = require './template'

module.exports = React.createClass
  mixins: [Arda.mixin]
  getInitialState: -> opened: false
  close: -> @setState opened: false
  onClickTitle: ->
    c = app.router.activeContext.getActiveComponent()

    # TODO: remove all
    pulldowns = [
      c.refs.header?.refs.teamPulldown
      c.refs.header?.refs.templatePulldown
    ]
    for i in pulldowns when i? and i isnt @
      i.close()

    @setState opened: !@state.opened
    return

  render: ->
    template _.extend {child: @props.children}, @, @props, @state, self: @
