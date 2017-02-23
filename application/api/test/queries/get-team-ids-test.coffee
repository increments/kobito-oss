# require '../../src/queries/get-team-ids'
describe "src/queries/get-team-ids", ->
  stubDatabases()
  beforeEach ->
    Team.save [
      {_id: 'qiita', name: "qiita", local: false}
      {_id: 'foo1',  name: "foo1",  local: false}
      {_id: 'foo2',  name: "foo2",  local: true}
      {_id: 'foo3',  name: "foo3",  local: false}
    ]

  it "should collect registered qiita team", ->
    kobito.queries.getTeamIds()
    .then (ids) =>
      assert.deepEqual ids, ['foo1', 'foo3']
