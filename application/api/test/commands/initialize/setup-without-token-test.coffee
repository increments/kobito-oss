describe 'domains/commands', ->
  context 'setupWithoutToken', ->
    stubDatabases()
    beforeEach ->
      @sinon.stub(kaita.commands, 'ensureUserId')
        .returns Promise.resolve()
      @sinon.stub(kaita.commands.sync, 'syncTeamsAndTemplates')
        .returns Promise.resolve()

    it 'ensure id', ->
      kaita.commands.initialize.setupWithoutToken()
      .then ->
        assert !kaita.commands.ensureUserId.called
        assert !kaita.commands.sync.syncTeamsAndTemplates.called
        Team.all()
      .then (teams) ->
        assert teams.length is 2
