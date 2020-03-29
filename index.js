/* global hexo */
'use strict';

const config = Object.assign({
  engine: 'highlight',
  options: {}
}, hexo.config.marked_highlight);
require(`./lib/${config.engine}`)(hexo, config.options);
