$ = React.createElement
T = React.PropTypes
module.exports = React.createClass
  mixins: [Arda.mixin]
  propTypes:
    autocomplete: T.bool.isRequired
    canditates: T.arrayOf(T.string)
    initialValue: T.string

  render: ->
    $ 'div', className: 'oneline-editor-container', ref: 'editorContainer'

  componentDidMount: ->
    return if Env.mode is 'test'

    container = @refs.editorContainer.getDOMNode()
    collect =
      if @props.autocomplete
        (cm, word) =>
          word = word.toLowerCase()
          tags = kaita.queries.getTags()
          tags
          .sort()
          .filter (w) ->
            w = w.toLowerCase()
            w.indexOf(word) is 0 and w isnt word
      else
        => []

    @codemirror = createOnelineEditor container,
      collect: collect
      placeholder: @props.placeholder
      extraKeys: @props.extraKeys ? {}

    if @props.initialValue?
      @codemirror.setValue @props.initialValue
