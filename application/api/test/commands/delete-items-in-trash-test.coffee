# require '../../src/commands/delete-item'
describe "src/commands/create-new-item", ->
  stubDatabases()

  beforeEach ->
    Team.save({
      _id: '#trash'
      name: 'Trash'
      local: true
    }).then ->
      kobito.commands.createNewItem('title', 'body', [name: 'tag1'], 'foo')
    .then ->
      kobito.commands.createNewItem('title', 'body', [name: 'tag1'], '#trash')
    .then ->
      kobito.commands.createNewItem('title', 'body', [name: 'tag1'], '#trash')

  it "should delete item", ->
    kobito.commands.deleteItemsInTrash()
    Item.select((item) -> item._id is '#trash')
    .then (items) ->
      assert items.length is 0
