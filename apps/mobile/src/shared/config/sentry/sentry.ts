import * as Sentry from '@sentry/react-native'

export const initSentry = () => {
  const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN
  if (!dsn) {
    if (__DEV__) {
      console.log('[Sentry] DSN not set, skipping init')
    }
    return null
  }

  Sentry.init({
    dsn,
    sendDefaultPii: true,
  })

  return Sentry
}
