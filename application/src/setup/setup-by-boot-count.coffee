message = __('Do you allow to send your usage statistics data as an anonymous?')

module.exports = ->
  bootCount = app.config.getBootCount()
  if bootCount is 0
    app.track('first-boot')
    firstItems = require '../fixtures/first-items'
    Item.save(
      firstItems.map (item) ->
        item.compiled_body = kobito.utils.compileMarkdown(item.body)
        item
    ).then ->
      app.popup.showWelcomeMessage ->
        app.router.activeContext.update()

  app.config.setBootCount(bootCount + 1)
