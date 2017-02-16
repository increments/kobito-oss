# Exposed libraries to global

require './i18n'

global.WeakMap = require 'weakmap'
global.jQuery  = require 'jquery'
global._       = require 'lodash'
global.Qiita   = require 'qiita-js'
global.React   = require 'react'
global.Arda    = require 'arda'
global.kaita   = require '../../api/dist/kaita'
global.Logger  = require '../utils/logger'
try require 'mousetrap'
try require 'mousetrap/plugins/pause/mousetrap-pause'

# App
Application = require '../application'
global.app = new Application

if Env.mode not in ['test']
  global.Promise   = require 'bluebird'
  # Promise setting
  Promise.longStackTraces()
  Promise.onPossiblyUnhandledRejection (error) ->
    # Skip non-active update
    if error.message?.indexOf('Context is not active') > -1
      console.warn error
      return

    # Error on multi boot
    if error.message?.indexOf("'transaction' of null") > -1
      app.popup.showErrorStack __ '''
      You can't boot multi applications at once.
      '''
      return

    console.error error
    Logger.warn 'Error:' + error.message
    app.popup.close()
    message = error.message
    stack = error.stack
      .split __dirname
      .join 'app:/'
    app.popup.showErrorStack __('Unknown Error:') + message, stack
    app.track 'error', message: message

if window?
  # Hack a tag
  jQuery('body').on 'click', 'a', (ev) ->
    ev.preventDefault()
    link = jQuery(ev.target).closest('a').attr('href')
    Env.openExternal(link)

  # Ask at finish on editor
  onbeforeunload = (ev) ->
    Edit = require '../contexts/edit/edit-context'
    if app.router.activeContext instanceof Edit
      ev.preventDefault()

      # focus out editor
      try
        c = app.router.activeContext.getActiveComponent()
        c.refs.editor.codemirror.display.input.textarea.blur()

      app.popup.showWithChoices __('You are on editing. Quit OK?'), [
        {
          text: __ 'Finish'
          type: 'danger'
          onSelect: ->
            jQuery(window).off 'beforeunload', onbeforeunload
            app.popup.close()
            window.close()
        }
        {
          text: __ 'Cancel'
          onSelect: ->
            app.popup.close()
        }
      ], false, 1
      return false
    else
      return true

  # jQuery(window).on 'beforeunload', onbeforeunload
