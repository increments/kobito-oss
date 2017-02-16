describe "src/commands/initialize/init-storages", ->
  before ->
    kaita.commands.initialize.initStorages('1')

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
    assert Item instanceof kaita.storages.Item
    assert Team instanceof kaita.storages.Team
    assert Template instanceof kaita.storages.Template
    assert Log instanceof kaita.storages.Log
