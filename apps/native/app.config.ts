import path from 'path';
import type { ConfigContext, ExpoConfig } from '@expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'expo-native',
  slug: 'native',
  version: '1.0.0',
  orientation: 'portrait',
  icon: path.resolve(__dirname, 'src/assets/icon.png'),
  userInterfaceStyle: 'light',
  splash: {
    image: path.resolve(__dirname, 'src/assets/splash.png'),
    resizeMode: 'contain',
    backgroundColor: '#ffffff',
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: false,
    bundleIdentifier: 'com.expo.native',
    buildNumber: '1',
  },
  android: {
    adaptiveIcon: {
      foregroundImage: path.resolve(__dirname, 'src/assets/adaptive-icon.png'),
      backgroundColor: '#FFFFFF',
    },
  },
});
