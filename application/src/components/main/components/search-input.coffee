template = require '../templates/search-input'
  .locals
    OnelineEditor: require '../../oneline-editor'

module.exports = React.createClass
  mixins: [Arda.mixin]

  componentDidMount: ->
    return if Env.mode is 'test'
    _cm = @refs.oneline.codemirror
    _cm.on 'change', =>
      @dispatch 'main:update-query', _cm.getValue()

    # _cm.display.input.textarea.addEventListener 'keydown', (event) =>
    #   if event.keyCode in [9] # tab or enter
    #     _cm.display.input.textarea.blur()
    #     document.body.focus()
    #     @dispatch 'main:focus-first-item'
    #     return
    #   return true

  render: ->
    template _.extend {
      extraKeys:
        Enter: (cm) =>
          cm.display.input.textarea.blur()
          @dispatch 'main:focus-first-item'

        Tab: (cm) =>
          cm.display.input.textarea.blur()
          @dispatch 'main:focus-first-item'

    }, @, @props, @state
