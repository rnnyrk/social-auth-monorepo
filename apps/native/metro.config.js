// const { getDefaultConfig } = require("expo/metro-config");
// const path = require("path");

// // Find the workspace root, this can be replaced with `find-yarn-workspace-root`
// const workspaceRoot = path.resolve(__dirname, "../..");
// const projectRoot = __dirname;

// const config = getDefaultConfig(projectRoot);

// // 1. Watch all files within the monorepo
// config.watchFolders = [workspaceRoot];
// // 2. Let Metro know where to resolve packages, and in what order
// config.resolver.nodeModulesPaths = [
//   path.resolve(projectRoot, "node_modules"),
//   path.resolve(workspaceRoot, "node_modules"),
// ];
// // 3. Force Metro to resolve (sub)dependencies only from the `nodeModulesPaths`
// config.resolver.disableHierarchicalLookup = true;

// module.exports = config;

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