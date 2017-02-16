describe 'setupWithToken', ->
  context 'without token', ->
    afterEach ->
      localStorage.clear()

    it 'throw', (done) ->
      kaita.commands.initialize.setupWithToken()
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
        @sinon.stub(kaita.commands, 'ensureUserId')
          .returns Promise.resolve()
        @sinon.stub(kaita.commands.sync, 'syncTeamsAndTemplates')
          .returns Promise.resolve()

      it 'ensure id', ->
        kaita.commands.initialize.setupWithToken('xxx')
        .then ->
          assert kaita.commands.ensureUserId.called
          assert kaita.commands.sync.syncTeamsAndTemplates.called
          Team.all()
        .then (teams) ->
          assert teams.length is 2
