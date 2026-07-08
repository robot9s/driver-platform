import {createORPCClient} from '@orpc/client'
import {RPCLink} from '@orpc/client/fetch'
import type {ApiRouterClient} from '@repo/api/orpc/router'
import {authClient} from './auth-client'
import {API_URL} from './config'

const link = new RPCLink({
  url: `${API_URL}/api/rpc`,
  // Better Auth stores the session cookie in SecureStore on native;
  // forward it on every API call.
  headers: () => ({cookie: authClient.getCookie()}),
})

export const orpcClient: ApiRouterClient = createORPCClient(link)
