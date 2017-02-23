# keymap = _.defaults defaultKeymap.app, userKeymap
keymap = require '../fixtures/default-keymap'
module.exports = ->
  # TODO: override keymap by user setting
  # fs = require 'fs'
  # userSettingPath = process.env.HOME + '/.config/kobito/keymap.json'
  # userKeymap =
  #   if fs.existsSync userSettingPath
  #     require userSettingPath
  #   else
  #     {}

  _keymap = {}
  for name, field of keymap
    for key, v of field then do (key, v) ->
      _keymap[key] ?= {}
      _keymap[key][name] = v

  for key, v of _keymap then do (key, v) ->
    Mousetrap.bind key, (e) ->
      if app.popup?.state.type is 'none'
        eventName = _keymap[key]['app']
        if eventName
          e.preventDefault()
          app.router.activeContext.emit eventName
          return false
      else
        eventName = _keymap[key]['popup']
        console.log '===', key, _keymap[key], _keymap[key]['popup']
        if eventName
          e.preventDefault()
          app.popup.emit eventName
        return false

      return true
