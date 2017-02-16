menus = require('../fixtures/default-menus')

if global.process?.env?.ENV isnt 'production'
  menus.push {
    label: __ 'Develop'
    submenu: [
      {
        label: 'devTools'
        key: 'Cmd+Alt+I'
        click: ->
          global.require('remote').getCurrentWindow().openDevTools()
      }
      {
        label: 'Reload'
        key: 'Cmd+R'
        click: ->
          location.reload()
      }

    ]
  }

macEditMenu =
  {
    label: __ 'Edit'
    submenu: [
      {
        label: 'Undo',
        accelerator: 'Command+Z',
        selector: 'undo:'
      },
      {
        label: 'Redo',
        accelerator: 'Shift+Command+Z',
        selector: 'redo:'
      },
      {
        type: 'separator'
      },
      {
        label: 'Cut',
        accelerator: 'Command+X',
        selector: 'cut:'
      },
      {
        label: 'Copy',
        accelerator: 'Command+C',
        selector: 'copy:'
      },
      {
        label: 'Paste',
        accelerator: 'Command+V',
        selector: 'paste:'
      },
      {
        label: 'Select All',
        accelerator: 'Command+A',
        selector: 'selectAll:'
      },
    ]
  }

module.exports = (mode) ->
  return unless global.require
  metaKey =
    if global.process.platform is 'darwin'
      'Cmd'
    else
      'Ctrl'

  templates = menus.map ({label, submenu}) ->
    {
      label: label
      submenu: submenu.map (item) ->
        {
          label: item.label
          accelerator: item.key?.replace '[Meta]', metaKey
          enabled:
            if not item.active?
              true
            else
              mode in item.active

          click: ->
            if item.click
              item.click?()
            else if item.event
              app.router.activeContext.emit(item.event)
        }
    }
  if global.process.platform is 'darwin'
    templates.push macEditMenu

  Env.buildMenu templates
