# require '../../src/commands/delete-item'
describe "src/commands/create-new-item", ->
  stubDatabases()

  beforeEach ->
    Team.save({
      _id: '#trash'
      name: 'Trash'
      local: true
    }).then ->
      kaita.commands.createNewItem('title', 'body', [name: 'tag1'], 'foo')
    .then ->
      kaita.commands.createNewItem('title', 'body', [name: 'tag1'], '#trash')
    .then ->
      kaita.commands.createNewItem('title', 'body', [name: 'tag1'], '#trash')

  it "should delete item", ->
    kaita.commands.deleteItemsInTrash()
    Item.select((item) -> item._id is '#trash')
    .then (items) ->
      assert items.length is 0
