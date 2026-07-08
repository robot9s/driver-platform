import {useRouter} from 'expo-router'
import {useAccountsOnce} from '@entities/account'
import {useCreateBudget} from '@entities/budget'
import {useTranslation} from '@shared/i18n'
import {
  FinalForm,
  FinalFormButtons,
  FinalFormFields,
  FinalFormProvider,
  useFinalForm,
} from '@shared/ui-primitives/FinalFormKit'
import {createBudgetFormSchema} from './CreateBudgetForm.schema'
import {CreateBudgetFormFieldset} from './CreateBudgetFormFieldset'

export const CreateBudgetForm = () => {
  const {t} = useTranslation('CreateBudgetForm')
  const createBudgetRecord = useCreateBudget()
  const {data: accounts} = useAccountsOnce()
  const router = useRouter()

  const form = useFinalForm({
    schema: createBudgetFormSchema,
    defaultValues: {
      name: '',
      amountLimit: undefined,
      period: 'monthly',
      icon: 'IconUsers',
      color: 'gray',
      categoryIds: [],
      accountId: accounts[0]?.id,
    },
    async onSubmit(budget) {
      await createBudgetRecord({
        ...budget,
      })
      router.back()
    },
  })

  return (
    <FinalFormProvider {...form}>
      <FinalForm>
        <FinalFormFields>
          <CreateBudgetFormFieldset />
        </FinalFormFields>
        <FinalFormButtons submitText={t('btnConfirm')} />
      </FinalForm>
    </FinalFormProvider>
  )
}
