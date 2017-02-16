template = require './template'
pkg = require '../../../package.json'

module.exports = React.createClass
  mixins: [Arda.mixin]
  componentWillUnmount: -> Mousetrap.unpause()
  componentDidMount: -> Mousetrap.pause()
  onClickBack: ->
    app.router.popContext()
  render: ->
    template _.extend {}, @, @props, @state
