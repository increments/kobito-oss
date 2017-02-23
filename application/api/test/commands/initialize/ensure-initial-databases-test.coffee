describe "src/commands/initialize/ensure-initial-databases", ->
  stubDatabases()

  it "should ensure #inbox and #trash", ->
    kobito.commands.initialize.ensureInitialDatabases()
    .then ->
      Team.all()
    .then (teams) ->
      assert.deepEqual teams, [
        {
          _id: '#inbox',
          local: true,
          name: 'Inbox'
        },
        {
          _id: '#trash',
          local: true,
          name: 'ゴミ箱'
        }
      ]
