module.exports = =>
  try
    global.require('electron')
    return true
  catch err
    return false
