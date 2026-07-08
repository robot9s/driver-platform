import 'dotenv/config'
import {ClientEnv, Env} from './env'

export default {
  expo: {
    name: Env.NAME,
    slug: Env.SLUG,
    scheme: Env.SCHEME,
    description: `${Env.NAME} Expense tracker`,
    owner: Env.EXPO_ACCOUNT_OWNER,
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    platforms: ['ios', 'android'],
    androidNavigationBar: {
      backgroundColor: '#000000',
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: Env.BUNDLE_ID,
      appleTeamId: Env.APPLE_TEAM_ID,
      config: {
        usesNonExemptEncryption: false,
      },
      googleServicesFile: './GoogleService-Info.plist',
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#121212',
      },
      package: Env.PACKAGE,
      permissions: [
        'android.permission.RECORD_AUDIO',
        'android.permission.USE_BIOMETRIC',
        'android.permission.USE_FINGERPRINT',
      ],
      googleServicesFile: './google-services.json',
    },
    plugins: [
      'expo-router',
      [
        'expo-font',
        {
          fonts: [
            './assets/fonts/Inter-Regular.ttf',
            './assets/fonts/Inter-Medium.ttf',
            './assets/fonts/Inter-SemiBold.ttf',
            './assets/fonts/Inter-Bold.ttf',
            './assets/fonts/Inter-Italic.ttf',
          ],
        },
      ],
      [
        'expo-splash-screen',
        {
          backgroundColor: '#121212',
          image: './assets/images/splash-icon.png',
          imageWidth: 200,
          dark: {
            image: './assets/images/splash-icon.png',
            backgroundColor: '#121212',
          },
        },
      ],
      [
        'expo-local-authentication',
        {
          faceIDPermission: 'Allow $(PRODUCT_NAME) to use Face ID to secure your account',
        },
      ],
      ['expo-localization'],
      [
        'expo-build-properties',
        {
          ios: {
            useFrameworks: 'static',
            forceStaticLinking: ['RNFBApp', 'RNFBAnalytics'],
          },
        },
      ],
      [
        '@sentry/react-native/expo',
        {
          organization: 'money-plus',
          project: 'moneyra-app',
          url: 'https://sentry.io/',
        },
      ],
      'expo-asset',
      '@react-native-firebase/app',
    ],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      ...ClientEnv,
      eas: {
        projectId: Env.EAS_PROJECT_ID,
      },
      outer: {
        origin: false,
      },
    },
  },
}
