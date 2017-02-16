window.addEventListener 'load', ->
  pkg = require('../package.json')
  console.log 'VERSION', pkg.version
  document.head.querySelector('title').innerHTML = 'Kobito'

  if global.require?
    require './env/electron'
  else
    require './env/web'

  do require './setup/_bootstrap'
