import {BottomSheetFlatList, BottomSheetTextInput} from '@gorhom/bottom-sheet'
import {IconSearch} from '@tabler/icons-react-native'
import {useState} from 'react'
import {View} from 'react-native'
import {useTranslation} from '@shared/i18n'
import {cn} from '@shared/lib/utils'
import {Text} from '@shared/ui/text'
import MenuItem from '@shared/ui-primitives/MenuItem'
import {useCurrenciesObserved} from '../model/hooks'
import type {Currency} from '../model/models'

export function CurrencySheetList({onSelect, value}: CurrencySheetListProps) {
  const {t} = useTranslation('CurrencySheetList')
  const [searchValue, setSearchValue] = useState('')
  const currencies = useCurrenciesObserved()

  const filteredCurrencies = Object.values(currencies).filter((currency) => {
    const search = searchValue.toLowerCase()
    return (
      currency.name.toLowerCase().includes(search) || currency.id?.toLowerCase().includes(search)
    )
  })

  return (
    <BottomSheetFlatList
      data={filteredCurrencies}
      keyExtractor={(i: Currency) => i.id}
      contentContainerClassName={cn('pt-4 pb-8', filteredCurrencies.length <= 0 && 'flex-1')}
      stickyHeaderIndices={[0]}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      ListHeaderComponent={
        <View className="bg-background px-4">
          <IconSearch className="absolute top-2.5 left-7 z-10 h-6 w-6 text-muted-foreground" />
          <BottomSheetTextInput
            placeholder={t('placeholder')}
            placeholderClassName="text-muted-foreground font-regular"
            className="mb-3 web:flex h-11 web:w-full rounded-md border border-input bg-background px-3 web:py-2 pl-11 font-regular font-regular native:text-base text-foreground text-sm native:leading-[1.25] web:ring-offset-background file:border-0 file:bg-transparent file:font-medium placeholder:text-muted-foreground web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2 lg:text-sm"
            value={searchValue}
            onChangeText={setSearchValue}
          />
        </View>
      }
      renderItem={({item}: {item: Currency}) => (
        <MenuItem
          label={item.name}
          onPress={() => onSelect(item)}
          className={item.id === value ? 'bg-muted' : ''}
          rightSection={<Text>{item.symbol}</Text>}
        />
      )}
      ListEmptyComponent={
        <View className="flex-1 justify-center items-center">
          <Text className="mt-6 text-center text-muted-foreground">{t('notFound.title')}</Text>
          <Text className="text-center text-muted-foreground">{t('notFound.body')}</Text>
        </View>
      }
    />
  )
}

// TYPES

type CurrencySheetListProps = {
  onSelect: (currency: Currency) => void
  value: string
}
