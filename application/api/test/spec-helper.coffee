global.Env = mode: 'test'

# stub db
StoneSkin = require 'stone-skin/with-tv4'
StoneSkin.IndexedDb = StoneSkin.MemoryDb

# Libraries
global.self = global # stub for fetch
# TODO: use myself dependencies
require '../../lib/setup/globals'

# stubs
global.localStorage = require 'localStorage'

# Assert
global.assert = require 'power-assert'
global.app ?= {track: ->}

sinon = require 'sinon'
beforeEach -> @sinon = sinon.sandbox.create()
afterEach  -> @sinon.restore()

# Stub database
schema = require './factory'
# localStorage.setItem 'dbVersion', 1

global.stubDatabases = ->
  beforeEach ->
    kaita.commands.initialize.initStorages()

  afterEach ->
    Item.clear()
    Team.clear()
    Template.clear()
    Log.clear()
    delete global.Item
    delete global.Team
    delete global.Template
    delete global.Log

# Factories
global.FactoryDog = require 'factory-dog'
schema.databases[0].collections.forEach (col) ->
  obj = {}
  for k, v of col.params
    key =
      if k[k.length-1] is '?'
        k[0...k.length-1]
      else
        k
    obj[key] = v

  name =
    if col.name[col.name.length-1] is 's'
      col.name[0...col.name.length-1]
    else
      col.name
  FactoryDog.define name, obj
FactoryDog.define 'qiita-item',
  id: 'string'
  body: 'string'
  coediting: 'boolean'
  created_at: 'string'
  private: 'boolean'
  rendered_body: 'string'
  tags: 'any[]'
  title: 'string'
  updated_at: 'any'
  url: 'string'
