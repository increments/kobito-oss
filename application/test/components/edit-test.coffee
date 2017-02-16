require '../spec-helper'

describe "components/edit", ->
  Edit = require '../../lib/components/edit'
  OnelineEditor = require '../../lib/components/oneline-editor'

  createMyEditorSpy = null

  beforeEach ->
    MarkdownEditor = require '../../lib/components/markdown-editor'
    global.createMyEditor = ->
    global.createOnelineEditor = ->

    @sinon.stub Edit::, 'componentDidMount'
    @sinon.stub OnelineEditor::, 'componentDidMount'
    @sinon.stub MarkdownEditor::, 'componentDidMount'
    @sinon.stub(kaita.queries, 'collectTagNames').returns Promise.resolve([])

  afterEach ->
    delete global.createMyEditor

  it "should be rendered", ->

    # Use stab later
    # global.localStorage =
    #   setItem: ->
    #   getItem: ->

    item =
      _id: '__'
      body: ''
      title: 'B'
      tags: []
      teamId: ''
      compiled_body: ''

    component = TestUtils.renderIntoDocument React.createFactory(Edit) {
      item: item
      showPreview: true
      canUpdate: false
      canUpload: false
      templates: []
      buffer:
        title: ''
        body: ''
        tags: []
    }

    assert component.getDOMNode().innerHTML isnt ''
