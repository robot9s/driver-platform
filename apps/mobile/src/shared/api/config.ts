import Constants from 'expo-constants'

/**
 * Base URL of the driver-platform backend (apps/saas serves the API at /api).
 * Configure via EXPO_PUBLIC_API_URL in .env — defaults to local dev.
 * Android emulators reach the host machine via 10.0.2.2, not localhost.
 */
export const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000'

/**
 * Deep-link scheme, sourced from app.config.js (SCHEME in env.js). Must stay
 * in the backend's Better Auth trustedOrigins (packages/auth/auth.ts).
 */
const configScheme = Constants.expoConfig?.scheme
export const APP_SCHEME = (Array.isArray(configScheme) ? configScheme[0] : configScheme) ?? 'moneyra'
