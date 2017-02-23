describe 'domains/commands', ->
  context 'setupWithoutToken', ->
    stubDatabases()
    beforeEach ->
      @sinon.stub(kobito.commands, 'ensureUserId')
        .returns Promise.resolve()
      @sinon.stub(kobito.commands.sync, 'syncTeamsAndTemplates')
        .returns Promise.resolve()

    it 'ensure id', ->
      kobito.commands.initialize.setupWithoutToken()
      .then ->
        assert !kobito.commands.ensureUserId.called
        assert !kobito.commands.sync.syncTeamsAndTemplates.called
        Team.all()
      .then (teams) ->
        assert teams.length is 2
