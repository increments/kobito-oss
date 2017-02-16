ReactTransitionGroup = require 'react/lib/ReactTransitionGroup'
LinkedStateMixin = require 'react/lib/LinkedStateMixin'

template = require './logger-template'
  .locals {ReactTransitionGroup}

module.exports = React.createClass
  mixins: [Arda.mixin, LinkedStateMixin]
  render: ->
    template _.extend {}, @, @props, @state
