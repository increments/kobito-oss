module.exports = React.createClass
  mixins: [Arda.mixin]
  render: ->
    md = @props.body ? ''
    md = md.replace(/\t/g, '    ')
    @_last_el ?= React.createElement('div')
    el = kobito.utils.compileMarkdownForPreview md
    @_last_el = el
    React.createElement 'div', className: 'markdown-content', [el]

  componentDidMount: ->
    @_update()

  componentDidUpdate: ->
    @_update()

  _update: ->
    # set onclick handler to footnotes
    # here be dragons!
    self = @getDOMNode()
    jQuery(self).find('sup[id^="fnref"] > a').off('click').on 'click', (ev) =>
      @$container ?= jQuery(self.parentNode)
      hash = ev.target.hash # something like "#fn1"
      $targetEl = jQuery(self).find(hash)
      @$container.scrollTop($targetEl.position().top + @$container.scrollTop())
      false
    jQuery(self).find('li[id^="fn"] a[href^="#fnref"]').off('click').on 'click', (ev) =>
      @$container ?= jQuery(self.parentNode)
      hash = ev.target.hash # something like "#fnref1"
      $targetEl = jQuery(self).find(hash)
      @$container.scrollTop($targetEl.position().top + @$container.scrollTop())
      false
