'use strict';

module.exports = (hexo, options) => {

  const stripIndent = require('strip-indent');
  const { join } = require('path');

  // options
  options = Object.assign({
    style: 'default',
    auto_detect: false
  }, options);

  // init hljs
  let hljs;
  if (options.register) {
    hljs = require('highlight.js/lib/highlight.js');
    options.register.forEach(element => {
      hljs.registerLanguage(element, require('highlight.js/lib/languages/' + element));
    });
  } else {
    hljs = require('highlight.js');
  }

  const codeGen = (code, language) => {
    if (options.wrap_raw) {
      return `{% raw %}<pre>\n<code class="${language}">${code}</code>\n</pre>{% endraw %}`;
    }
    return `<pre><code class="${language}">${code}</code></pre>`;
  };

  // code
  hexo.extend.filter.register('marked:renderer', renderer => {
    renderer.code = (code, language, escaped) => {
      code = stripIndent(code);
      const isExist = hljs.getLanguage(language);
      if (isExist) {
        code = hljs.highlight(language, code).value;
      } else if (options.auto_detect) {
        code = hljs.highlightAuto(code).value;
      }
      return codeGen(code, language);
    };
  });

  const resolveThemePath = name => {
    if (!name) {
      return undefined;
    }
    return join(hexo.base_dir, `node_modules/highlight.js/styles/${name}.css`);
  };

  // style
  require('./load-stylus')(hexo)({
    light: resolveThemePath(options.style),
    dark: resolveThemePath(options.style_dark)
  });

};
