import {toast} from '@backpackapp-io/react-native-toast'
import {logEvent} from '@react-native-firebase/analytics'
import {
  IconWallet,
  IconFolders,
  IconCategory2,
  IconCloudLock,
  IconFileDownload,
  IconNotes,
} from '@tabler/icons-react-native'
import {useMutation} from '@tanstack/react-query'
import {useLocalSearchParams, useRouter} from 'expo-router'
import {useEffect, useRef, useState} from 'react'
import {
  ActivityIndicator,
  Alert,
  Animated,
  Linking,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native'
import Purchases, {type PurchasesPackage} from 'react-native-purchases'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import {usePurchasesPackages, useUserEntitlements, updatePaywallDate} from '@entities/subscription'
import {firebaseAnalytics} from '@shared/config/firebase'
import {useTranslation} from '@shared/i18n'
import {Button} from '@shared/ui/button'
import {Text} from '@shared/ui/text'
import {ScreenContent} from '@shared/ui-primitives/ScreenContent'
import {PackageCard} from './PackageCard'
import type {Icon} from '@tabler/icons-react-native'

export default function PaywallScreen() {
  const {t} = useTranslation('PaywallScreen')
  const insets = useSafeAreaInsets()
  const {highlight} = useLocalSearchParams<{highlight?: string}>()
  const [duration, setDuration] = useState<TDuration>('annual')
  const {data} = usePurchasesPackages()
  const {refetch} = useUserEntitlements()
  const router = useRouter()

  const scrollRef = useRef<ScrollView>(null)
  const highlightAnim = useRef(new Animated.Value(0)).current

  const {mutateAsync: mutatePurchase, isPending} = useMutation({
    mutationFn: async (purchasePackage: PurchasesPackage) =>
      Purchases.purchasePackage(purchasePackage),
    onSuccess() {
      refetch()
      router.back()
      toast.success(t('paySuccess'))
    },
    onError(e) {
      refetch()
      router.back()
      toast.error(t('payError', {message: e.message}))
    },
  })

  const {mutateAsync: mutateRestore, isPending: isRestoring} = useMutation({
    mutationFn: Purchases.restorePurchases,
    onSuccess(result) {
      refetch()
      if (Object.keys(result.entitlements.active).length) {
        toast.success(t('purchasesRestored'))
        router.back()
        Purchases.syncPurchases()
      } else {
        Alert.alert(t('noActiveSubscriptions'))
      }
    },
    onError(error) {
      refetch()
      toast.error(error.message)
    },
  })

  const selectedPackage = data?.find((i) => i.identifier === `$rc_${duration}`)

  const features: Feature[] = [
    {
      id: 'accounts',
      Icon: IconWallet,
      tint: '#38BDF8',
      title: t('features.accounts.title'),
      desc: t('features.accounts.desc'),
    },
    {
      id: 'categories',
      Icon: IconFolders,
      tint: '#A78BFA',
      title: t('features.categories.title'),
      desc: t('features.categories.desc'),
    },
    {
      id: 'budgets',
      Icon: IconCategory2,
      tint: '#22C55E',
      title: t('features.budgets.title'),
      desc: t('features.budgets.desc'),
    },
    {
      id: 'notes',
      Icon: IconNotes,
      tint: '#c1951d',
      title: t('features.notes.title'),
      desc: t('features.notes.desc'),
    },
    {
      id: 'sync',
      Icon: IconCloudLock,
      tint: '#34D399',
      title: t('features.sync.title'),
      desc: t('features.sync.desc'),
    },
    {
      id: 'export',
      Icon: IconFileDownload,
      tint: '#F87171',
      title: t('features.export.title'),
      desc: t('features.export.desc'),
    },
  ]

  const handlePurchases = async () => {
    if (!selectedPackage) return
    await mutatePurchase(selectedPackage)
    void logEvent(firebaseAnalytics, 'subscription_purchased', {
      subscription_plan: 'pro',
      subscription_duration: duration,
    })
  }

  const FOOTER_PAD = 16
  const FOOTER_HEIGHT = 320 + FOOTER_PAD + insets.bottom

  useEffect(() => {
    return () => {
      updatePaywallDate()
    }
  }, [])

  useEffect(() => {
    if (!highlight || !scrollRef.current) return
    const index = features.findIndex(
      (f) =>
        f.id.toLowerCase() === highlight.toLowerCase() ||
        f.title.toLowerCase().includes(highlight.toLowerCase())
    )
    if (index === -1) return
    setTimeout(() => {
      scrollRef.current?.scrollTo({y: index * 90, animated: true})
      Animated.sequence([
        Animated.timing(highlightAnim, {toValue: 1, duration: 300, useNativeDriver: false}),
      ]).start()
    }, 300)
  }, [highlight, features])

  return (
    <ScreenContent
      excludeEdges={['bottom']}
      navigationOptions={{
        headerRight: () => (
          <TouchableOpacity activeOpacity={0.8} onPress={() => mutateRestore()}>
            <Text className="mx-auto text-center text-sm">{t('restorePurchases')}</Text>
          </TouchableOpacity>
        ),
      }}
    >
      <ScrollView
        ref={scrollRef}
        className="bg-background"
        contentContainerClassName="px-2 gap-4"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{
          paddingBottom: FOOTER_HEIGHT,
        }}
      >
        <View className="flex-row gap-2 justify-center items-center">
          <Text className="font-semiBold text-4xl text-center">Moneyra</Text>
          <View className="border-[2px] rounded-xl border-stone-500 px-2 py-1 mb-1">
            <Text className="text-2xl font-semibold">PRO</Text>
          </View>
        </View>
        <Text className="font-semiBold text-xl text-center">{t(`title`)} </Text>
        <View className="gap-1">
          {features.map((f) => {
            const bg = highlightAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['transparent', 'rgba(255,255,255,0.08)'],
            })
            const isHighlighted =
              highlight &&
              (f.id.toLowerCase() === highlight.toLowerCase() ||
                f.title.toLowerCase().includes(highlight.toLowerCase()))

            return (
              <Animated.View
                key={f.id}
                style={[isHighlighted && {backgroundColor: bg, borderRadius: 12}]}
                className="flex-row p-2 gap-3"
              >
                <View
                  className="h-9 w-9 rounded-xl items-center justify-center"
                  style={{backgroundColor: f.tint + '22'}}
                >
                  <f.Icon size={22} color={f.tint} />
                </View>
                <View className="flex-1 gap-0.5">
                  <Text className="font-semibold">{f.title}</Text>
                  <Text className="text-muted-foreground">{f.desc}</Text>
                </View>
              </Animated.View>
            )
          })}
        </View>
      </ScrollView>
      <View
        className="bg-background/95 border-t border-border px-4"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          paddingTop: 12,
          paddingBottom: FOOTER_PAD + insets.bottom,
        }}
      >
        <Text className="mb-2 font-semiBold">Choose your duration:</Text>
        <View className="flex-col items-end gap-4">
          {data
            ?.sort((a, b) => a.product.price - b.product.price)
            .map((pkg) => (
              <PackageCard
                key={pkg.identifier}
                data={pkg}
                selected={pkg.identifier === selectedPackage?.identifier}
                onSelect={() => {
                  setDuration(
                    pkg.identifier.includes('annual')
                      ? 'annual'
                      : pkg.identifier.includes('monthly')
                        ? 'monthly'
                        : 'lifetime'
                  )
                }}
              />
            ))}
        </View>

        <Button
          className="mt-3 mb-2"
          size="lg"
          disabled={!selectedPackage}
          onPress={handlePurchases}
        >
          <Text style={{fontSize: 18}}>{t('btn.unlock')}</Text>
        </Button>

        <Text className="text-center text-muted-foreground text-xs">
          By continuing, you acknowledge that you understand and agree to our{' '}
          <Text
            className="text-primary text-xs"
            onPress={() => Linking.openURL('https://www.moneyra.app/privacy-policy')}
          >
            <Text className="text-primary text-xs">Privacy Policy</Text>
          </Text>{' '}
          and{' '}
          <Text
            className="text-primary text-xs"
            onPress={() => Linking.openURL('https://www.moneyra.app/terms-of-service')}
          >
            Terms of Use
          </Text>
        </Text>
      </View>
      {(isPending || isRestoring) && (
        <View className="absolute top-0 right-0 bottom-0 left-0 z-50 items-center justify-center bg-background/50">
          <ActivityIndicator size="large" />
        </View>
      )}
    </ScreenContent>
  )
}

// TYPES

type TDuration = 'monthly' | 'annual' | 'lifetime'

type Feature = {
  id: 'accounts' | 'categories' | 'budgets' | 'analytics' | 'sync' | 'export' | 'notes'
  title: string
  desc: string
  Icon: Icon
  tint: string
}
