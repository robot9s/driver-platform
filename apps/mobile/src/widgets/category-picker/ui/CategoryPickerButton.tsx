import {IconCategory} from '@tabler/icons-react-native'
import {useCallback, useRef, useEffect, useState} from 'react'
import {useFormState} from 'react-hook-form'
import {Keyboard, Animated} from 'react-native'
import type {CategoryType} from '@entities/category'
import {useCategoriesOnce} from '@entities/category'
import {colorsPrimary} from '@shared/config/colors'
import {cn, useColorScheme} from '@shared/lib/theme'
import {Button} from '@shared/ui/button'
import {Text} from '@shared/ui/text'
import {GenericIcon} from '@shared/ui-primitives/GenericIcon'
import {BottomSheet} from '@shared/ui-primitives/Sheet'
import {CategorySheet} from './CategorySheet'
import type {BottomSheetModal} from '@gorhom/bottom-sheet'

export const CategoryPickerButton = ({
  type,
  onChange,
  value,
  multiple = false,
}: CategoryPickerProps) => {
  const {colorScheme} = useColorScheme()
  const {errors} = useFormState()
  const [isError, setIsError] = useState(false)
  const bottomSheetModalRef = useRef<BottomSheetModal>(null)
  const {data: expenseCategories} = useCategoriesOnce('expense')
  const {data: incomeCategories} = useCategoriesOnce('income')
  const shakeAnim = useRef(new Animated.Value(0)).current

  const categories = type === 'income' ? incomeCategories : expenseCategories
  const selectedCategories = Object.values(categories).filter((category) => {
    if (Array.isArray(value)) {
      return value.some((id) => id === category.id)
    } else {
      return category.id === value
    }
  })

  const handlePresentModalPress = useCallback(() => {
    Keyboard.dismiss()
    bottomSheetModalRef.current?.present()
  }, [])

  const triggerShake = useCallback(() => {
    Animated.sequence([
      Animated.timing(shakeAnim, {toValue: 8, duration: 50, useNativeDriver: true}),
      Animated.timing(shakeAnim, {toValue: -8, duration: 50, useNativeDriver: true}),
      Animated.timing(shakeAnim, {toValue: 8, duration: 50, useNativeDriver: true}),
      Animated.timing(shakeAnim, {toValue: 0, duration: 50, useNativeDriver: true}),
    ]).start()
  }, [shakeAnim])

  useEffect(() => {
    if (errors.categoryId) {
      setIsError(true)
      triggerShake()
      const timer = setTimeout(() => {
        setIsError(false)
      }, 1500)

      return () => clearTimeout(timer)
    }
  }, [errors.categoryId, triggerShake])

  return (
    <>
      <Animated.View style={{transform: [{translateX: shakeAnim}]}}>
        <Button
          variant="secondary"
          className={cn('!px-2 max-w-[150px]', isError && 'bg-red-800')}
          onPress={() => {
            Keyboard.dismiss()
            handlePresentModalPress()
          }}
        >
          {!Array.isArray(value) && selectedCategories[0]?.icon ? (
            <GenericIcon
              name={selectedCategories[0]?.icon}
              className="size-6 text-secondary-foreground"
              color={colorsPrimary[selectedCategories[0]?.color][colorScheme]}
            />
          ) : (
            <IconCategory className="size-6 text-secondary-foreground" />
          )}
          <Text className="line-clamp-1 shrink">
            {selectedCategories[0]?.title || `Uncategorized`}
          </Text>
        </Button>
      </Animated.View>
      <BottomSheet ref={bottomSheetModalRef} index={0} enableDynamicSizing>
        <CategorySheet
          onSelect={(currency) => {
            onChange?.(currency)
          }}
          value={value}
          type={type}
          multiple={multiple}
          closeSheetModal={bottomSheetModalRef.current?.close}
        />
      </BottomSheet>
    </>
  )
}

// TYPES

interface CategoryPickerProps {
  type: CategoryType
  onChange: (id: string | string[]) => void
  value?: string | string[] | null
  multiple?: boolean
}
