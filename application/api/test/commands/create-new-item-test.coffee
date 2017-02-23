# require '../../src/commands/create-new-item'
describe "src/commands/create-new-item", ->
  stubDatabases()

  beforeEach ->
    Team.save {
      _id: 't1'
      name: 'foo'
      local: true
    }

  it "should create new item", ->
    kobito.commands.createNewItem('title', 'body', [name: 'tag1'], 't1')
    .then (item) ->
      assert item.title is 'title'
      assert item.body is 'body'
      assert.deepEqual item.tags, [name: 'tag1']
      assert item.teamId is 't1'
