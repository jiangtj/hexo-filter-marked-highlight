'use strict';

module.exports = (hexo, options) => {

  const stripIndent = require('strip-indent');
  const injector = require('hexo-extend-injector2')(hexo);
  const { join } = require('path');

  // options
  options = Object.assign({
    style: 'github'
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

  // code
  hexo.extend.filter.register('marked:renderer', renderer => {
    renderer.code = (code, language, escaped) => {
      code = stripIndent(code);
      const isExist = hljs.getLanguage(language);
      if (isExist) {
        code = hljs.highlight(language, code).value;
      } else {
        code = hljs.highlightAuto(code).value;
      }
      return `{% raw %}<pre><code class="${language}">${code}</code></pre>{% endraw %}`;
    };
  });

  // style
  injector.register('style', join(hexo.base_dir, `node_modules/highlight.js/styles/${options.style}.css`));

};
