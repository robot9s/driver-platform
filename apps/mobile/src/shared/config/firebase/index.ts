import {getAnalytics} from '@react-native-firebase/analytics'
import {getApp} from '@react-native-firebase/app'

const app = getApp()
const analytics = getAnalytics(app)

if (!__DEV__) {
  analytics.setAnalyticsCollectionEnabled(true)
}

export {analytics as firebaseAnalytics}
