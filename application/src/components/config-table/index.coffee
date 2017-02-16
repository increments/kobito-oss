$ = React.createElement
LinkedStateMixin = require('react/lib/LinkedStateMixin')
module.exports = React.createClass
  mixins: [LinkedStateMixin]

  getInitialState: ->
    state = {}
    for k, v of @props.content
      state[k] = v.initialValue
    state

  componentDidUpdate: ->
    @props.onUpdate?(@state)

  render: ->
    $ 'div', className: 'configTable',
      for prop, v of @props.content
        if v.type is 'select'
          $ 'div', {className: 'config_section'}, [
            $ 'label', {className: 'config_section_title'}, v.label
            $ 'select', {className: 'config_section_select', onChange: v.onChange, valueLink: @linkState(prop)},
              for option in v.options
                $ 'option', {}, option
          ]
        else if v.type is 'checkbox'
          $ 'div', {className: 'config_section config_section-checkbox'}, [
            $ 'input',
              className: 'config_section_checkbox'
              type: v.type
              onChange: v.onChange
              checkedLink: @linkState(prop)
              id: 'check-' + (prop)
            $ 'label', {className: 'config_section_title-checkbox', htmlFor: 'check-' + (prop)}, v.label
          ]
        else
          $ 'div', {className: 'config_section'}, [
            $ 'label', {className: 'config_section_title'}, v.label
            $ 'input',
              className: 'config_section_input'
              type: v.type
              onChange: v.onChange
              valueLink: @linkState(prop)
          ]
