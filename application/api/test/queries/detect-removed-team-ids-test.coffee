describe "src/queries/detect-removed-team-ids", ->
  stubDatabases()

  context "same team ids", ->
    beforeEach ->
      Team.save [
        {_id: 'foo1', name: "foo1", local: false}
        {_id: 'foo2', name: "foo2", local: false}
      ]

      @sinon.stub(kaita.qiita, "fetchTeams").returns Promise.resolve([
        {id: 'foo1'}
        {id: 'foo2'}
      ])

    it "should be blank array", ->
      kaita.queries.detectRemovedTeamIds()
      .then (ids) ->
        assert.deepEqual ids, []

  context "foo2 removed", ->
    beforeEach ->
      Team.save [
        {_id: 'foo1', name: "foo1", local: false}
        {_id: 'foo2', name: "foo2", local: false}
      ]

      @sinon.stub(kaita.qiita, "fetchTeams").returns Promise.resolve([
        {id: 'foo1'}
      ])

    it "should detect team id not on server", ->
      kaita.queries.detectRemovedTeamIds()
      .then (ids) ->
        assert.deepEqual ids, ['foo2']
