import {useQuery} from '@tanstack/react-query'
import Purchases from 'react-native-purchases'
import type {CustomerInfo} from 'react-native-purchases'

export function usePurchasesPackages() {
  return useQuery({
    queryKey: ['offerings'],
    queryFn: Purchases.getOfferings,
    select: (state) => state.current?.availablePackages,
  })
}

export function useUserEntitlements(): TUseUserEntitlements {
  const {data: appUserId} = useQuery({
    queryKey: ['appUserId'],
    queryFn: async () => {
      const id = await Purchases.getAppUserID()
      return id || null
    },
  })

  const {data: customerInfo, refetch} = useQuery({
    queryKey: ['entitlements', appUserId],
    queryFn: Purchases.getCustomerInfo,
    refetchInterval: 1000 * 60,
    enabled: !!appUserId,
    networkMode: 'online',
    gcTime: 0,
    staleTime: 0,
  })

  const isPro = !!customerInfo?.entitlements.active.pro?.isActive

  const entitlement = isPro ? 'pro' : 'trial'

  return {
    customerInfo,
    entitlement,
    isPro,
    refetch,
  }
}

// TYPES

type TUseUserEntitlements = {
  customerInfo: CustomerInfo | undefined
  entitlement: 'pro' | 'trial'
  isPro: boolean
  refetch: () => void
}
