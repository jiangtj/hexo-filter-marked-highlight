/* global hexo */
'use strict';

const config = Object.assign({
  engine: 'highlight',
  wrap_raw: false
}, hexo.config.marked_highlight);
config.options = config.options || {};
config.options.wrap_raw = config.wrap_raw;
require(`./lib/${config.engine}`)(hexo, config.options);
