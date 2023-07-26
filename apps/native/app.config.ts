import path from 'path';
import type { ConfigContext, ExpoConfig } from '@expo/config';

import { ClientEnv, Env } from './env';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  scheme: Env.BUNDLE_ID,
  name: Env.NAME,
  description: `${Env.NAME} Mobile App`,
  slug: 'expo-supabase-social-auth-example',
  version: Env.VERSION.toString(),
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
    bundleIdentifier: Env.BUNDLE_ID,
    buildNumber: Env.BUILD_VERSION.toString(),
    config: {
      usesNonExemptEncryption: false,
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: path.resolve(__dirname, 'src/assets/adaptive-icon.png'),
      backgroundColor: '#FFFFFF',
    },
    package: Env.PACKAGE,
    versionCode: Env.BUILD_VERSION,
  },
  plugins: [
    'expo-router',
    [
      'app-icon-badge',
      {
        enabled: Env.APP_ENV === 'production' ? false : true,
        badges: [
          {
            text: Env.APP_ENV,
            type: 'banner',
            color: 'white',
          },
          {
            text: Env.VERSION.toString(),
            type: 'ribbon',
            color: 'white',
          },
        ],
      },
    ],
    [
      'expo-build-properties',
      {
        ios: {
          flipper: true,
        },
      },
    ],
  ],
  experiments: {
    tsconfigPaths: true,
    typedRoutes: true,
  },
  extra: {
    ...ClientEnv,
    router: {
      origin: false,
    },
    // eas: {
    //   projectId: Env.EAS_PROJECT_ID,
    // },
  },
});
