# require '../../src/utils/compile-markdown'
describe "src/utils/compile-markdown", ->
  it "should compile markdown string to html", ->
    str = kaita.utils.compileMarkdown('# Title')
    assert str is '<div><h1>Title</h1></div>'

  it "should compile string to react element", ->
    el = kaita.utils.compileMarkdownForPreview('# Title')
    # react element has type property
    assert el.type is 'div'
