window.addEventListener 'load', ->
  require './env/electron'
  require './setup/globals'
  pkg = require '../package'
  kaita.commands.initialize.initStorages(pkg.dbVersion)
  .then ->
    itemId = location.search.substr(1)
    console.log 'open id', itemId
    Item.find(itemId)
    .then (item) ->
      title = item.title
      compiled = item.compiled_body
      document.title = title
      html = """
      <div class='contentBody_preview'>
        <h1>#{title}</h1>
        <div class='markdown-content'>
          #{compiled}
        </div>
      </div>
      """
      document.body.innerHTML = html
    .catch (error) ->
