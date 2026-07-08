import {toast} from '@backpackapp-io/react-native-toast'
import {IconChevronRight, IconInfoCircle} from '@tabler/icons-react-native'
import {useLocales} from 'expo-localization'
import {useRouter} from 'expo-router'
import {useEffect, useState} from 'react'
import {ActivityIndicator, View} from 'react-native'
import type {CurrencyInfo} from '@widgets/currency-selector'
import {CurrencySelector} from '@widgets/currency-selector'
import {useCreateAccount} from '@entities/account'
import type {CreateCurrency} from '@entities/currency'
import {
  CurrencySymbolPositionConst,
  getCurrencyName,
  getCurrencySymbol,
  useCreateCurrency,
  useCurrenciesObserved,
} from '@entities/currency'
import {seedDatabaseIfNeeded} from '@shared/database'
import {useLocale, useTranslation} from '@shared/i18n'
import {globalStorage, STORAGE_FIRST_CURRENCY} from '@shared/storage/global-storage'
import {Button} from '@shared/ui/button'
import {Text} from '@shared/ui/text'
import {ScreenContent} from '@shared/ui-primitives/ScreenContent'

export default function SelectCurrencyPage() {
  const {t} = useTranslation('SelectCurrencyPage')
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [currency, setCurrency] = useState<CreateCurrency>()

  const {language} = useLocale()
  const locales = useLocales()
  const locale = locales[0]
  const defaultCurrency = locale.currencyCode ?? 'USD'
  const defaultCurrencyName = getCurrencyName(defaultCurrency, language)
  const defaultCurrencySymbol = getCurrencySymbol(defaultCurrency, language)

  const currencies = useCurrenciesObserved()
  const createCurrency = useCreateCurrency()
  const createAccount = useCreateAccount()

  const handleSelectCurrency = (currency: CurrencyInfo) => {
    setCurrency({
      ...currency,
      symbolPosition: CurrencySymbolPositionConst.left,
      color: 'rose',
    })
  }

  const handleNextStep = async () => {
    try {
      if (currency) {
        setLoading(true)
        let newCurrency
        if (Object.values(currencies).some((item) => item.currency === currency.currency)) {
          newCurrency = Object.values(currencies).find(
            (item) => item.currency === currency.currency
          )
        } else {
          newCurrency = await createCurrency({...currency})
        }
        globalStorage.setItem(STORAGE_FIRST_CURRENCY, newCurrency!.id)
        await createAccount({
          title: 'Bank account',
          currencyId: newCurrency!.id,
          icon: 'IconWallet',
          initialBalance: 0,
        })
        await seedDatabaseIfNeeded()
        setLoading(false)
        router.push('/(app)/(tabs)')
      }
    } catch (error) {
      toast.error(String(error))
      setLoading(false)
    }
  }

  useEffect(() => {
    setCurrency({
      currency: defaultCurrency,
      name: defaultCurrencyName,
      symbol: defaultCurrencySymbol,
      symbolPosition: CurrencySymbolPositionConst.left,
      color: 'rose',
    })
  }, [defaultCurrency])

  return (
    <ScreenContent excludeEdges={['bottom']}>
      <View className="h-full px-3 py-3 relative gap-6">
        <Text className="font-bold text-3xl">{t('title')}</Text>
        <View className="flex-row gap-2 p-4 bg-sky-100 dark:bg-sky-950 rounded-lg">
          <IconInfoCircle className="size-8 text-blue-400" />
          <Text className="flex-1">{t('info')}</Text>
        </View>
        <CurrencySelector
          value={
            currency ?? {
              currency: defaultCurrency,
              name: defaultCurrencyName,
              symbol: defaultCurrencySymbol,
              symbolPosition: CurrencySymbolPositionConst.left,
              color: 'rose',
            }
          }
          onChange={handleSelectCurrency}
        />
        <View className="absolute bottom-0 right-0 left-0 pb-16 px-4 pt-4 flex items-center justify-center">
          <Button size="lg" onPress={handleNextStep} disabled={loading} className="w-full">
            {loading ? <ActivityIndicator size="small" /> : null}
            <Text className="uppercase">{t('btnAdd')}</Text>
            <IconChevronRight className="size-5 text-foreground" />
          </Button>
        </View>
      </View>
    </ScreenContent>
  )
}
