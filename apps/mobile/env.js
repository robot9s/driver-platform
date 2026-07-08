/* eslint-env node */
// eslint-disable-next-line @typescript-eslint/no-require-imports
const {z} = require('zod')
// eslint-disable-next-line @typescript-eslint/no-require-imports
const pkg = require('./package.json')

// Detect current environment and load .env.{APP_ENV}
const APP_ENV = process.env.APP_ENV ?? 'development'

// Base identity values (adjust for your own app)
const BASE_BUNDLE_ID = 'com.moneyra.app' // iOS bundle id
const BASE_PACKAGE = 'com.moneyra.app' // Android package name
const APP_NAME = 'Moneyra'
const SCHEME = 'moneyra'
const SLUG = 'moneyra'
const EXPO_ACCOUNT_OWNER = ''
const EAS_PROJECT_ID = ''
const APPLE_TEAM_ID = ''

// Add environment suffix (e.g. .development or .preview) to bundle/package
const withEnvSuffix = (name) => (APP_ENV === 'production' ? name : `${name}.${APP_ENV}`)

// Schemas
const client = z.object({
  APP_ENV: z.enum(['development', 'preview', 'production']),
  NAME: z.string(),
  SCHEME: z.string(),
  SLUG: z.string(),
  BUNDLE_ID: z.string(),
  PACKAGE: z.string(),
  VERSION: z.string(),
  APPLE_TEAM_ID: z.string().optional(),

  // Client-side (EXPO_PUBLIC_*) variables passed to Expo extra
  EXPO_PUBLIC_REVENUECAT_API_KEY_IOS: z.string().optional(),
  EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID: z.string().optional(),
  EXPO_PUBLIC_SENTRY_DSN: z.string().optional(),
  EXPO_PUBLIC_API_URL: z.string().url().optional(),
})

const buildTime = z.object({
  EXPO_ACCOUNT_OWNER: z.string(),
  EAS_PROJECT_ID: z.string(),
})

// Values
const _clientEnv = {
  APP_ENV,
  NAME: APP_NAME,
  SCHEME,
  SLUG,
  BUNDLE_ID: withEnvSuffix(BASE_BUNDLE_ID),
  PACKAGE: withEnvSuffix(BASE_PACKAGE),
  VERSION: String(pkg.version),
  APPLE_TEAM_ID,

  EXPO_PUBLIC_REVENUECAT_API_KEY_IOS: process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_IOS,
  EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID: process.env.EXPO_PUBLIC_REVENUECAT_API_KEY_ANDROID,
  EXPO_PUBLIC_ONESIGNAL_APP_ID: process.env.EXPO_PUBLIC_ONESIGNAL_APP_ID,
  EXPO_PUBLIC_SENTRY_DSN: process.env.EXPO_PUBLIC_SENTRY_DSN,
  EXPO_PUBLIC_API_URL: process.env.EXPO_PUBLIC_API_URL,
}

const _buildTimeEnv = {
  EXPO_ACCOUNT_OWNER,
  EAS_PROJECT_ID,
}

// Validation
const mergedSchema = buildTime.merge(client)
const parsed = mergedSchema.safeParse({..._clientEnv, ..._buildTimeEnv})
if (!parsed.success) {
  console.error('❌ Invalid environment variables:')
  console.error(parsed.error.flatten().fieldErrors)
  console.error(`Check your .env file (or restart Expo with cache cleared).`)
  throw new Error('Invalid environment variables')
}

const Env = parsed.data // build-time + client variables
const ClientEnv = client.parse(_clientEnv) // client-only variables (sent to extra)

module.exports = {
  Env,
  ClientEnv,
  withEnvSuffix,
}
