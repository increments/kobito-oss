# require '../../../src/commands/sync/sync-teams'
describe "src/commands/sync/sync-teams", ->
  stubDatabases()

  context '#dropTeam', ->
    beforeEach ->
      Team.save([
        {_id: '1', name: 'foo1', local: false}
        {_id: '2', name: 'foo2', local: false}
      ])
      .then ->
        Item.save [
          {title: 'a', body: 'a', tags: [], teamId: '1', _id: 'i1'}
          {title: 'a', body: 'a', tags: [], teamId: '1', _id: 'i2'}
          {title: 'a', body: 'a', tags: [], teamId: '1', _id: 'i3'}
          {title: 'a', body: 'a', tags: [], teamId: '1', _id: 'i4'}
        ]

    it "should drop team and its items", ->
      Item.all().then (items) -> Team.all().then (teams) ->
        assert teams.length is 2
        assert items.length is 4
        kobito.commands.sync.dropTeam('1')
      .then ->
        Item.all().then (items) -> Team.all().then (teams) ->
          assert items.length is 0
          assert teams.length is 1

  context '#dropRemovedTeams', ->
    beforeEach ->
      @sinon.stub(kobito.qiita, "fetchTeams").returns Promise.resolve([
        {id: 'foo1'}
      ])

      Team.save([
        {_id: 'foo1', name: 'foo1', local: false}
        {_id: 'foo2', name: 'foo2', local: false}
        {_id: 'foo3', name: 'foo3', local: false}
      ])
      .then ->
        Item.save [
          {title: 'a', body: 'a', tags: [], teamId: 'foo1', _id: 'i1'}
          {title: 'a', body: 'a', tags: [], teamId: 'foo2', _id: 'i2'}
          {title: 'a', body: 'a', tags: [], teamId: 'foo3', _id: 'i3'}
        ]

    it "should drop team and its items", ->
      Item.all().then (items) -> Team.all().then (teams) ->
        assert teams.length is 3
        assert items.length is 3
        kobito.commands.sync.dropRemovedTeams()
      .then ->
        Item.all().then (items) -> Team.all().then (teams) ->
          assert items.length is 1
          assert teams.length is 1
