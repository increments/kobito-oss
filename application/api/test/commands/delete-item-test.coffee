# require '../../src/commands/delete-item'
describe "src/commands/create-new-item", ->
  stubDatabases()

  beforeEach ->
    Team.save({
      _id: 't1'
      name: 'foo'
      local: true
    }).then ->
      kobito.commands.createNewItem('title', 'body', [name: 'tag1'], 't1')

  it "should delete item", ->
    Item.all()
    .then ([item]) -> kobito.commands.deleteItem(item._id)
    .then -> Item.all()
    .then (items) ->
      assert items.length is 0
