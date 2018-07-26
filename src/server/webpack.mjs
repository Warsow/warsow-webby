import webpack from 'webpack';
import wdm from 'webpack-dev-middleware';
import wdmHot from 'webpack-hot-middleware';
import config from '../../webpack.config.js';

export function setupWebpack(router) {
  // Add HMR connector to the client entry
  config.entry.client.unshift('webpack-hot-middleware/client');
  // Add HMR webpack plugin
  config.plugins.push(new webpack.HotModuleReplacementPlugin());
  // Instantiate the compiler
  const compiler = webpack(config);
  // Add WDM middleware
  router.use(wdm(compiler, config.devServer));
  // Add HMR middleware
  router.use(wdmHot(compiler));
}
