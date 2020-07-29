# hexo-filter-marked-highlight

**Not in maintenance, Hexo processes the code internally, which is difficult to process externally. .**

A highlight extend for marked renderer.

![npm](https://img.shields.io/npm/v/hexo-filter-marked-highlight.svg)

## how to use

```bash
yarn add hexo-filter-marked-highlight
```

you have to install hexo-renderer-marked and disable hexo's default highlight.

```yml
highlight:
  enable: false
marked_highlight:
  engine: highlight # prism
  wrap_raw: false # <pre><code> to {% raw %}<pre>\n<code></code>\n</pre>{% endraw %}
  options:
    ### highlight.js ###
    ## see ./node_modules/highlight.js/lib/languages/*, default including all languages.
    #register: ['html','js','css','java','sql']
    ## see ./node_modules/highlight.js/styles/*, default github.
    #style: default
    #style_dark: dark # if setted, will apply it when prefers-color-scheme is dark
    #auto_detect: false # auto detect language
    #
    ### prismjs ###
    #load: bundler # node or cdn (node don't support plugin)
    ## see ./node_modules/prismjs/themes/*, dark coy etc.
    #theme: default
    #theme_dark: dark # if setted, will apply it when prefers-color-scheme is dark (not support in cdn load)
    ## see ./node_modules/prismjs/components/*. you also can not to set it, if use autoloader plugin and cdn load.
    #languages: ['markup', 'css', 'clike', 'javascript']
    ## see ./node_modules/prismjs/plugins/*.
    #plugins
    #  - name: autoloader # only cdn load support.
    #  - name: line-numbers
    #    css: true # if plugin has css style, please set css to true for load it.
    #    class: {pre: ['line-numbers']} # add class for <per> or <code>
    #url: https://cdn.jsdelivr.net/npm/prismjs@1/ # only for cdn
```

## Others

If you don't use NexT or Cake theme, please set `injector2.stylus.enable` to `true`.

```yml
injector2:
  stylus:
    enable: true
```
