import {Stack, useRouter} from 'expo-router'
import {useEffect} from 'react'
import {Platform} from 'react-native'
import Purchases from 'react-native-purchases'
import {revenueCatApiKey, shouldShowPaywall, useInitializePurchases} from '@entities/subscription'
import {initializeAutoBackup} from '@shared/backup'
import {useTranslation} from '@shared/i18n'
import {useColorPalette} from '@shared/lib/palette'
import {BackButton} from './ui/BackButton'

export default function AppLayout() {
  const {t} = useTranslation('AppLayout')
  const {getColor} = useColorPalette()
  const router = useRouter()
  const showPaywall = shouldShowPaywall()
  useInitializePurchases()

  useEffect(() => {
    if (!revenueCatApiKey) {
      initializeAutoBackup()
      return
    }

    Purchases.getCustomerInfo().then((data) => {
      const isPro = !!data?.entitlements.active.pro?.isActive
      if (!isPro && showPaywall) {
        setTimeout(() => {
          router.push('/paywall')
        }, 3000)
      }
    })

    initializeAutoBackup()
  }, [])

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTintColor: getColor('--foreground'),
        headerShadowVisible: false,
        headerTitleStyle: {
          fontFamily: 'Inter-Medium',
          fontSize: 16,
          color: getColor('--foreground'),
        },
        headerTitleAlign: 'center',
        headerStyle: {
          backgroundColor: getColor('--background'),
        },
        headerLeft: () => <BackButton />,
        ...(Platform.OS === 'android' && {
          animation: 'ios_from_right',
        }),
      }}
    >
      <Stack.Screen name="(tabs)" options={{headerShown: false}} />
      <Stack.Screen
        name="transaction/[id]"
        options={{
          presentation: 'modal',
          headerShown: false,
          ...(Platform.OS === 'android' && {
            headerShown: true,
            headerTitle: t('headerTitle.transaction'),
          }),
        }}
      />
      <Stack.Screen
        name="transaction/create"
        options={{
          presentation: 'modal',
          headerTitle: '',
          headerStyle: {
            backgroundColor: getColor('--background'),
          },
        }}
      />
      <Stack.Screen
        name="statistics/[id]"
        options={{
          headerTitle: t('headerTitle.statistics'),
        }}
      />
      <Stack.Screen
        name="appearance"
        options={{
          headerTitle: t('headerTitle.appearance'),
        }}
      />
      <Stack.Screen
        name="language"
        options={{
          headerTitle: t('headerTitle.languages'),
        }}
      />
      <Stack.Screen
        name="categories/index"
        options={{
          headerTitle: t('headerTitle.categories'),
        }}
      />
      <Stack.Screen
        name="categories/create"
        options={{
          headerTitle: t('headerTitle.addCategories'),
        }}
      />
      <Stack.Screen
        name="categories/expense/[id]"
        options={{
          headerTitle: t('headerTitle.categoryOverview'),
        }}
      />
      <Stack.Screen
        name="categories/income/[id]"
        options={{
          headerTitle: t('headerTitle.categoryOverview'),
        }}
      />
      <Stack.Screen
        name="accounts/index"
        options={{
          headerTitle: t('headerTitle.accounts'),
        }}
      />
      <Stack.Screen
        name="accounts/create"
        options={{
          headerTitle: t('headerTitle.addNewAccount'),
        }}
      />
      <Stack.Screen
        name="accounts/[id]"
        options={{
          headerTitle: t('headerTitle.accountOverview'),
        }}
      />
      <Stack.Screen
        name="currencies/index"
        options={{
          headerTitle: t('headerTitle.currencies'),
        }}
      />
      <Stack.Screen
        name="currencies/add"
        options={{
          headerTitle: t('headerTitle.addCurrency'),
        }}
      />
      <Stack.Screen
        name="budget/create"
        options={{
          headerTitle: t('headerTitle.addBudget'),
        }}
      />
      <Stack.Screen
        name="budget/[id]/edit"
        options={{
          headerTitle: t('headerTitle.editBudget'),
        }}
      />
      <Stack.Screen
        name="budget/[id]/index"
        options={{
          headerTitle: t('headerTitle.budgetOverview'),
        }}
      />
      <Stack.Screen
        name="paywall"
        options={{
          presentation: 'modal',
          headerTitle: '',
        }}
      />
      <Stack.Screen
        name="faq"
        options={{
          headerTitle: t('headerTitle.faq'),
        }}
      />
      <Stack.Screen
        name="data/index"
        options={{
          headerTitle: t('headerTitle.data'),
        }}
      />
      <Stack.Screen
        name="data/backup"
        options={{
          headerTitle: t('headerTitle.backup'),
        }}
      />
      <Stack.Screen
        name="data/export"
        options={{
          headerTitle: t('headerTitle.export'),
        }}
      />
      <Stack.Screen
        name="data/import"
        options={{
          headerTitle: t('headerTitle.import'),
        }}
      />
    </Stack>
  )
}
