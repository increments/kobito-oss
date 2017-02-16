message = __('Do you allow to send your usage statistics data as an anonymous?')

openUrgeToLogin = ->
  loginMessage = __ '''
  <span class="qsf qsf-qiita-o modal_content_loginLogo"></span>
  <strong>How about Log and Share your technical knowledge?</strong>

  Qiita is a technical knowledge sharing and collaboration platform for programmers.If you logged in to Qiita, you can upload items to Qiita from Kobito.

  <a href='https://qiita.com/about'><i class="fa fa-arrow-circle-right"></i> about qiita.com</a>
  '''
  app.popup.showWithChoices loginMessage, [
    {
      text: __ 'Login to Qiita'
      onSelect: ->
        app.track('login:from-boot-count')
        app.router.activeContext.emit('main:transition:to-login')
        app.popup.close()
    }
    {
      text: __ 'Cancel'
      onSelect: ->
        app.popup.close()
    }
  ]
  , true

module.exports = ->
  bootCount = app.config.getBootCount()
  if bootCount is 0
    app.track('first-boot')
    firstItems = require '../fixtures/first-items'
    Item.save(
      firstItems.map (item) ->
        item.compiled_body = kaita.utils.compileMarkdown(item.body)
        item
    ).then ->
      app.popup.showWelcomeMessage ->
        app.router.activeContext.update()

        app.config.setAllowToSendInfo(true)
        app.popup.showWithChoices message, [
          {
            text: __ 'Yes'
            onSelect: ->
              app.track('allowToSendInfoAtFirst')
              app.config.setAllowToSendInfo(true)
              openUrgeToLogin()
          }
          {
            text: __ 'No'
            onSelect: ->
              app.track('disallowToSendInfoAtFirst')
              app.config.setAllowToSendInfo(false)
              openUrgeToLogin()
          }
        ]

  # Show login popup by 5, 15, 25, ...
  # CAUTION!!! do not conflict with upper one.
  if bootCount % 10 is 5
    unless app.config.getUserObject()?
      app.track('login:urge-to-login')
      openUrgeToLogin()

  app.config.setBootCount(bootCount + 1)
