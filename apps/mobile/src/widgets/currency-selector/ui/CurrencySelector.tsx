import {BottomSheetFlatList, BottomSheetTextInput} from '@gorhom/bottom-sheet'
import {IconChevronDown, IconSearch} from '@tabler/icons-react-native'
import {useRef, useState} from 'react'
import {Keyboard, View} from 'react-native'
import {searchCurrenciesByTitle} from '@features/search-currencies'
import type {CreateCurrency} from '@entities/currency'
import {getSupportedCurrencies} from '@entities/currency'
import type {Currency} from '@shared/config/currencies'
import {useLocale, useTranslation} from '@shared/i18n'
import {cn} from '@shared/lib/utils'
import {Button} from '@shared/ui/button'
import {Label} from '@shared/ui/label'
import {Text} from '@shared/ui/text'
import MenuItem from '@shared/ui-primitives/MenuItem'
import {BottomSheet} from '@shared/ui-primitives/Sheet'
import type {BottomSheetModal} from '@gorhom/bottom-sheet'

export const CurrencySelector = ({value, onChange}: CurrencySelectorProps) => {
  const sheetRef = useRef<BottomSheetModal>(null)
  const {language} = useLocale()
  const currencies = getSupportedCurrencies({locale: language})
  const currency = value ? currencies.find((c) => c.currency === value.currency) : ''

  return (
    <View className="gap-1 mr-1">
      <View className="gap-1">
        <Label nativeID="label-account">Currency</Label>
        <Button
          onPress={() => {
            Keyboard.dismiss()
            sheetRef.current?.present()
          }}
          variant="ghost"
          className="!border !h-11 !py-0 !px-3 w-full rounded-r border-input justify-between"
        >
          <Text>{currency ? `${currency.name} (${currency.symbol})` : 'Select your currency'}</Text>
          <IconChevronDown
            size={16}
            aria-hidden={true}
            className="text-foreground opacity-50 justify-center"
          />
        </Button>
      </View>
      <BottomSheet ref={sheetRef} index={0} snapPoints={['65%']} enableDynamicSizing={false}>
        <CurrencySheetList
          value={value.currency}
          onSelect={(currency) => {
            sheetRef.current?.close()
            onChange?.(currency)
          }}
        />
      </BottomSheet>
    </View>
  )
}

// PARTS

function CurrencySheetList({onSelect, value}: CurrencySheetListProps) {
  const {t} = useTranslation('CurrencySheetList')
  const [searchValue, setSearchValue] = useState('')
  const {language} = useLocale()
  const currencies = getSupportedCurrencies({locale: language})
  const filteredCurrencies = searchCurrenciesByTitle(currencies, searchValue)

  return (
    <BottomSheetFlatList
      data={filteredCurrencies}
      keyExtractor={(i: CurrencyInfo) => i.currency}
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
      renderItem={({item}: {item: CurrencyInfo}) => (
        <MenuItem
          label={item.name}
          onPress={() => onSelect(item)}
          className={item.currency === value ? 'bg-muted' : ''}
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

type CurrencySelectorProps = {
  value: CreateCurrency
  onChange?: (currency: CurrencyInfo) => void
}

type CurrencySheetListProps = {
  onSelect: (currency: CurrencyInfo) => void
  value: string
}

type CurrencyInfo = {
  currency: Currency
  name: string
  symbol: string
}

export type {CurrencyInfo}
