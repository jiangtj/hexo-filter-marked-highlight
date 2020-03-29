'use strict';

module.exports = (hexo, options) => {

  const stripIndent = require('strip-indent');
  const injector = require('hexo-extend-injector2')(hexo);
  const { join } = require('path');
  const { escapeHTML } = require('hexo-util');

  options = options || {};
  if (options.load !== 'cdn') {
    options = Object.assign({
      load: 'bundler',
      theme: 'default',
      languages: ['markup', 'css', 'clike', 'javascript'],
      plugins: [
        {name: 'line-numbers', css: true, class: {pre: ['line-numbers']}}
      ]
    }, options);
  }

  const resolveComponentPath = name => {
    return join(hexo.base_dir, `node_modules/prismjs/components/prism-${name}.js`);
  };

  const resolveThemePath = name => {
    if (name === 'default') {
      return join(hexo.base_dir, 'node_modules/prismjs/themes/prism.css');
    }
    return join(hexo.base_dir, `node_modules/prismjs/themes/prism-${name}.css`);
  };

  const resolvePluginJsPath = name => {
    return join(hexo.base_dir, `node_modules/prismjs/plugins/${name}/prism-${name}.js`);
  };

  const resolvePluginCssPath = name => {
    return join(hexo.base_dir, `node_modules/prismjs/plugins/${name}/prism-${name}.css`);
  };

  const resolveRenderer = () => {
    let preClass = '';
    let codeClass = '';
    options.plugins.forEach(element => {
      if (element.class) {
        if (element.class.pre) {
          preClass = ` class='${element.class.pre.join(' ')}'`;
        }
        if (element.class.code) {
          codeClass = ' ' + element.class.pre.join(' ');
        }
      }
    });
    hexo.extend.filter.register('marked:renderer', renderer => {
      renderer.code = (code, language, escaped) => {
        code = escapeHTML(stripIndent(code));
        return `{% raw %}<pre${preClass}><code class="language-${language}${codeClass}">${code}</code></pre>{% endraw %}`;
      };
    });
  };

  if (options.load === 'bundler') {
    injector.register('style', resolveThemePath(options.theme));
    injector.register('js', resolveComponentPath('core'));
    options.languages.forEach(element => {
      injector.register('js', resolveComponentPath(element));
    });
    options.plugins.forEach(element => {
      injector.register('js', resolvePluginJsPath(element.name));
      if (element.css) {
        injector.register('style', resolvePluginCssPath(element.name));
      }
    });
    resolveRenderer();
  }

  if (options.load === 'node') {
    injector.register('style', resolveThemePath(options.theme));
    const Prism = require('prismjs');
    const loadLanguages = require('prismjs/components/');
    loadLanguages.silent = true;
    loadLanguages(options.languages);
    hexo.extend.filter.register('marked:renderer', renderer => {
      renderer.code = (code, language, escaped) => {
        code = stripIndent(code);
        if (Prism.languages[language]) {
          code = Prism.highlight(code, Prism.languages[language], language);
        }
        return `{% raw %}<pre><code class="${language}">${code}</code></pre>{% endraw %}`;
      };
    });
  }

  if (options.load === 'cdn') {
    options = Object.assign({
      theme: 'default',
      url: 'https://cdn.jsdelivr.net/npm/prismjs@1/',
      languages: [],
      plugins: [
        {name: 'autoloader'},
        {name: 'line-numbers', css: true, class: {pre: ['line-numbers']}}
      ]
    }, options);
    injector.register('head-end', `<link href="${options.url}${options.theme === 'default' ? 'themes/prism.css' : 'themes/prism-' + options.theme + '.css'}" rel="stylesheet" />`);
    injector.register('body-end', `<script src="${options.url}components/prism-core.min.js"></script>`);
    options.languages.forEach(element => {
      injector.register('body-end', `<script src="${options.url}components/prism-${element}.min.js"></script>`);
    });
    options.plugins.forEach(element => {
      injector.register('body-end', `<script src="${options.url}plugins/${element.name}/prism-${element.name}.min.js"></script>`);
      if (element.css) {
        injector.register('head-end', `<link href="${options.url}plugins/${element.name}/prism-${element.name}.css" rel="stylesheet" />`);
      }
    });
    resolveRenderer();
  }
};
