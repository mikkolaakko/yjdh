const webpack = require('webpack');
const path = require('path');
const withPlugins = require('next-compose-plugins');
const withCustomBabelConfig = require('next-plugin-custom-babel-config');
const withTranspileModules = require('next-transpile-modules');
const { i18n } = require('./next-i18next.config');

const { parsed: env } = require('dotenv').config({
  path: '../../../.env.tet',
});

const nextConf = {
  i18n,
  env,
  webpack: (conf) => {
    conf.resolve.fallback = {
      fs: false,
      path: require.resolve('path-browserify'),
    };
    const babelRule = conf.module.rules.find((r) =>
      Array.isArray(r.use)
        ? r.use.find((u) => u.loader?.match(/next.*babel.*loader/i))
        : r.use?.loader?.match(/next.*babel.*loader/i),
    );
    if (babelRule) {
      babelRule.include.push(path.resolve('../../'));
    }
    conf.plugins.push(new webpack.IgnorePlugin(/\/(__tests__|test)\//));
    conf.module.rules.push({
      test: /\.test.tsx$/,
      loader: 'ignore-loader',
    });
    return conf;
  },
};

const plugins = [
  [withTranspileModules, { transpileModules: ['@frontend'] }],
  [withCustomBabelConfig, { babelConfigFile: path.resolve('../../babel.config.js') }],
];

module.exports = withPlugins(plugins, nextConf);