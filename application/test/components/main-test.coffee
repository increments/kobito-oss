require '../spec-helper'
describe "components/main", ->
  Main = require '../../lib/components/main'
  it "should be rendered", ->
    team =
      _id: 'foo'
      id: 'foo'
      name: 'foo'

    component = TestUtils.renderIntoDocument React.createFactory(Main) {
      selectedItem: null
      selectedTeam: team
      teams: [team]
      items: []
      templates: []
      logined: false
    }

    assert component.innerHTML isnt ''
