const path = require('path');

module.exports = function (api) {
  const platform = api.caller((caller) => caller && caller.platform);
  api.cache.using(() => platform);

  const plugins = [];
  // Force a single React/react-native instance on native platforms -
  // prevents duplicate React errors when resolving ../../src pulls in the
  // monorepo root's own node_modules instead of example's. Must be skipped
  // on web: it would otherwise hardcode the real "react-native" package,
  // overriding Metro's react-native -> react-native-web substitution.
  if (platform !== 'web') {
    plugins.push([
      'module-resolver',
      {
        alias: {
          react: path.resolve(__dirname, 'node_modules/react'),
          'react-native': path.resolve(__dirname, 'node_modules/react-native'),
        },
      },
    ]);
  }

  return {
    presets: ['babel-preset-expo'],
    plugins,
  };
};
