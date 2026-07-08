import {IconCheck, IconDots} from '@tabler/icons-react-native'
import {View} from 'react-native'
import {useTranslation} from '@shared/i18n'
import type {TDateISO} from '@shared/lib/dates'
import {cn} from '@shared/lib/utils'
import {useUserSettingsStore} from '@shared/stores/user-settings'
import {Button} from '@shared/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@shared/ui/dropdown-menu'
import {Text} from '@shared/ui/text'
import {TPeriodFilter} from '../model/types'

export function StatisticsOptionsDropdown({
  value = TPeriodFilter.ByMonth,
  onTimeRangeChange,
  onSelect,
}: SelectFilterProps) {
  const {t} = useTranslation('PeriodFilter')

  const options = [
    {
      value: TPeriodFilter.ByDay,
      label: t('byDay'),
    },
    {
      value: TPeriodFilter.ByMonth,
      label: t('byMonth'),
    },
    {
      value: TPeriodFilter.ByYear,
      label: t('byYear'),
    },
  ]

  const showStatisticsDiagram = useUserSettingsStore((state) => state.showStatisticsDiagram)
  const setShowStatisticsDiagram = useUserSettingsStore((state) => state.setShowStatisticsDiagram)

  const handleSetFilter = (filter: TPeriodFilter) => {
    const now = new Date()

    if (filter === TPeriodFilter.ByDay) {
      onTimeRangeChange({
        from: new Date(now.setHours(0, 0, 0, 0)).toISOString(),
        to: new Date(now.setHours(23, 59, 59, 999)).toISOString(),
      })
    } else if (filter === TPeriodFilter.ByMonth) {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      endOfMonth.setHours(23, 59, 59, 999)

      onTimeRangeChange({
        from: startOfMonth.toISOString(),
        to: endOfMonth.toISOString(),
      })
    } else if (filter === TPeriodFilter.ByYear) {
      const startOfYear = new Date(now.getFullYear(), 0, 1)
      const endOfYear = new Date(now.getFullYear(), 11, 31)
      endOfYear.setHours(23, 59, 59, 999)

      onTimeRangeChange({
        from: startOfYear.toISOString(),
        to: endOfYear.toISOString(),
      })
    }
    onSelect?.(filter)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            '!h-12 w-12 !px-2.5 !py-0 flex-row items-center gap-2 rounded-full',
            value !== TPeriodFilter.ByMonth && 'border-primary bg-primary w-auto'
          )}
        >
          <IconDots
            className={cn(
              'size-6 text-foreground',
              value !== TPeriodFilter.ByMonth && 'text-primary-foreground'
            )}
          />
          {value !== TPeriodFilter.ByMonth && (
            <Text className="text-primary-foreground">
              {options.find((o) => o.value === value)?.label}
            </Text>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-52" insets={{top: 10, bottom: 10, left: 10, right: 10}}>
        <DropdownMenuGroup>
          {options.map((option) => (
            <DropdownMenuItem
              key={option.value}
              onPress={() => {
                handleSetFilter(option?.value as TPeriodFilter)
              }}
            >
              <View className="flex flex-row items-center justify-center gap-2">
                <IconCheck
                  className={cn(
                    'size-6 text-popover-foreground invisible',
                    value === option?.value && 'visible'
                  )}
                />
                <Text>{option.label}</Text>
              </View>
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onPress={() => setShowStatisticsDiagram(!showStatisticsDiagram)}>
          <View className="flex flex-row items-center justify-center gap-2">
            <IconCheck
              className={cn(
                'size-6 text-popover-foreground invisible',
                !showStatisticsDiagram && 'visible'
              )}
            />
            <Text>Hide diagram</Text>
          </View>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

// TYPES

type SelectFilterProps = {
  value: TPeriodFilter
  onTimeRangeChange: (timeRange: TimeRange) => void
  onSelect?: (type: TPeriodFilter) => void
}

type TimeRange = {
  from: TDateISO
  to: TDateISO
}
