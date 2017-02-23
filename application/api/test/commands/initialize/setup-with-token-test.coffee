describe 'setupWithToken', ->
  context 'without token', ->
    afterEach ->
      localStorage.clear()

    it 'throw', (done) ->
      kobito.commands.initialize.setupWithToken()
      .then -> done 1
      .catch -> done()

  context 'with token', ->
    stubDatabases()

    beforeEach ->
      localStorage.setItem 'api-token', 'xxx'
      afterEach -> localStorage.clear()

    context 'without id', ->
      beforeEach ->
        localStorage.removeItem('login-id')
        @sinon.stub(kobito.commands, 'ensureUserId')
          .returns Promise.resolve()
        @sinon.stub(kobito.commands.sync, 'syncTeamsAndTemplates')
          .returns Promise.resolve()

      it 'ensure id', ->
        kobito.commands.initialize.setupWithToken('xxx')
        .then ->
          assert kobito.commands.ensureUserId.called
          assert kobito.commands.sync.syncTeamsAndTemplates.called
          Team.all()
        .then (teams) ->
          assert teams.length is 2
