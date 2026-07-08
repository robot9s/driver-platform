import {Platform} from 'react-native'

export const revenueCatApiKey =
  Platform.OS === 'ios'
    ? process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_IOS
    : process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID
