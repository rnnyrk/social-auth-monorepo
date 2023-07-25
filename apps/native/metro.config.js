const { getDefaultConfig } = require('@expo/metro-config');

const defaultConfig = getDefaultConfig(__dirname);

const { makeMetroConfig } = require('@rnx-kit/metro-config');
const MetroSymlinksResolver = require('@rnx-kit/metro-resolver-symlinks');

const symlinkResolver = MetroSymlinksResolver();

const requestResolver = (context, moduleName, platform, realName) => {
  // patch for unpatched dependencies
  // e.g. react-native-version-check-expo
  if (moduleName === '@unimodules/core') {
    const expoModules = 'expo-modules-core';
    return symlinkResolver(context, expoModules, platform, expoModules);
  }

  return symlinkResolver(context, moduleName, platform, realName);
};

module.exports = {
  ...defaultConfig,
  ...makeMetroConfig({
    projectRoot: __dirname,
    resolver: {
      resolveRequest: requestResolver,
    },
  }),
};