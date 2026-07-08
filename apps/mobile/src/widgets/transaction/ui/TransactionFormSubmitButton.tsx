import {toast} from '@backpackapp-io/react-native-toast'
import {useState} from 'react'
import {useWatch} from 'react-hook-form'
import {ActivityIndicator} from 'react-native'
import {useTranslation} from '@shared/i18n'
import {Text} from '@shared/ui/text'
import type {UseFinalFormReturn} from '@shared/ui-primitives/FinalFormKit'
import {SubmitButton} from '@shared/ui-primitives/FinalFormKit'
import type {
  CreateTransactionFormData,
  createTransactionFormSchema,
} from './CreateTransactionForm.schema'

export function TransactionFormSubmitButton({form, onSubmit}: TFormSubmitButtonProps) {
  const {t} = useTranslation('TransactionFormSubmitButton')
  const amount = useWatch({name: 'amount'})
  const [loading, setLoading] = useState(false)

  return (
    <SubmitButton
      onPress={() => {
        // It is better to use local state so that the lister is displayed instantly
        // since sometimes global state works with a delay
        setLoading(true)
        setTimeout(() => {
          form
            .handleSubmit(onSubmit, (errors) => {
              console.log('errors', errors)
              if (Object.keys(errors).length === 1 && errors.categoryId) {
                return
              }
              toast.error(`Some fields are invalid: ${Object.keys(errors)}`, {
                providerKey: 'MODAL::1',
              })
            })()
            .finally(() => setLoading(false))
        })
      }}
      disabled={form.formState.isLoading || !amount}
      className="flex-shrink-0 w-[68px]"
    >
      {loading ? <ActivityIndicator /> : <Text>{t('btnSave')}</Text>}
    </SubmitButton>
  )
}

// TYPES

type TFormSubmitButtonProps = {
  form: UseFinalFormReturn<typeof createTransactionFormSchema>
  onSubmit: (data: CreateTransactionFormData) => void
}
