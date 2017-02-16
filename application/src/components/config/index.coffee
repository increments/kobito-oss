template = require './template'
  .locals
    ConfigTable: require '../config-table'

actions  = require './actions'

module.exports = React.createClass
  mixins: [Arda.mixin, actions]

  onClickCog: ->
    @cnt ?= 0
    @cnt++
    if @cnt > 4
      this.context.shared.update (s) ->
        s.showDebugMenu = true
        return

  render: ->
    # global.require means avoiding browserify polyfill

    if global.require?
      # TODO: global.require doesnt exist on test
      path = global.require 'path'
      homePath = global.process.env.HOME ? global.process.env.HOMEPATH
      dumpPath = path.join homePath, 'kaita-dump.json'
    else
      dumpPath = 'kaita-dump.json'
    template _.extend {}, @, @props, @state, {dumpPath}
