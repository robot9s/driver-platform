import {IconChevronDown} from '@tabler/icons-react-native'
import {useCallback, useRef} from 'react'
import {Keyboard, Pressable, View} from 'react-native'
import {useCategoriesOnce} from '@entities/category'
import {cn} from '@shared/lib/utils'
import {Badge} from '@shared/ui/badge'
import {Label} from '@shared/ui/label'
import {Text} from '@shared/ui/text'
import {BottomSheet} from '@shared/ui-primitives/Sheet'
import {CategorySheet} from './CategorySheet'
import type {BottomSheetModal} from '@gorhom/bottom-sheet'

export const CategoryPickerField = ({
  value,
  onChange,
  label,
  multiple = false,
}: CategoryPickerProps) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)
  const {data: expenseCategories} = useCategoriesOnce('expense')

  const categories = expenseCategories
  const categoryIds = String(value)
    .split(',')
    .map((item) => item.trim())

  const selectedCategories = Object.values(categories).filter((category) => {
    if (Array.isArray(categoryIds)) {
      return categoryIds.some((id) => id === category.id)
    } else {
      return category.id === value
    }
  })

  const handlePresentModalPress = useCallback(() => {
    Keyboard.dismiss()
    bottomSheetModalRef.current?.present()
  }, [])

  return (
    <>
      <View className="gap-1">
        <Label nativeID="label-category">{label}</Label>
        <Pressable
          className={cn(
            'relative flex-row border py-2 px-3 w-full rounded-md border-input justify-between items-center active:bg-muted-foreground/20',
            selectedCategories.length > 0 && 'border-stone-600'
          )}
          style={{minHeight: 42}}
          onPress={handlePresentModalPress}
        >
          <View className="flex-row gap-1 flex-wrap pr-5">
            {selectedCategories.length > 0 ? (
              selectedCategories.map((category) => (
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                <Badge key={category.id} onPress={() => handlePresentModalPress()}>
                  <Text className="line-clamp-1 shrink">{category.title || `Uncategorized`}</Text>
                </Badge>
              ))
            ) : (
              <Text>{'Select categories'}</Text>
            )}
          </View>
          <View className="absolute top-0 bottom-0 right-3 justify-center items-center">
            <IconChevronDown className="size-5 text-foreground opacity-50 justify-center" />
          </View>
        </Pressable>
      </View>
      <BottomSheet ref={bottomSheetModalRef} index={0} enableDynamicSizing>
        <CategorySheet
          onSelect={(currency) => {
            onChange?.(currency)
          }}
          value={value}
          type="expense"
          multiple={multiple}
          closeSheetModal={bottomSheetModalRef.current?.close}
        />
      </BottomSheet>
    </>
  )
}

// TYPES

interface CategoryPickerProps {
  value?: string | string[] | null
  onChange: (id: string | string[]) => void
  label?: string
  multiple?: boolean
}
