import {BottomSheetFlatList} from '@gorhom/bottom-sheet'
import {IconPencil} from '@tabler/icons-react-native'
import {useCallback, useRef} from 'react'
import {Pressable, View} from 'react-native'
import type {TColor} from '@shared/config/colors'
import {colorsPrimary} from '@shared/config/colors'
import type {TCategoryIcon} from '@shared/config/icons'
import {categoryIcons} from '@shared/config/icons'
import {useTranslation} from '@shared/i18n'
import {useColorPalette} from '@shared/lib/palette'
import {useColorScheme} from '@shared/lib/theme'
import {cn} from '@shared/lib/utils'
import {Label} from '@shared/ui/label'
import {Text} from '@shared/ui/text'
import {GenericIcon} from '@shared/ui-primitives/GenericIcon'
import {BottomSheet} from '@shared/ui-primitives/Sheet'
import {CategoryIconPickerOption} from './CategoryIconPickerOption'
import type {BottomSheetModal} from '@gorhom/bottom-sheet'

export const CategoryIconPicker = ({value, onChange, label, color}: CategoryIconPickerProps) => {
  const {t} = useTranslation('CategoryIconPicker')
  const sheetRef = useRef<BottomSheetModal>(null)
  const {getColor} = useColorPalette()
  const {colorScheme} = useColorScheme()

  const handlePresentModalPress = useCallback(() => {
    sheetRef.current?.present()
  }, [])

  return (
    <>
      <View>
        <Label nativeID={`label-${label}`}>{label}</Label>
        <View className="items-center justify-center">
          <Pressable
            className="h-20 w-20 items-center justify-center rounded-lg bg-muted active:bg-muted/75"
            onPress={handlePresentModalPress}
          >
            <GenericIcon
              className={cn('h-14 w-14 text-foreground')}
              color={color && colorsPrimary[color][colorScheme]}
              name={value ?? 'IconBox'}
            />
            <View className="absolute -right-3 -bottom-3 bg-gray-300 dark:bg-gray-500 rounded-full p-1">
              <IconPencil size={16} color={getColor('--secondary-foreground')} />
            </View>
          </Pressable>
        </View>
      </View>
      <BottomSheet ref={sheetRef} index={0} snapPoints={['87%']}>
        <BottomSheetFlatList
          data={categoryIcons}
          numColumns={6}
          keyExtractor={(i: TCategoryIcon) => i}
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
          renderItem={({item: icon}: {item: TCategoryIcon}) => (
            <CategoryIconPickerOption
              key={icon}
              icon={icon}
              onChange={() => {
                onChange(icon)
                sheetRef.current?.close()
              }}
              value={value}
            />
          )}
        />
      </BottomSheet>
    </>
  )
}

// TYPES

interface CategoryIconPickerProps {
  value: TCategoryIcon
  onChange(icon: TCategoryIcon): void
  label?: string
  color?: TColor
}
