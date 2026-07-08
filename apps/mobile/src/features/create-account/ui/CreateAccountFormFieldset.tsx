import {useRef} from 'react'
import {Controller, useFormContext} from 'react-hook-form'
import {CurrencyPicker} from '@entities/currency'
import {useTranslation} from '@shared/i18n'
import {InputField} from '@shared/ui-primitives/FinalFormKit'
import {WalletIconPicker} from '@shared/ui-primitives/WalletIconPicker'
import type {CreateAccountFormData} from './CreateAccountForm.schema'
import type {TextInput} from 'react-native'

export const CreateAccountFormFieldset = ({autoFocus}: CreateAccountFormFieldsetProps) => {
  const {t} = useTranslation('CreateAccountFormFieldset')
  const nameInputRef = useRef<TextInput>(null)
  const balanceInputRef = useRef<TextInput>(null)
  const {control} = useFormContext<CreateAccountFormData>()

  return (
    <>
      <Controller
        control={control}
        name="icon"
        render={({field: {value, onChange}}) => (
          <WalletIconPicker
            value={value}
            onChange={(icon) => {
              onChange(icon)
              nameInputRef.current?.focus()
            }}
          />
        )}
      />
      <InputField
        ref={nameInputRef}
        name="title"
        label={t('title.label')}
        placeholder={t('title.placeholder')}
        autoFocus={autoFocus}
        onSubmitEditing={() => {
          balanceInputRef.current?.focus()
        }}
      />
      <InputField
        ref={balanceInputRef}
        name="initialBalance"
        label={t('initialBalance.label')}
        placeholder={t('initialBalance.placeholder')}
        className="!pl-[62px]"
        keyboardType="numeric"
        leftSection={
          <Controller
            name="currencyId"
            control={control}
            render={({field: {onChange, value}}) => (
              <CurrencyPicker
                value={value}
                onChange={(currency) => {
                  onChange(currency)
                  balanceInputRef.current?.focus()
                }}
              />
            )}
          />
        }
      />
    </>
  )
}

interface CreateAccountFormFieldsetProps {
  autoFocus?: boolean
  className?: string
}
