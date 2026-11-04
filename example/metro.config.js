const path = require('path');
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
const projectRoot = __dirname;

config.watchFolders = [path.resolve(__dirname, '..')];
config.resolver.unstable_enableSymlinks = true;
config.resolver.unstable_enablePackageExports = true;

// The example app watches the monorepo root (..) so importing components
// straight from ../../src works. But that means resolving "react" /
// "react-native" from a file under src/ would otherwise walk up from src/'s
// own ancestry and find the repo root's separate node_modules copies
// instead of example's - causing duplicate-instance bugs on native, or
// resolution failures on web (react-native-web only lives in
// example/node_modules). Pin these explicitly to example/node_modules,
// substituting react-native -> react-native-web (including its deep
// imports, which babel-preset-expo rewrites individual named imports into)
// on the web platform.
function resolveFromExample(request) {
  return require.resolve(request, { paths: [projectRoot] });
}

config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === 'web') {
    if (moduleName === 'react-native') {
      return { type: 'sourceFile', filePath: resolveFromExample('react-native-web') };
    }
    if (moduleName === 'react-native-web' || moduleName.startsWith('react-native-web/')) {
      return { type: 'sourceFile', filePath: resolveFromExample(moduleName) };
    }
    if (moduleName === 'react' || moduleName === 'react-dom' || moduleName === 'react/jsx-runtime') {
      return { type: 'sourceFile', filePath: resolveFromExample(moduleName) };
    }
    return context.resolveRequest(context, moduleName, platform);
  }
  if (moduleName === 'react' || moduleName === 'react-native' || moduleName === 'react/jsx-runtime') {
    return { type: 'sourceFile', filePath: resolveFromExample(moduleName) };
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
