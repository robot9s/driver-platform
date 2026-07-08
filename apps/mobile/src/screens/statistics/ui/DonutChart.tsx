import {Canvas, Path, Skia, Text} from '@shopify/react-native-skia'
import {useEffect} from 'react'
import {View} from 'react-native'
import {useDerivedValue, useSharedValue, withTiming} from 'react-native-reanimated'
import type {CategoryStatistics} from '@features/statistics'
import type {Currency} from '@entities/currency'
import {useLocale} from '@shared/i18n'
import {useColorPalette} from '@shared/lib/palette'
import {useColorScheme} from '@shared/lib/theme'
import {useStatisticsFiltersStore} from '../model/store'
import DonutPath from './DonutPath'
import type {SkFont} from '@shopify/react-native-skia'
import type {GestureResponderEvent} from 'react-native'

const RADIUS = 160
const STROKE_WIDTH = 40
const OUTER_STROKE_WIDTH = 40
const GAP_IN_DEGREES = 1
const PADDING = 20
const ANIMATION_DURATION = 300

const DonutChart = ({
  data,
  categories,
  total,
  selected,
  font,
  smallFont,
  labelFont,
  centerText,
  currency,
}: Props) => {
  const {language} = useLocale()
  const {colorScheme} = useColorScheme()
  const {getColor} = useColorPalette()

  const filters = useStatisticsFiltersStore((state) => state.filters)
  const isExpense = filters.type === 'expense'
  const fontsReady = !!font && !!smallFont && !!labelFont

  const innerRadius = RADIUS - OUTER_STROKE_WIDTH / 2
  const totalValue = useSharedValue(0)
  const decimals = useSharedValue<number[]>([])
  const animatedValue = useSharedValue(centerText.secondary)

  const path = Skia.Path.Make()
  path.addCircle(RADIUS + PADDING, RADIUS + PADDING, innerRadius)

  const smallText = useDerivedValue(() => {
    return centerText.primary.length > 0
      ? centerText.primary
      : isExpense
        ? 'Total Spent'
        : 'Total Income'
  })

  const targetText = useDerivedValue(() => {
    const amount = animatedValue.value > 0 ? animatedValue.value : totalValue.value
    return currency
      ? new Intl.NumberFormat(language, {
          style: 'currency',
          currency: currency?.currency,
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
        }).format(amount)
      : '0'
  })

  const fontSize = fontsReady ? font!.measureText('$00') : {width: 0, height: 0}
  const smallFontSize = fontsReady ? smallFont!.measureText('Total Spent') : {width: 0, height: 0}

  const textX = useDerivedValue(() => {
    if (!fontsReady) return 0
    const _m = font!.measureText(targetText.value)
    return RADIUS + PADDING - _m.width / 2
  }, [fontsReady])

  const textX2 = useDerivedValue(() => {
    if (!fontsReady) return 0
    const _m = smallFont!.measureText(smallText.value)
    return RADIUS + PADDING - _m.width / 2
  }, [fontsReady])

  const generateData = () => {
    const percentages = categories.map((c) => c.percentage)
    const totalGap = (percentages.length * GAP_IN_DEGREES) / 360
    const adjustedDecimals = percentages.map((p) => (p / 100) * (1 - totalGap))
    totalValue.value = withTiming(total, {duration: ANIMATION_DURATION})
    decimals.value = adjustedDecimals
  }

  useEffect(() => {
    if (fontsReady) {
      const t = setTimeout(generateData, 100)
      return () => clearTimeout(t)
    }
  }, [fontsReady, total])

  useEffect(() => {
    animatedValue.value = withTiming(centerText.secondary, {
      duration: ANIMATION_DURATION,
    })
  }, [centerText.secondary])

  const touchHandler = (e: GestureResponderEvent) => {
    const {locationX, locationY} = e.nativeEvent
    const dx = locationX - (RADIUS + PADDING)
    const dy = locationY - (RADIUS + PADDING)
    const distance = Math.sqrt(dx * dx + dy * dy)

    if (distance > innerRadius - STROKE_WIDTH / 2 && distance < innerRadius + STROKE_WIDTH / 2) {
      const angle = ((Math.atan2(dy, dx) * 180) / Math.PI + 360) % 360

      let cumulativeAngle = 0
      for (let i = 0; i < data.length; i++) {
        const segmentAngle = decimals.value[i] * 360
        const startAngle = cumulativeAngle
        const endAngle = cumulativeAngle + segmentAngle

        if (angle >= startAngle && angle <= endAngle) {
          data[i].onPress()
          break
        }

        cumulativeAngle += segmentAngle + GAP_IN_DEGREES
      }
    }
  }

  return (
    <View className="flex-1">
      <Canvas
        style={{
          width: RADIUS * 2 + PADDING * 2,
          height: RADIUS * 2 + PADDING * 2,
        }}
        onTouchStart={touchHandler}
      >
        <Path
          path={path}
          strokeWidth={OUTER_STROKE_WIDTH}
          style="stroke"
          color={data.length <= 0 ? getColor('--muted-foreground') : getColor('--background')}
        />
        {fontsReady &&
          data.map((pie, index) => (
            <DonutPath
              key={index}
              index={index}
              radius={RADIUS}
              strokeWidth={STROKE_WIDTH}
              gap={GAP_IN_DEGREES / 360}
              decimals={decimals}
              padding={PADDING}
              color={pie.color}
              label={`${Math.round(pie.value)}%`}
              labelFont={labelFont}
              isSelected={index === selected}
              animationDuration={ANIMATION_DURATION}
            />
          ))}
        <Text
          x={textX2}
          y={RADIUS + PADDING + smallFontSize.height / 2 - fontSize.height / 0.8}
          text={smallText}
          font={smallFont}
          color={getColor('--muted-foreground')}
        />
        <Text
          x={textX}
          y={RADIUS + PADDING + fontSize.height / 2}
          text={targetText}
          font={font}
          color={colorScheme === 'dark' ? 'white' : 'dark'}
        />
      </Canvas>
    </View>
  )
}

export default DonutChart

// TYPES

type Props = {
  data: DataItem[]
  categories: CategoryStatistics[]
  total: number
  selected: number | undefined
  font: SkFont | null
  smallFont: SkFont | null
  labelFont: SkFont | null
  centerText: {
    primary: string
    secondary: number
  }
  currency?: Currency
}

type DataItem = {
  id: string
  value: number
  title: string
  color: string
  onPress: (categoryId?: string) => void
}
