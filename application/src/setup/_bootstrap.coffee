m = require 'moment'
pkg = require '../../package'
isNewElectron = require '../utils/is-new-electron'

module.exports = ->
  # Initialize global properties
  Promise.resolve()
  .then ->
    require './globals'

  # Init router
  .then ->
    Layout = require '../components/layout'
    app.router = new Arda.Router Layout, document.body

  # Logger start
  .then -> Logger.start()

  # Apply theme
  .then ->
    theme = app.config.getTheme()
    document.head.querySelector('link').href = "css/#{theme}-theme.css"

  # Initialize databases
  .then -> kobito.commands.initialize.initStorages(pkg.dbVersion)

  # Enter with login or not
  .then ->
    if token = app.config.getAPIToken()
      kobito.commands.initialize.setupWithToken(token)
    else
      kobito.commands.initialize.setupWithoutToken()

  # Apply keybinds
  .then -> do require './keybinds'

  # Load user settings
  .then -> do require './load-user-settings'

  # Enter main
  .then ->
    MainContext = require '../contexts/main/main-context'
    app.track 'application-booted', isLoggedIn: app.config.getUserObject()?
    app.router.pushContext(MainContext, {})
  .then ->
    if isNewElectron()
      do require './setup-by-boot-count'

  # If login fail, Report it
  .catch (e) ->
    console.error e if e
    app?.popup?.close()
    MainContext = require '../contexts/main/main-context'
    app.router.pushContext MainContext, {}
    app.track 'application-booted-with-error'
