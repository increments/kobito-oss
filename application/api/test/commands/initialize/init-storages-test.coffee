describe "src/commands/initialize/init-storages", ->
  before ->
    kobito.commands.initialize.initStorages('1')

  afterEach ->
    Item.clear()
    Team.clear()
    Template.clear()
    Log.clear()
    delete global.Item
    delete global.Team
    delete global.Template
    delete global.Log

  it "should export storages to global", ->
    assert Item instanceof kobito.storages.Item
    assert Team instanceof kobito.storages.Team
    assert Template instanceof kobito.storages.Template
    assert Log instanceof kobito.storages.Log
