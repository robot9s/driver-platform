import {useFont} from '@shopify/react-native-skia'
import {useMemo, useState} from 'react'
import {View} from 'react-native'
import type {TCategoryStatistics} from '@features/statistics'
import type {Currency} from '@entities/currency'
import {colorsPrimary} from '@shared/config/colors'
import {useColorScheme} from '@shared/lib/theme'
import DonutChart from './DonutChart'

const RADIUS = 160

export const PieChartByCategory = ({categories, total, currency}: PieChartByCategoryProps) => {
  const {colorScheme} = useColorScheme()
  const [selected, setSelected] = useState<number | undefined>(undefined)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(undefined)
  const selectedCategory = categories.find((c) => c.categoryId === selectedCategoryId)

  const _data = useMemo(() => {
    return categories?.map((stat, index) => {
      const colorPrimaryHex = colorsPrimary[stat.category?.color]

      return {
        id: stat.categoryId,
        value: stat.percentage,
        title: stat.category?.title ?? '',
        color: colorPrimaryHex ? colorPrimaryHex[colorScheme === 'dark' ? 'light' : 'dark'] : '',
        onPress: () => {
          setSelected(index === selected ? undefined : index)
          setSelectedCategoryId(index === selected ? undefined : stat.categoryId)
        },
      }
    })
  }, [categories, colorScheme, selected])

  const font = useFont(require('@assets/fonts/Inter-Bold.ttf'), 30)
  const smallFont = useFont(require('@assets/fonts/Inter-Regular.ttf'), 18)
  const labelFont = useFont(require('@assets/fonts/Inter-Regular.ttf'), 14)

  return (
    <View className="items-center -mt-3">
      <View
        className="justify-center content-center"
        style={{
          width: RADIUS * 2 + 20 * 2,
          height: RADIUS * 2 + 20 * 2,
        }}
      >
        <DonutChart
          data={_data}
          categories={categories}
          centerText={{
            primary: selectedCategory?.category?.title ?? '',
            secondary: selectedCategory?.amount ?? 0,
          }}
          font={font}
          smallFont={smallFont}
          labelFont={labelFont}
          total={total}
          selected={selected}
          currency={currency}
        />
      </View>
    </View>
  )
}

// TYPES

type PieChartByCategoryProps = {
  categories: TCategoryStatistics[]
  total: number
  currency?: Currency
}
