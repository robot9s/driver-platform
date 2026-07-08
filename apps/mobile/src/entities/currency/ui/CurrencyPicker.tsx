import {useRef} from 'react'
import {Keyboard} from 'react-native'
import {cn} from '@shared/lib/utils'
import {Button} from '@shared/ui/button'
import {Text} from '@shared/ui/text'
import {BottomSheet} from '@shared/ui-primitives/Sheet'
import {useCurrenciesObserved} from '../model/hooks'
import {CurrencySheetList} from './CurrencySheet'
import type {BottomSheetModal} from '@gorhom/bottom-sheet'

export function CurrencyPicker({value, onChange, className}: TCurrencyPickerProps) {
  const sheetRef = useRef<BottomSheetModal>(null)
  const currencies = useCurrenciesObserved()
  const currency = value ? currencies.find((currency) => currency.id === value) : ''

  return (
    <>
      <Button
        variant="ghost"
        onPress={() => {
          Keyboard.dismiss()
          sheetRef.current?.present()
        }}
        className={cn('!border-r !h-12 !py-0 !px-0 !w-16 rounded-r-none border-input', className)}
      >
        <Text className="text-foreground text-xl">{currency ? currency.symbol : ''}</Text>
      </Button>
      <BottomSheet ref={sheetRef} index={0} snapPoints={['50%']}>
        <CurrencySheetList
          value={value}
          onSelect={(currency) => {
            onChange?.(currency.id)
            setTimeout(() => sheetRef.current?.close(), 200)
          }}
        />
      </BottomSheet>
    </>
  )
}

// TYPES

type TCurrencyPickerProps = {
  value: string
  onChange?: (currency: string) => void
  className?: string
}
