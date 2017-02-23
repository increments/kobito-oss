require '../../spec-helper'
m = require('moment')

describe 'domains/commands', ->

  context '#syncItem', ->
    stubDatabases()
    basetime = 'Mon Feb 23 2015 15:09:48 GMT+0900 (JST)'
    future1  = 'Mon Feb 23 2015 15:10:00 GMT+0900 (JST)'
    future2  = 'Mon Feb 23 2015 15:11:00 GMT+0900 (JST)'

    beforeEach ->
      Team.save(name: 'foo', _id: 'foo', local: false)
      .then =>
        Item.save(
          title: "aaa"
          body: "bbb"
          tags: [{name: 'a'}]
          remote_updated_at: m(basetime).unix()
          synced_at: m(basetime).unix()
          syncedItemId: 'qiita1'
          teamId: 'foo'
        )

    it 'save as new item with other id', ->
      qItem =
        id: 'qiita2'
        body: "ccc"
        title: 'qiita1 updated'
        tags: []
        updated_at: basetime

      kobito.commands.sync.syncItem(qItem, 'foo')
      .then ({result}) ->
        assert result is kobito.commands.sync.SyncItemResultStatus.NEW

    it 'pass if remote_updated_at is not changed', ->
      qItem = FactoryDog.build 'qiita-item',
        id: 'qiita1'
        tags: []
        title: 'qiita1 updated'
        updated_at: basetime

      kobito.commands.sync.syncItem(qItem, 'foo')
      .then ({result, itemId}) ->
        assert result is kobito.commands.sync.SyncItemResultStatus.PASS

    it 'update with future updated_at', ->
      qItem =
        id: 'qiita1'
        body: "bbb"
        tags: []
        title: 'qiita1 updated'
        updated_at: future1

      kobito.commands.sync.syncItem(qItem, 'foo')
      .then ({result, itemId}) ->
        assert result is kobito.commands.sync.SyncItemResultStatus.UPDATE
        Item.find(itemId)
      .then (item) ->
        assert item.title is 'qiita1 updated'

    it 'pass if only local is changed', ->
      Item.first(-> true)
      .then (item) ->
        item.title = 'local'
        kobito.commands.updateItem(item)
      .then ->
        qItem = FactoryDog.build 'qiita-item',
          id: 'qiita1'
          updated_at: basetime
          title: 'remote'
        kobito.commands.sync.syncItem(qItem, 'foo')
      .then ({result, itemId}) ->
        assert result is kobito.commands.sync.SyncItemResultStatus.PASS
        Item.find itemId
      .then (item) ->
        assert item.title is 'local'

    it 'detect conflict when both local and remote updated', ->
      Item.first(-> true)
      .then (item) ->
        item.title = 'touched'
        kobito.commands.updateItem(item)
      .then ->
        qItem = FactoryDog.build 'qiita-item',
          id: 'qiita1'
          tag: []
          title: 'qiita1 updated'
          updated_at: future1
        kobito.commands.sync.syncItem(qItem, 'foo')
      .then ({result, itemId}) ->
        assert result is kobito.commands.sync.SyncItemResultStatus.CONFLICT
        Item.find itemId
      .then (item) ->
        assert !!item.conflict_item

  context '#syncItems', ->
    context 'without token', ->
      it 'throw', (done) ->
        kobito.commands.sync.syncItems()
        .catch -> done()

    context 'with databases', ->
      context 'with token', ->
        stubDatabases()
        beforeEach ->
          localStorage.setItem 'api-token', '--token--'
          localStorage.setItem 'login-id', '--xxx--'

          @sinon.stub(kobito.qiita, 'fetchLoginUserItems')
            .returns [
              FactoryDog.build 'qiita-item', tags: []
              FactoryDog.build 'qiita-item', tags: []
              FactoryDog.build 'qiita-item', tags: []
            ]

        # it 'save results', ->
          # kobito.commands.sync.syncItems('#foo')
          # .then -> Item.select (i) -> i.teamId is '#foo'
          # .then (items) ->
            # assert items.length is 3

        # it 'override same id item', ->
          # kobito.commands.sync.syncItems('#foo')
          # .then -> kobito.commands.sync.syncItems('#foo')
          # .then -> Item.select (i) -> i.teamId is '#foo'
          # .then (items) ->
            # assert items.length is 3
