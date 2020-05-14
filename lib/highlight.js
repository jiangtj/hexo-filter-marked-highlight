'use strict';

module.exports = (hexo, options) => {

  const stripIndent = require('strip-indent');
  const injector = require('hexo-extend-injector2')(hexo);
  const { join } = require('path');

  // options
  options = Object.assign({
    style: 'default',
    style_dark: 'dark'
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
      return `{% raw %}<pre>\n<code class="${language}">${code}</code>\n</pre>{% endraw %}`;
    };
  });

  // style
  hexo.extend.filter.register('stylus:renderer', style => {
    style.define('highlight_style_light', join(hexo.base_dir, `node_modules/highlight.js/styles/${options.style}.css`));
    if (options.style_dark) {
      style.define('highlight_style_dark', join(hexo.base_dir, `node_modules/highlight.js/styles/${options.style_dark}.css`));
    }
  });
  injector.register('style', join(__dirname, 'style.styl'));

};
