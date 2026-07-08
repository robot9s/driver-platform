import {BottomSheetFlatList} from '@gorhom/bottom-sheet'
import {IconPencil} from '@tabler/icons-react-native'
import {useCallback, useRef} from 'react'
import {Keyboard, Pressable, View} from 'react-native'
import type {TWalletIcon} from '@shared/config/icons'
import {WALLET_ICONS} from '@shared/config/icons'
import {useTranslation} from '@shared/i18n'
import {useColorPalette} from '@shared/lib/palette'
import {cn} from '@shared/lib/utils'
import {Button} from '@shared/ui/button'
import {Label} from '@shared/ui/label'
import {Text} from '@shared/ui/text'
import {GenericIcon} from '@shared/ui-primitives/GenericIcon'
import {BottomSheet} from '@shared/ui-primitives/Sheet'
import type {BottomSheetModal} from '@gorhom/bottom-sheet'

export function WalletIconPicker({value, onChange}: TWalletIconPickerProps) {
  const {t} = useTranslation('WalletIconPicker')
  const sheetRef = useRef<BottomSheetModal>(null)
  const {getColor} = useColorPalette()

  const handlePresentModalPress = useCallback(() => {
    Keyboard.dismiss()
    sheetRef.current?.present()
  }, [])

  return (
    <>
      <View>
        <Label>{t('label')}</Label>
        <View className="items-center justify-center">
          <Pressable
            className="h-20 w-20 items-center justify-center rounded-lg bg-muted active:bg-muted/75"
            onPress={handlePresentModalPress}
          >
            <GenericIcon
              className={cn('h-14 w-14 text-foreground')}
              name={(value as TWalletIcon) ?? 'IconWallet'}
            />
            <View className="absolute -right-3 -bottom-3 bg-gray-300 dark:bg-gray-500 rounded-full p-1">
              <IconPencil size={16} color={getColor('--secondary-foreground')} />
            </View>
          </Pressable>
        </View>
      </View>
      <BottomSheet ref={sheetRef} index={0} enableDynamicSizing>
        <BottomSheetFlatList
          data={WALLET_ICONS}
          numColumns={6}
          keyExtractor={(i: TWalletIcon) => i}
          contentContainerClassName="pb-8 px-4 gap-2"
          columnWrapperClassName="gap-2"
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          ListHeaderComponent={
            <View className="flex-row justify-between items-center pb-5 px-2">
              <Text className="text-lg">{t('title')}</Text>
            </View>
          }
          renderItem={({item}: {item: TWalletIcon}) => (
            <Button
              size="icon"
              className={cn(
                'flex h-16 flex-1 flex-grow',
                value === item && 'border border-primary'
              )}
              variant={value === item ? 'secondary' : 'outline'}
              onPress={() => {
                onChange?.(item)
                setTimeout(() => sheetRef.current?.close(), 200)
              }}
            >
              <GenericIcon name={item as never} className="size-7 text-primary" />
            </Button>
          )}
        />
      </BottomSheet>
    </>
  )
}

// TYPES

type TWalletIconPickerProps = {
  value: string
  onChange?: (currency: string) => void
}
