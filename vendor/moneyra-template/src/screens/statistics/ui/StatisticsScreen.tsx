import {IconChartPie3, IconLayoutList} from '@tabler/icons-react-native'
import {useState} from 'react'
import {View} from 'react-native'
import {AccountPickerSelect} from '@widgets/account-picker'
import {TimeRangeControl} from '@widgets/time-range-control'
import {useAccountsOnce} from '@entities/account'
import type {TDateISO} from '@shared/lib/dates'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@shared/ui/tabs'
import {ScreenContent} from '@shared/ui-primitives/ScreenContent'
import {useStatisticsFiltersStore} from '../model/store'
import {TPeriodFilter} from '../model/types'
import CategoryChartStatistics from './CategoryChartStatistics'
import CommonStatisticsList from './CommonStatisticsList'
import {StatisticsOptionsDropdown} from './StatisticsOptionsDropdown'
import {TypeSelectorFilter} from './TypeSelectorFilter'

export default function StatisticsScreen() {
  const filters = useStatisticsFiltersStore((state) => state.filters)
  const setStatisticsFilters = useStatisticsFiltersStore((state) => state.setStatisticsFilters)
  const {fromDateTimeRange, toDateTimeRange, accountId, type} = filters
  const [period, setPeriod] = useState<TPeriodFilter>(TPeriodFilter.ByMonth)
  const [value, setValue] = useState('chart')

  const {data: accounts} = useAccountsOnce()
  const selectedAccountId = accountId ?? accounts[0]?.id

  const handleSetTimeRange = (timeRange: TimeRange) => {
    setStatisticsFilters({
      ...filters,
      fromDateTimeRange: timeRange.from,
      toDateTimeRange: timeRange.to,
    })
  }

  return (
    <ScreenContent excludeEdges={['bottom']}>
      <View className="flex flex-row items-center justify-between gap-4 px-4 pb-3">
        <AccountPickerSelect
          accountId={selectedAccountId as string}
          selectAccount={(accountId) => {
            setStatisticsFilters({
              ...filters,
              accountId: accountId,
            })
          }}
        />
        <View className="flex-row items-center gap-2">
          <StatisticsOptionsDropdown
            value={period}
            onSelect={setPeriod}
            onTimeRangeChange={handleSetTimeRange}
          />
        </View>
      </View>
      <View className="flex-1 gap-3">
        <TimeRangeControl
          filter={period}
          timeRange={{
            from: fromDateTimeRange!,
            to: toDateTimeRange!,
          }}
          onTimeRangeChange={handleSetTimeRange}
        />
        <View className="flex-1">
          <Tabs value={value} onValueChange={(v) => setValue(v)} className="flex-1">
            <View className="flex-row justify-between h-14 px-4">
              <TabsList className="w-24">
                <TabsTrigger value="chart" className="h-10">
                  <IconChartPie3 className="text-foreground" />
                </TabsTrigger>
                <TabsTrigger value="summary" className="h-10">
                  <IconLayoutList className="text-foreground" />
                </TabsTrigger>
              </TabsList>
              <TypeSelectorFilter type={type} disabled={value === 'summary'} />
            </View>
            <TabsContent value="chart" className="flex-1">
              <CategoryChartStatistics />
            </TabsContent>
            <TabsContent value="summary" className="flex-1">
              <CommonStatisticsList />
            </TabsContent>
          </Tabs>
        </View>
      </View>
    </ScreenContent>
  )
}

type TimeRange = {
  from: TDateISO
  to: TDateISO
}
