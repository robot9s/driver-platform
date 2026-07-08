import {useTranslation} from '@shared/i18n'
import {InputField} from '@shared/ui-primitives/FinalFormKit'

export const CurrenciesSearchBar = ({value, onChange}: CurrenciesSearchBarProps) => {
  const {t} = useTranslation('CurrenciesSearchBar')

  return (
    <InputField
      name="currency"
      value={value}
      onChange={(value) => onChange(value.nativeEvent.text)}
      placeholder={t('placeholder')}
      className="mb-2"
    />
  )
}

// TYPES

interface CurrenciesSearchBarProps {
  value: string
  onChange: (value: string) => void
}
