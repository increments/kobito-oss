T = React.PropTypes
module.exports = React.createClass
  childContextTypes:
    shared: T.object

  contextTypes:
    shared: T.object

  getChildContext: ->
    shared: @getContext()

  getContext: -> this.state.activeContext or @context.shared

  getInitialState: ->
    activeContext: null
    templateProps: {}

  componentDidMount: ->
    @popupRouter = new Arda.Router(Arda.DefaultLayout, @refs.popup.getDOMNode())
    @popupRouter.pushContext(require('../../contexts/popup/popup-context'), {}).then (context) =>
      app.popup = context
      @popupRouter.emit 'popup:ready'

    @loggerRouter = new Arda.Router(Arda.DefaultLayout, @refs.logger.getDOMNode())
    @loggerRouter.pushContext(require('../../contexts/logger/logger-context'), {}).then (context) =>
      app.logger = context
      @loggerRouter.emit 'logger:ready'

  render: ->
    $ = React.createElement
    $ 'div', id: 'layout',  [
      $ 'div', ref: 'popup', className: 'popupContainer', style: {width: '100%'}
      $ 'div', ref: 'logger', className: 'loggerContainer', style: {width: '100%'}
      if @state.activeContext?
        @state.templateProps.ref = 'root'
        React.createElement @state.activeContext?.component, @state.templateProps
      else
        null
    ]
