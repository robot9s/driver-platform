import {View} from 'react-native'
import {useSafeAreaInsets} from 'react-native-safe-area-context'
import {Label} from '@shared/ui/label'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@shared/ui/select'
import type {PeriodTimeType} from '../types'

export const PeriodTimeSelectField = ({value, onChange, label}: PeriodTimeSelectFieldProps) => {
  const insets = useSafeAreaInsets()
  const contentInsets = {
    top: insets.top,
    bottom: insets.bottom,
    left: 12,
    right: 12,
  }

  return (
    <View className="gap-1">
      <Label nativeID="label-period">{label}</Label>
      <Select
        defaultValue={{value: value, label: 'Monthly'}}
        onValueChange={(option) => {
          onChange(option?.value as PeriodTimeType)
        }}
      >
        <SelectTrigger>
          <SelectValue
            className="text-foreground text-sm native:text-lg"
            placeholder="Select a period"
          />
        </SelectTrigger>
        <SelectContent insets={contentInsets} className="w-[250px]">
          <SelectGroup>
            <SelectItem label="Monthly" value="monthly">
              Monthly
            </SelectItem>
            <SelectItem label="Yearly" value="yearly">
              Yearly
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </View>
  )
}

// TYPES

interface PeriodTimeSelectFieldProps {
  value: PeriodTimeType
  onChange(period: PeriodTimeType): void
  label?: string
}
