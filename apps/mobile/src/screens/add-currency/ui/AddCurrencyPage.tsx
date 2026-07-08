import {useRouter} from 'expo-router'
import {useState} from 'react'
import {ActivityIndicator, View} from 'react-native'
import {CurrencyList} from '@widgets/currency-list'
import {CurrenciesSearchBar} from '@features/search-currencies'
import type {CreateCurrency} from '@entities/currency'
import {CurrencySymbolPositionConst, useCreateCurrency} from '@entities/currency'
import {useTranslation} from '@shared/i18n'
import {Button} from '@shared/ui/button'
import {Text} from '@shared/ui/text'
import {FinalFormProvider, useFinalForm} from '@shared/ui-primitives/FinalFormKit'
import {ScreenContent} from '@shared/ui-primitives/ScreenContent'
import {createCurrencyFormFieldsetSchema} from '../model/models'
import {useCurrencyFiltersStore} from '../model/store'
import type {CreateCurrencyFormFieldsetSchema} from '../model/models'

export default function AddCurrencyPage() {
  const {t} = useTranslation('AddCurrencyPage')
  const router = useRouter()
  const [checked, setChecked] = useState<CreateCurrency[]>([])
  const [loading, setLoading] = useState(false)
  const searchTerm = useCurrencyFiltersStore((state) => state.searchTerm)
  const setSearchTerm = useCurrencyFiltersStore((state) => state.setSearchTerm)
  const createCurrency = useCreateCurrency()

  const form = useFinalForm({
    schema: createCurrencyFormFieldsetSchema,
    defaultValues: {
      currency: '',
      name: '',
      symbol: '',
      symbolPosition: CurrencySymbolPositionConst.left,
      color: 'rose',
    },
  })

  const onCreateCurrency = async (value: CreateCurrencyFormFieldsetSchema) => {
    const currentIndex = checked.findIndex((obj) => obj.currency === value.currency)
    const newChecked = [...checked]

    if (currentIndex === -1) {
      newChecked.push(value)
    } else {
      newChecked.splice(currentIndex, 1)
    }
    setChecked(newChecked)
  }

  const handleAddCurrency = async () => {
    if (checked.length > 0) {
      setLoading(true)
      for (const currency of checked) {
        await createCurrency({
          ...currency,
        })
      }
      setLoading(false)
      router.back()
    }
  }

  return (
    <ScreenContent excludeEdges={['top', 'bottom']}>
      <FinalFormProvider {...form}>
        <View className="h-full px-3 py-3 relative">
          <CurrenciesSearchBar value={searchTerm} onChange={setSearchTerm} />
          <CurrencyList
            searchTerm={searchTerm}
            onSelect={onCreateCurrency}
            checked={checked}
            showEmptyState
          />
          <View className="absolute bottom-0 right-0 left-0 pb-10 pt-4 flex items-center justify-center bg-background/80">
            <Button onPress={handleAddCurrency} disabled={checked.length <= 0 || loading}>
              {loading ? <ActivityIndicator size="small" /> : null}
              <Text className="uppercase">{t('btnAdd')}</Text>
            </Button>
          </View>
        </View>
      </FinalFormProvider>
    </ScreenContent>
  )
}
