import {View} from 'react-native'
import type {TransactionFilters} from '@entities/transaction'
import {useLocale} from '@shared/i18n'
import type {TDateISO} from '@shared/lib/dates'
import {cn} from '@shared/lib/utils'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/ui/select'
import {Text} from '@shared/ui/text'
import {getAllMonths} from '../lib/getAllMonths'
import {getMonthIndex} from '../lib/getMonthIndex'

const now = new Date()

export const MonthsSelector = ({from, onChange}: MonthsSliderProps) => {
  const {language} = useLocale()
  const months = getAllMonths({locale: language})
  const selectedMonth = from ?? new Date().toISOString()
  const monthIndex = new Date(selectedMonth).getMonth()

  return (
    <View className={cn('h-12 justify-center w-[90px] ', language === 'ru' && 'w-[100px]')}>
      <Select
        value={{value: months[monthIndex], label: months[monthIndex]}}
        onValueChange={(selected) => {
          setTimeout(() => {
            const index = getMonthIndex(selected!.value, language)
            const endOfMonth = new Date(now.getFullYear(), index + 1, 0)
            endOfMonth.setHours(23, 59, 59, 999)
            onChange({
              from: new Date(Date.UTC(now.getFullYear(), index, 1)).toISOString(),
              to: endOfMonth.toISOString(),
            })
          })
        }}
      >
        <SelectTrigger className="h-12 p-0 pl-4 pr-3 border-[1px] border-border rounded-full">
          <View className="gap-1">
            <Text className="font-semiBold text-muted-foreground/60 text-xs -mb-2">
              {now.getFullYear()}
            </Text>
            <SelectValue
              className="text-foreground text-xl uppercase"
              placeholder="Choose month"
              adjustsFontSizeToFit
              numberOfLines={1}
            />
          </View>
        </SelectTrigger>
        <SelectContent className="max-h-[450px]">
          <SelectGroup className="px-1">
            {months.map((month) => (
              <SelectItem
                key={month}
                label={month}
                value={month}
                className="flex-row justify-between uppercase"
              >
                {month}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </View>
  )
}

// TYPES

interface MonthsSliderProps {
  from: TDateISO
  onChange({from, to}: TOptions): void
}

type TOptions = {
  from: TransactionFilters['fromDateTimeRange']
  to: TransactionFilters['toDateTimeRange']
}
