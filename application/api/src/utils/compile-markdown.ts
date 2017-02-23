declare var React: any;
var dompurify = require('dompurify')

module kobito.utils {
  var md2react = require('md2react');
  var emosa = require('emosa');
  var emcode = require('emcode');
  var hljs = require('highlight.js');
  var $ = React.createElement;

  // for compile to string
  var dangerouslyWrapper = React.createClass({
    render: function() {
      return React.createElement('div', {
        dangerouslySetInnerHTML: {
          __html: dompurify.sanitize(this.props.html)
        }
      });
    }
  });

  // for preview
  var iframeWrapper = React.createClass({
    _update() {
      var current = dompurify.sanitize(this.props.html);
      if (this._lastHtml !== current) {
        this._lastHtml = current;
        if (this.refs.htmlWrapper != null) {
          var node = this.refs.htmlWrapper.getDOMNode();
          // avoid to touch null if iframe content does not ready
          if (node && node.contentDocument && node.contentDocument.body != null) {
            var inner = node.contentDocument.body.querySelector('#inner');
            inner.innerHTML = dompurify.sanitize(this.props.html);
            node.style.height = inner.scrollHeight + 'px';
          }
        }
      }
    },

    componentDidUpdate() {
      this._update();
    },

    componentDidMount() {
      var node = this.refs.htmlWrapper.getDOMNode();
      node.contentWindow.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => this._update(), 100);
      });
    },

    render() {
      return $('iframe', {
        ref: 'htmlWrapper',
        src: 'inner-preview.html',
        html: dompurify.sanitize(this.props.html),
        style: {
          border: 'none',
          overflow: 'hidden'
        }
      });
    }
  });

  // base options
  function _compile(md: string, wrapper) {
    md = md.replace(/\t/g, '    ');
    try {
      return md2react(md, {
        gfm: true,
        commonmark: true,
        breaks: true,
        tasklist: true,
        footnotes: true,
        highlight: buildHighlighter(wrapper),
        htmlWrapperComponent: wrapper,
        preprocessAST: convertEmoji
      });
    } catch(e) {
      return $('div', {}, 'preview failed');
    }
  }

  export function compileMarkdown(md: string) {
    return (<any>React).renderToStaticMarkup(_compile(md, dangerouslyWrapper));
  }

  export function compileMarkdownForPreview(md: string) {
    return _compile(md, iframeWrapper);
  }

  function buildHighlighter(wrapper) {
    return (code, lang) =>  {
      var filename = '';
      if (lang && lang.indexOf(':') > 1) {
        var sp = lang.split(':')
        lang = sp[0];
        filename = sp[1];
      }

      var header;
      if (filename) {
        header = "<div class='code-lang'><span class='bold'>" + filename + "</span></div>"
      } else {
        header = "";
      }

      var codeBlockHTML;
      if (lang) {
        try {
          codeBlockHTML = '<pre style="margin:0"><code>' + hljs.highlight(lang, code).value + '</code></pre>';
        }
        catch (e) {
          codeBlockHTML = '<pre style="margin:0"><code>' + _.escape(code) + '</code></pre>';
        }
      } else {
        codeBlockHTML = '<pre style="margin:0"><code>' + _.escape(code) + '</code></pre>';
      }

      return $(wrapper, {html:
        "<div class='code-frame' data-lang=" + (lang || 'text') + ">"
        + header
        + "<div class='highlight'>" + codeBlockHTML + "</div>"
        + "</div>"
      });
    }
  }

  var VERBATIM_TAG_NAMES = ['code', 'kbd', 'pre', 'tt']; // not comprehensive
  function convertEmoji(node) {
    var children = [];
    node.children.forEach(child => {
      if (child.type === 'text' && child.value) {
        var emojiTextNodes = emojiTextNodesFromString(child.value);
        if (emojiTextNodes) {
          children.push(...emojiTextNodes);
        } else {
          children.push(child);
        }
      } else if (child.type === 'html') {
        if (child.subtype === 'folded' && VERBATIM_TAG_NAMES.indexOf(node.tagName) === -1) {
          convertEmoji(child);
        }
        children.push(child);
      } else if (child.children) {
        convertEmoji(child);
        children.push(child);
      } else {
        children.push(child);
      }
    });
    node.children = children;
    return node;
  }

  // Converts a string containing emoji tags to an array of mdast nodes.
  // If the given string doesn't contain emoji tags, returns null.
  //
  // Example:
  //     Given:   'hello :smile:'
  //     Returns: [{type: 'text', value: 'hello '}, {type: 'image', ...}]
  function emojiTextNodesFromString(string) {
    var emojiTagRe = /:[0-9a-z_+-]+:/g;
    var emojiTags: any[] = string.match(emojiTagRe);
    if (!emojiTags) {
      return null;
    }
    var emojiNodes = emojiTags.map(tag => {
      var name = tag.slice(1, tag.length - 1);
      var code = emcode.getCharCode(name);
      if (!code) {
        return {type: 'text', value: tag};
      }
      var attrs = {className: 'twemoji twemoji-' + code.toString(16)};
      return {type: 'html', subtype: 'computed', tagName: 'i', attrs: attrs};
    });
    var textNodes = string.split(emojiTagRe).map(s => {
      return {type: 'text', value: s};
    });

    // At this point textNodes has N elements while emojiNodes has N-1.
    // Interleave them filling the gap with null, and then remove the filler
    // and empty text nodes.
    var result = [];
    for (var i = 0; i < textNodes.length; i++) {
      result.push(textNodes[i]);
      result.push(emojiNodes[i] || null);
    }
    result = result.filter(elem => {
      return !( elem === null || (elem.type === 'text' && elem.value === '') );
    });

    return result;
  }
}
