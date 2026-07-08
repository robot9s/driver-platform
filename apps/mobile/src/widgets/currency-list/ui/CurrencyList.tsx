import {LegendList} from '@legendapp/list'
import {Pressable} from 'react-native'
import {searchCurrenciesByTitle} from '@features/search-currencies'
import type {CreateCurrency} from '@entities/currency'
import {CurrencySymbolPositionConst, CurrencyCard, getSupportedCurrencies} from '@entities/currency'
import {useLocale, useTranslation} from '@shared/i18n'
import {cn} from '@shared/lib/utils'
import {Checkbox} from '@shared/ui/checkbox'
import {Text} from '@shared/ui/text'

export const CurrencyList = ({
  onSelect,
  checked = [],
  searchTerm,
  showEmptyState = false,
}: CurrencyListProps) => {
  const {t} = useTranslation('CurrencyList')
  const {language} = useLocale()
  const currencies = getSupportedCurrencies({locale: language})

  const filteredCurrencies = searchCurrenciesByTitle(currencies, searchTerm)

  const handlePress = (currency: TCurrency) => {
    onSelect({
      ...currency,
      symbolPosition: CurrencySymbolPositionConst.left,
      color: 'rose',
    })
  }

  return (
    <LegendList
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      refreshing={false}
      contentContainerClassName="pt-4 gap-3 pb-36"
      automaticallyAdjustContentInsets={true}
      data={filteredCurrencies}
      renderItem={({item: currency}) => {
        return (
          <Pressable
            key={currency.currency}
            onPress={() => handlePress(currency)}
            className={cn(
              'bg-muted-foreground/10 border border-muted mb-2 rounded-lg active:bg-muted',
              checked.some((c) => c.currency === currency.currency) &&
                'bg-muted border-muted-foreground/80'
            )}
          >
            <CurrencyCard
              currency={currency}
              actions={
                <Checkbox
                  checked={checked.some((c) => c.currency === currency.currency)}
                  onCheckedChange={() => handlePress(currency)}
                  className="active:bg-muted"
                />
              }
            />
          </Pressable>
        )
      }}
      ListEmptyComponent={
        showEmptyState ? (
          <Text className="mt-6 mb-9 text-center text-muted-foreground">{t('notFound')}</Text>
        ) : null
      }
    />
  )
}

// TYPES

interface CurrencyListProps {
  onSelect: (currency: CreateCurrency) => void
  checked?: TCurrency[]
  filters?: unknown
  searchTerm?: string
  showEmptyState?: boolean
}

type TCurrency = Omit<CreateCurrency, 'symbolPosition' | 'color'>
