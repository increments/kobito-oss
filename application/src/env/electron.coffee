http      = global.require 'http'
fs        = global.require 'fs'
path      = global.require 'path'
crypto    = global.require 'crypto'

# electron object

{clipboard, shell, remote} = global.require 'electron'
{BrowserWindow, Menu} = remote.require 'electron'
app = remote.app

global.Env =
  mode: 'electron'
  buildMenu: (template = []) ->
    menu = Menu.buildFromTemplate template
    Menu.setApplicationMenu(menu)

  openExternal: (link) ->
    shell.openExternal link

  getHomePath: ->
    process.env.HOME ? process.env.HOMEPATH

  getUserStylePath: ->
    homePath = Env.getHomePath()

    if fs.existsSync(homePath + '/.kobito') or fs.existsSync(homePath + '/_kobito')
      userStylePath = path.join homePath, '.kobito/user.css'
      if fs.existsSync userStylePath
        return userStylePath

      userStylePath = path.join homePath, '_kobito/user.css'
      if fs.existsSync userStylePath
        return userStylePath
    return null

  openPreview: (itemId) ->
    previewWindow = new BrowserWindow width: 600, height: 800
    fname = "file://" + global.__dirname + "/preview.html?#{itemId}"
    try
      previewWindow.loadUrl fname
    catch e
      previewWindow.loadURL fname

  copyToClipboard: (text) ->
    clipboard.writeText text

  platform: -> process.platform

  createHash: (binary) ->
    sha1 = crypto.createHash('sha1')
    sha1.update(binary)
    sha1.digest('hex')
