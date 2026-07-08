import {View} from 'react-native'
import type {TransactionType} from '@entities/transaction'
import {useTranslation} from '@shared/i18n'
import {Label} from '@shared/ui/label'
import {Text} from '@shared/ui/text'
import {ToggleGroup, ToggleGroupItem} from '@shared/ui/toggle-group'

export function CategoryTypeField({value, onChange, label}: CategoryTypeFieldProps) {
  const {t} = useTranslation('CategoryTypeField')

  return (
    <View className="gap-3">
      <Label nativeID={`label-${label}`}>{label}</Label>
      <ToggleGroup
        value={value}
        onValueChange={(value) => onChange(value as TransactionType)}
        type="single"
        className="gap-3"
      >
        <ToggleGroupItem value="expense" className="flex-1 border border-input">
          <Text>{t('expense')}</Text>
        </ToggleGroupItem>
        <ToggleGroupItem value="income" className="flex-1 border border-input">
          <Text>{t('income')}</Text>
        </ToggleGroupItem>
      </ToggleGroup>
    </View>
  )
}

interface CategoryTypeFieldProps {
  value: TransactionType
  onChange(value?: TransactionType): void
  label?: string
}
