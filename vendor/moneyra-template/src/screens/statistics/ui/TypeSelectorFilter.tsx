import {IconSelector} from '@tabler/icons-react-native'
import type {TransactionType} from '@entities/transaction'
import {useTranslation} from '@shared/i18n'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/ui/select'
import {useStatisticsFiltersStore} from '../model/store'

export function TypeSelectorFilter({type, disabled}: TypeSelectorProps) {
  const {t} = useTranslation('TypeSelectorFilter')

  const filters = useStatisticsFiltersStore((state) => state.filters)
  const setStatisticsFilters = useStatisticsFiltersStore((state) => state.setStatisticsFilters)

  const options = [
    {
      value: 'expense',
      label: t('expense'),
    },
    {
      value: 'income',
      label: t('income'),
    },
  ]

  const handleSetFilter = (value: 'expense' | 'income') => {
    setStatisticsFilters({...filters, type: value})
  }

  return (
    <Select
      value={options.find((option) => option.value === type) ?? options[0]}
      onValueChange={(selected) => {
        handleSetFilter(selected?.value as TransactionType)
      }}
      disabled={disabled}
    >
      <SelectTrigger
        hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
        className="!h-12 !px-2.5 flex-row items-center gap-2"
      >
        <SelectValue className="font-semiBold text-foreground" placeholder="period">
          {type}
        </SelectValue>
        <IconSelector className="h-5 w-5 text-foreground" />
      </SelectTrigger>
      <SelectContent sideOffset={6} align="end">
        <SelectGroup className="max-w-[260px] px-1">
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              label={option.label}
              className="flex-row items-center justify-between"
              disabled={disabled}
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

type TypeSelectorProps = {
  type?: TransactionType | TransactionType[]
  disabled?: boolean
}
