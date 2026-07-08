import {expoClient} from '@better-auth/expo/client'
import type {auth} from '@repo/auth'
import {inferAdditionalFields} from 'better-auth/client/plugins'
import {createAuthClient} from 'better-auth/react'
import * as SecureStore from 'expo-secure-store'
import {API_URL, APP_SCHEME} from './config'

export const authClient = createAuthClient({
  baseURL: API_URL,
  plugins: [
    inferAdditionalFields<typeof auth>(),
    expoClient({
      scheme: APP_SCHEME,
      storagePrefix: 'driver-platform',
      storage: SecureStore,
    }),
  ],
})
