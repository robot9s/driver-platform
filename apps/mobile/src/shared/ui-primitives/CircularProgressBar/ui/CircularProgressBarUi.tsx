import {Canvas, Path, Skia, Text} from '@shopify/react-native-skia'
import {View} from 'react-native'
import {useDerivedValue} from 'react-native-reanimated'
import {useColorPalette} from '@shared/lib/palette'
import {useColorScheme} from '@shared/lib/theme'
import type {SkFont} from '@shopify/react-native-skia'
import type {SharedValue} from 'react-native-reanimated'

export const CircularProgressBarUi = ({
  radius,
  strokeWidth,
  percentage,
  end,
  font,
  fontSecondary,
  additionalText,
  offsetY = 1,
  progressColor,
  trackColor,
  textColor,
  secondaryTextColor,
  hideCenterText,
  className,
}: Props) => {
  const {colorScheme} = useColorScheme()
  const {getColor} = useColorPalette()
  const innerRadius = radius - strokeWidth / 2

  const path = Skia.Path.Make()
  path.addCircle(radius, radius, innerRadius)

  const targetText = useDerivedValue(() => `${percentage.value.toFixed(2)}%`, [])
  const fontSize = font.measureText('00%')

  const secondaryText = useDerivedValue(() => additionalText, [])
  const fontSecondarySize = additionalText
    ? fontSecondary?.measureText('00%')
    : font.measureText('00%')

  const textX = useDerivedValue(() => {
    const _fontSize = font.measureText(targetText.value)
    return radius - _fontSize.width / 2
  }, [])

  const additionalTextX = useDerivedValue(() => {
    const _fontSize = fontSecondary?.measureText(secondaryText.value ?? '')
    return radius - (_fontSize?.width ?? 1) / 2
  }, [])

  const _track = trackColor ?? getColor('--muted')
  const _progress =
    typeof progressColor === 'function'
      ? progressColor(percentage.value)
      : (progressColor ?? getColor('--primary'))
  const _text = textColor ?? (colorScheme === 'dark' ? '#fff' : '#111')
  const _secondary = secondaryTextColor ?? getColor('--muted-foreground')

  return (
    <View style={{width: radius * 2 + 0.5, height: radius * 2 + 0.5}} className={className}>
      <Canvas style={{flex: 1}}>
        <Path
          path={path}
          strokeWidth={strokeWidth}
          color={_track}
          style="stroke"
          strokeCap="round"
        />

        <Path
          path={path}
          strokeWidth={strokeWidth}
          color={_progress}
          style="stroke"
          strokeJoin="round"
          strokeCap="round"
          start={0}
          end={end}
        />
        {!hideCenterText && (
          <Text
            x={textX}
            y={radius * offsetY + fontSize.height / 2}
            text={targetText}
            font={font}
            color={_text}
          />
        )}
        {!hideCenterText && additionalText && fontSecondary && fontSecondarySize && (
          <Text
            x={additionalTextX}
            y={radius * offsetY + fontSecondarySize.height * 2}
            text={additionalText}
            font={fontSecondary}
            color={_secondary}
          />
        )}
      </Canvas>
    </View>
  )
}

// TYPES

type Props = {
  strokeWidth: number
  radius: number
  percentage: SharedValue<number>
  end: SharedValue<number>
  font: SkFont
  fontSecondary?: SkFont
  additionalText?: string
  offsetY?: number
  progressColor?: string | ((value: number) => string)
  trackColor?: string
  textColor?: string
  secondaryTextColor?: string
  hideCenterText?: boolean
  className?: string
}
