const { override } = require('customize-cra');

module.exports = override((config) => {
  // Webpack 5+ 不再支持直接设置node模块，需要通过resolve.fallback处理
  config.resolve.fallback = {
    ...config.resolve.fallback,
    "fs": false,
    "path": false,
    "os": false
  };
  
  return config;
});
