const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
const projectRoot = __dirname;

config.watchFolders = [path.resolve(__dirname, '..')];
config.resolver.unstable_enableSymlinks = true;
config.resolver.unstable_enablePackageExports = true;
// Force single React instance - prevents duplicate React errors with symlinked library
config.resolver.extraNodeModules = {
  react: path.resolve(projectRoot, 'node_modules/react'),
  'react-native': path.resolve(projectRoot, 'node_modules/react-native'),
  'react/jsx-runtime': path.resolve(projectRoot, 'node_modules/react/jsx-runtime'),
};

module.exports = config;
