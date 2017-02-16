module.exports = ->
  try
    userStylePath = Env.getUserStylePath()
    if userStylePath
      fs = global.require 'fs'
      link = document.createElement 'link'
      link.rel = 'stylesheet'
      link.type = 'text/css'
      link.href = 'file://' + userStylePath
      document.head.appendChild link
