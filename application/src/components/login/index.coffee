template = require './template'

detectCodeFromUrl = (url) =>
  if matched = url.match /code=[a-z0-9]+/g
    return matched[0].replace('code=', '')
  null

login = (code) ->
  config = require '../../../../config'
  Qiita.setEndpoint('https://qiita.com')
  Qiita.Resources.AccessToken.create_access_token(
    client_id: config.clientId,
    client_secret: config.clientSecret
    code: code
  )
  .then ({token}) ->
    # set token
    app.config.setAPIToken token
    Qiita.setToken token
    app.popup.showLoader(__ 'Initializing...')
    app.track('first-login')
    kaita.commands.initialize.setupAtFirstLogin()

postLogin = ->
  app.popup.close()
  Mousetrap.unpause()

  app.router.popContext()
  .then ->
    Team.all().then (teams) ->
      Template.all().then (templates) ->
        app.router.activeContext.update (s) ->
          user = app.config.getUserObject()
          s.teams =
            if user?.team_only
              teams.filter (t) -> t._id isnt 'qiita'
            else
              teams

          s.templates = templates.sort (a, b) ->
            (a.index ? 0) - (b.index ? 0)
          return s

        message = __('You got teams') + '\n\n'
        teamsText = teams
          .map (team) -> team.name
          .filter (name) -> name not in ['Inbox', 'Trash', 'ゴミ箱']
          .join('\n')

        app.popup.showWithChoices message + teamsText, [
          {
            text: __ 'Close'
            onSelect: =>
              app.popup.close()
              user = app.config.getUserObject()
              if user?.team_only isnt true
                app.router.activeContext.emit 'main:changeTeam', 'qiita'
          }
        ]

module.exports = React.createClass
  mixins: [Arda.mixin]

  componentWillUnmount: ->
    Mousetrap.unpause()

  componentDidMount: ->
    Mousetrap.pause()
    webview = @refs.webview.getDOMNode()
    webview.addEventListener 'did-get-redirect-request', (e) =>
      code = detectCodeFromUrl(e.newUrl || e.newURL)
      return unless code?
      login(code)
      .then -> postLogin()
      .catch (error) ->
        Mousetrap.unpause()
        app.popup.close()

  onClickBack: ->
    webview = @refs.webview.getDOMNode()
    webview.remove()
    app.router.popContext()

  render: ->
    template _.extend {}, @, @props, @state
