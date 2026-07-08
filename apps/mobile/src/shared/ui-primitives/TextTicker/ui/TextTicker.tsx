import {useEffect, useMemo, useState} from 'react'
import {type TextStyle, TouchableOpacity} from 'react-native'
import {InteractionManager} from 'react-native'
import Animated, {LinearTransition, SlideInDown, SlideOutDown} from 'react-native-reanimated'
import {cn} from '@shared/lib/utils'
import {Text} from '@shared/ui/text'

export function TextTicker({
  style,
  className,
  value = '0',
  formatter = new Intl.NumberFormat('en'),
  suffix,
  suffixClassName,
  onPressSuffix,
}: TextTickerProps) {
  const initialFontSize = style?.fontSize ?? 68
  const animationDuration = 300
  const [fontSize, setFontSize] = useState(initialFontSize)
  const [canAnimate, setCanAnimate] = useState(false)

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => setCanAnimate(true))
    return () => task.cancel?.()
  }, [])

  const formattedNumbers = useMemo(
    () => formatNumberWithCommas(formatter, value || '0'),
    [value, formatter]
  )

  return (
    <Animated.View style={{height: fontSize * 1.2}} className="w-full">
      <Text
        numberOfLines={1}
        adjustsFontSizeToFit
        className={cn(className, 'absolute right-0 left-0 text-center opacity-0')}
        style={{fontSize: initialFontSize, lineHeight: initialFontSize, top: -10000}}
        onTextLayout={(e) => setFontSize(Math.round(e.nativeEvent.lines[0].ascender))}
      >
        {formattedNumbers.map((x) => x.value).join('')}
      </Text>
      <Animated.View className="w-full flex-1 flex-row items-end justify-center overflow-hidden">
        {formattedNumbers.map((formattedNumber) => (
          <Animated.View
            key={formattedNumber.key}
            layout={canAnimate ? LinearTransition.duration(animationDuration) : undefined}
            entering={
              canAnimate
                ? SlideInDown.duration(animationDuration).withInitialValues({
                    originY: initialFontSize / 2,
                  })
                : undefined
            }
            exiting={
              canAnimate
                ? SlideOutDown.duration(animationDuration).withInitialValues({
                    transform: [{translateY: -initialFontSize / 2}],
                  })
                : undefined
            }
          >
            <Animated.Text style={[style, {fontSize}]} className={cn(className, 'font-semiBold')}>
              {formattedNumber.value}
            </Animated.Text>
          </Animated.View>
        ))}
        {!!suffix && (
          <Animated.View
            layout={canAnimate ? LinearTransition.duration(animationDuration) : undefined}
            style={{marginBottom: fontSize / 6}}
          >
            <TouchableOpacity activeOpacity={0.8} onPress={onPressSuffix}>
              <Animated.Text
                style={{fontSize: fontSize / 2}}
                className={cn(suffixClassName, 'font-medium text-muted-foreground')}
              >
                {suffix}
              </Animated.Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </Animated.View>
    </Animated.View>
  )
}

// PARTS

function formatNumberWithCommas(formatter: Intl.NumberFormat, input: string) {
  const endsWithDot = input.endsWith('.')
  const hasDecimalPart = input.includes('.') && !endsWithDot

  if (!input.match(/^\d+(\.\d{0,})?$/)) {
    // Fallback: invalid string - just output as is
    return input.split('').map((char, index) => ({
      value: char,
      key: `char-${index}`,
    }))
  }

  if (endsWithDot) {
    // Example: '5.' - display as ['5', '.']
    return input.split('').map((char, index) => ({
      value: char,
      key: `char-${index}`,
    }))
  }

  if (hasDecimalPart) {
    const [int, dec] = input.split('.')
    const formattedInt = formatter.format(Number(int))
    const chars = [...formattedInt, '.', ...dec]

    return chars.map((char, index) => ({
      value: char,
      key: `char-${index}`,
    }))
  }

  // A normal number, without a dot
  const formatted = formatter.format(Number(input))
  return formatted.split('').map((char, index) => ({
    value: char,
    key: `char-${index}`,
  }))
}

type TextTickerProps = {
  style?: TextStyle
  className?: string
  onChangeText?: (text: string) => void
  value: string
  formatter?: Intl.NumberFormat
  autoFocus?: boolean
  suffix?: string
  suffixClassName?: string
  onPressSuffix?: () => void
}
