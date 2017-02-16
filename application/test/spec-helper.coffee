# Setup DOM Env
jsdom = require('jsdom').jsdom
global.document  = jsdom('<html><body></body></html>')
global.window    = document.defaultView
global.navigator = window.navigator
React = require 'react/addons'
global.TestUtils = React.addons.TestUtils
global.Env = mode: 'test'

global.DOMParser = require('xmldom').DOMParser

# Libraries
global.self = global # stub for fetch
require '../lib/setup/globals'

# stubs
global.localStorage = require 'localStorage'

# Assert
global.assert = require 'power-assert'
cheerio = require 'cheerio'
sinon = require 'sinon'

global.app ?= {track: ->}


# test helper
global.$ = (html) -> cheerio.load html

beforeEach -> @sinon = sinon.sandbox.create()
afterEach  -> @sinon.restore()

# Stub database
schema = require './factory'
StoneSkin = require 'stone-skin/with-tv4'
class ItemStore extends StoneSkin.MemoryDb
  storeName: 'items'
  schema: {}

class TeamStore extends StoneSkin.MemoryDb
  storeName: 'teams'
  schema: {}

class TemplateStore extends StoneSkin.MemoryDb
  storeName: 'templates'
  schema: {}

class LogStore extends StoneSkin.MemoryDb
  storeName: 'logs'
  schema: {}

global.stubDatabases = ->
  beforeEach ->
    global.Item = new ItemStore
    global.Team = new TeamStore
    global.Template = new TemplateStore
    global.Log = new LogStore

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
