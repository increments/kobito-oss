{resetIndexedDb, resetAll, resetIndexedDbWithoutInbox} = require '../../utils/reset-storages'

module.exports =
  onUpdateConfigTable: (state) ->
    @dispatch 'config:update-config-table', state

  onClickSaveAndBack: ->
    @dispatch 'config:exit'

  onClickRelogin: ->
    @dispatch 'config:relogin'

  onClickDevTools: ->
    try
      eval "require('remote').getCurrentWindow().openDevTools()"
    catch e
      try
        global.require('electron').remote.getCurrentWindow().openDevTools()
      catch e2
        console.warn 'you are not in atom'

  onClickDump: ->
    Item.all()
    .then (items) ->
      fs = global.require 'fs'
      path = global.require 'path'
      env = global.process.env
      homePath = env.HOME ? env.HOMEPATH # HOMEPATH for windows
      dumpPath = path.join homePath, 'kaita-dump.json'
      itemsStr = JSON.stringify items
      fs.writeFileSync dumpPath, itemsStr
      Logger.log( __('Dump done:') + dumpPath)

  onClickRestoreFromDump: ->
    app.popup.showWithChoices __('Restore data from dump'), [
      {
        text: __ 'Restore'
        type: 'danger'
        onSelect: =>
          fs = global.require 'fs'
          path = global.require 'path'
          env = global.process.env

          homePath = env.HOME ? env.HOMEPATH # HOMEPATH for windows
          dumpPath = path.join homePath, 'kaita-dump.json'

          if fs.existsSync(dumpPath)
            dump = fs.readFileSync(dumpPath).toString()
            Item.clear()
            .then ->
              json = JSON.parse dump
              Item.save(json)
              .then ->
                Logger.log __ 'Restore done'
                app.popup.close()
            .catch (error) ->
              console.error error
              Logger.log __('Restoration failed')
              app.popup.close()
          else
            Logger.warn(__('You have no dump:') + dumpPath)
            app.popup.close()
      }
      {
        text: __('Cancel')
        onSelect: =>
          app.popup.close()
      }
    ]

  onClickResetAll: ->
    app.popup.showWithChoices __('Are you OK to delete all your items and login infomation?'), [
      {
        text: __('Yes')
        onSelect: =>
          resetAll()
          app.popup.showWithChoices __('Delete done'), [
            {
              text: __('Reload')
              onSelect: => location.reload()
            }
          ]
      }
      {
        text: __('No')
        onSelect: ->
          app.popup.close()
      }
    ]

  onClickUpdateTeamAndTemplates: ->
    config = kobito.storages.singletons.Config.getInstance()

    if config.getAPIToken()
      app.popup.showWithChoices __('Fetch current teams and templates'), [
        {
          text: __ 'Execute'
          type: 'positive'
          onSelect: =>
            app.popup.showLoader 'Now Loading...'
            kobito.commands.sync.syncTeamsAndTemplates()
            .then ->
              app.popup.close()
              Logger.log __ 'Updated teams and its templates'
            .catch (e) ->
              app.popup.close()
              Logger.log __ 'Failed to fetch'
        }
        {
          text: __('Cancel')
          type: 'negative'
          onSelect: ->
            app.popup.close()
        }
      ]
    else
      app.popup.showWithChoices __('You are not logged in'), [
        {
          text: __ 'Login'
          onSelect: =>
            app.router.replaceContext((require '../../contexts/login/login-context'), {})
            app.popup.close()
        }
        {
          text: __('Cancel')
          onSelect: ->
            app.popup.close()
        }
      ]
