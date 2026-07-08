import {toast} from '@backpackapp-io/react-native-toast'
import {useEffect} from 'react'
import Purchases, {LOG_LEVEL} from 'react-native-purchases'
import {revenueCatApiKey} from './revenueCatApiKey'

export function useInitializePurchases() {
  useEffect(() => {
    Purchases.setLogLevel(LOG_LEVEL.ERROR)

    if (!revenueCatApiKey) {
      toast.error('Missing RevenueCat API key')
      return
    }

    Purchases.configure({
      apiKey: revenueCatApiKey,
    })
  }, [])
}
