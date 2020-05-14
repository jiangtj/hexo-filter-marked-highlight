'use strict';

const { join } = require('path');

module.exports = hexo => options => {
  const injector = require('hexo-extend-injector2')(hexo);
  const { filter } = hexo.extend;
  filter.register('stylus:renderer', style => {
    style.define('highlight_style_light', options.light);
    if (options.dark) {
      style.define('highlight_style_dark', options.dark);
    }
  });
  injector.register('style', join(__dirname, 'style.styl'));
};
