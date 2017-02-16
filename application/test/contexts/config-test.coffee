require '../spec-helper'

describe "contexts/config", ->
  Config = require '../../lib/contexts/config/config-context'
  describe '#initState', ->
    it 'returns initial state', ->
      config = new Config
      Promise.resolve config.initState({})
      .then (state) ->
        assert state,
          loginId: null
          APIToken: null
          vimMode: false

  describe '#expandComponentProps', ->
    it 'returns templateProps', ->
      config = new Config
      Promise.resolve config.initState({}, {loginId: null, APIToken: null, vimMode: false})
      .then (state) ->
        assert state,
          loginId: null
          APIToken: null
          vimMode: false
