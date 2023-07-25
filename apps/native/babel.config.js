module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo', '@rnx-kit/babel-preset-metro-react-native'],
    plugins: ['expo-router/babel', 'react-native-reanimated/plugin'],
  };
};
