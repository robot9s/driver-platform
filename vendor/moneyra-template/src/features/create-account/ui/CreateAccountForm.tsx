import {useRouter} from 'expo-router'
import {useCreateAccount} from '@entities/account'
import {useCurrenciesOnce} from '@entities/currency'
import {useTranslation} from '@shared/i18n'
import {
  FinalForm,
  FinalFormButtons,
  FinalFormFields,
  FinalFormProvider,
  useFinalForm,
} from '@shared/ui-primitives/FinalFormKit'
import {createAccountFormSchema} from './CreateAccountForm.schema'
import {CreateAccountFormFieldset} from './CreateAccountFormFieldset'

export const CreateAccountForm = () => {
  const {t} = useTranslation('CreateAccountForm')
  const router = useRouter()
  const createAccount = useCreateAccount()
  const {data: currencies} = useCurrenciesOnce()

  const form = useFinalForm({
    schema: createAccountFormSchema,
    defaultValues: {
      title: '',
      currencyId: currencies[0]?.id,
      icon: 'IconCash',
      initialBalance: undefined,
    },
    async onSubmit(account) {
      if (account.currencyId === null) {
        throw new Error('Impossible currencyId on account creation')
      }
      if (account.icon === null) {
        throw new Error('Impossible icon on account creation')
      }
      // Remap object because type guard
      await createAccount({
        ...account,
        currencyId: account.currencyId,
        icon: account.icon,
        initialBalance: Number(account.initialBalance ?? 0),
      })

      router.back()
    },
  })

  return (
    <FinalFormProvider {...form}>
      <FinalForm>
        <FinalFormFields>
          <CreateAccountFormFieldset autoFocus />
        </FinalFormFields>
        <FinalFormButtons submitText={t('btnCreate')} />
      </FinalForm>
    </FinalFormProvider>
  )
}
