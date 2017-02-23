describe "src/commands/transfer-item", ->
  stubDatabases()
  context '#transferItem', ->
    beforeEach ->
      Team.save([
        {_id: '1', name: 'foo1', local: false}
        {_id: '2', name: 'foo2', local: false}
      ])
      .then ->
        Item.save [
          {title: 'a', body: 'a', tags: [], teamId: '1', _id: 'i1'}
        ]

    it "should transfer item to other team", ->
      Item.find('i1')
      .then (item) ->
        kobito.commands.transferItem(item._id, '2')
      .then -> Item.find('i1')
      .then (item) ->
        assert item.teamId, '2'

  context '#transferItems', ->
    context 'send to local', ->
      beforeEach ->
        Team.save([
          {_id: '1', name: 'foo1', local: false}
          {_id: '2', name: 'foo2', local: true}
        ])
        .then ->
          Item.save {
            _id: 'i1'
            title: 'a'
            body: 'a'
            tags: []
            teamId: '1'
            syncedItemId: 'a'
            local_updated_at: 3
            remote_updated_at: 2
            synced_at: 2
          }

      it "should sanitize remote annotations", ->
        kobito.commands.transferItems('1', '2')
        .then -> Item.find('i1')
        .then (item) ->
          assert item.local_updated_at isnt null
          assert item.syncedItemId is null
          assert item.remote_updated_at is null
          assert item.synced_at is null

    context 'send items to team', ->
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
            {title: 'a', body: 'a', tags: [], teamId: '2', _id: 'i4'}
          ]

      it "should be written", ->
        Item.select((i) => i.teamId is '2')
        .then (items) ->
          assert items.length is 1
          kobito.commands.transferItems('1', '2')
        .then -> Item.select((i) => i.teamId is '2')
        .then (items) ->
          assert items.length is 4
          Team.all()
        .then (teams) =>
          assert teams.length is 1
