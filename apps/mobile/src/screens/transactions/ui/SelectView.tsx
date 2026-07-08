import {IconFilter} from '@tabler/icons-react-native'
import {useTranslation} from '@shared/i18n'
import {endOfMonth, startOfMonth} from '@shared/lib/dates'
import {cn} from '@shared/lib/utils'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/ui/select'
import {TransactionsView} from '../model/types'
import type {TimeRange} from '../model/types'

export function SelectView({
  value = TransactionsView.Default,
  onSelect,
  onTimeRangeChange,
}: SelectViewProps) {
  const {t} = useTranslation('SelectFilter')

  const options = [
    {
      value: TransactionsView.Default,
      label: t('defaultView'),
    },
    {
      value: TransactionsView.All,
      label: t('allEntries'),
    },
    {
      value: TransactionsView.ByDay,
      label: t('byDay'),
    },
    {
      value: TransactionsView.ByMonth,
      label: t('byMonth'),
    },
    {
      value: TransactionsView.ByYear,
      label: t('byYear'),
    },
  ]

  const handleSetFilter = (view: TransactionsView) => {
    const now = new Date()

    if (view === TransactionsView.ByDay) {
      onTimeRangeChange({
        from: new Date(now.setHours(0, 0, 0, 0)).toISOString(),
        to: new Date(now.setHours(23, 59, 59, 999)).toISOString(),
      })
    } else if (view === TransactionsView.ByMonth) {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      endOfMonth.setHours(23, 59, 59, 999)

      onTimeRangeChange({
        from: startOfMonth.toISOString(),
        to: endOfMonth.toISOString(),
      })
    } else if (view === TransactionsView.ByYear) {
      const startOfYear = new Date(now.getFullYear(), 0, 1)
      const endOfYear = new Date(now.getFullYear(), 11, 31)
      endOfYear.setHours(23, 59, 59, 999)

      onTimeRangeChange({
        from: startOfYear.toISOString(),
        to: endOfYear.toISOString(),
      })
    } else if (view === TransactionsView.All) {
      onTimeRangeChange({
        from: undefined,
        to: undefined,
      })
    } else if (view === TransactionsView.Default) {
      onTimeRangeChange({
        from: startOfMonth.toISOString(),
        to: endOfMonth.toISOString(),
      })
    }
    onSelect?.(view)
  }

  return (
    <Select
      value={options.find((option) => option.value === value) ?? options[0]}
      onValueChange={(selected) => {
        handleSetFilter(selected?.value as TransactionsView)
      }}
    >
      <SelectTrigger
        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
        className={cn(
          '!h-12 !px-2.5 flex-row items-center gap-2 rounded-full',
          value !== TransactionsView.Default && 'border-primary !bg-primary',
          value === TransactionsView.Default && '!w-12 justify-center'
        )}
      >
        <IconFilter
          className={cn(
            'h-5 w-5 text-foreground',
            value !== TransactionsView.Default && 'text-primary-foreground'
          )}
        />
        {value !== TransactionsView.Default && (
          <SelectValue
            className={cn('font-semiBold text-primary-foreground')}
            placeholder={t('placeholder')}
          >
            {value}
          </SelectValue>
        )}
      </SelectTrigger>
      <SelectContent sideOffset={6} align="end">
        <SelectGroup className="max-w-[260px] px-1">
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              label={option.label}
              className="flex-row items-center justify-between"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

// TYPES

type SelectViewProps = {
  value?: TransactionsView
  onSelect?: (type: TransactionsView) => void
  onTimeRangeChange: (timeRange: TimeRange) => void
}
