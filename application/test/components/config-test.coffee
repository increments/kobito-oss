require '../spec-helper'

describe "components/config", ->
  Config = require '../../lib/components/config'
  it "should be rendered", ->
    component = TestUtils.renderIntoDocument React.createFactory(Config)()
    assert component.getDOMNode().innerHTML isnt ''
