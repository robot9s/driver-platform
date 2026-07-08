import {IconBackspace} from '@tabler/icons-react-native'
import * as Haptics from 'expo-haptics'
import {View} from 'react-native'
import Animated from 'react-native-reanimated'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import {cn} from '@shared/lib/utils'
import {Button} from '@shared/ui/button'
import {Text} from '@shared/ui/text'

const buttonKeys = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0']

export function NumericPad({
  disabled,
  value = '0',
  onValueChange,
  maxValue = 9999999999,
  className,
}: NumericPadProps) {
  const {bottom} = useSafeAreaInsets()

  function handleKeyPress(key: string) {
    let newValue = value

    if (key === '.') {
      if (value.includes('.')) return
      newValue += '.'
    } else {
      newValue = value === '0' ? key : value + key
    }

    // Limit the fractional part to 2 characters
    if (newValue.includes('.')) {
      const [, decimal] = newValue.split('.')
      if (decimal.length > 2) return
    }

    const numericValue = parseFloat(newValue)
    if (!newValue.endsWith('.') && !isNaN(numericValue) && numericValue > maxValue) {
      return
    }

    onValueChange?.(newValue)
  }

  function handleDelete() {
    const newValue = value.slice(0, -1) || '0'
    onValueChange?.(newValue)
  }

  function handleClear() {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    onValueChange?.('0')
  }

  return (
    <Animated.View
      className={cn(
        'flex-row flex-wrap content-center items-center border-border border-t bg-background px-2 py-1.5',
        className
      )}
      style={{paddingBottom: bottom}}
    >
      {buttonKeys.map((buttonKey) => (
        <View key={buttonKey} className="w-[33.33%] p-1.5">
          <Button
            disabled={disabled}
            onPress={() => handleKeyPress(buttonKey)}
            variant="ghost"
            size="lg"
            className="bg-zinc-200 dark:bg-zinc-900"
          >
            <Text className="!text-2xl font-semiBold">{buttonKey}</Text>
          </Button>
        </View>
      ))}
      <View className="w-[33.33%] p-1.5">
        <Button
          disabled={disabled}
          onPress={handleDelete}
          onLongPress={handleClear}
          variant="secondary"
          size="lg"
        >
          <IconBackspace className="size-7 text-secondary-foreground" />
        </Button>
      </View>
    </Animated.View>
  )
}

// TYPES

type NumericPadProps = {
  disabled?: boolean
  value: string
  onValueChange?: (value: string) => void
  maxValue?: number
  className?: string
}
