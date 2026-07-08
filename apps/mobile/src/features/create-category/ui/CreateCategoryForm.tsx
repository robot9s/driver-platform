import {useRouter} from 'expo-router'
import type {ExpenseCategoryID} from '@entities/category'
import {useCreateExpenseCategory, useCreateIncomeCategory} from '@entities/category'
import {TransactionTypeConst} from '@entities/transaction'
import {useTranslation} from '@shared/i18n'
import {
  FinalForm,
  FinalFormButtons,
  FinalFormFields,
  FinalFormProvider,
  useFinalForm,
} from '@shared/ui-primitives/FinalFormKit'
import {createCategoryFormSchema} from './CreateCategoryForm.schema'
import {CreateCategoryFormFieldset} from './CreateCategoryFormFieldset'

export const CreateCategoryForm = ({parentId}: CreateExpenseCategoryFormProps) => {
  const {t} = useTranslation('CreateCategoryForm')
  const navigate = useRouter()
  const createExpenseCategory = useCreateExpenseCategory()
  const createIncomeCategory = useCreateIncomeCategory()

  const form = useFinalForm({
    schema: createCategoryFormSchema,
    defaultValues: {
      icon: 'IconSmartHome',
      type: 'expense',
      title: '',
    },
    async onSubmit(category) {
      if (category.type === TransactionTypeConst.expense) {
        await createExpenseCategory({...category, parentId})
      } else {
        await createIncomeCategory({...category, parentId})
      }
      navigate.back()
    },
  })

  return (
    <FinalFormProvider {...form}>
      <FinalForm>
        <FinalFormFields>
          <CreateCategoryFormFieldset />
        </FinalFormFields>
        <FinalFormButtons submitText={t('btnCreate')} />
      </FinalForm>
    </FinalFormProvider>
  )
}

// TYPES

interface CreateExpenseCategoryFormProps {
  parentId: ExpenseCategoryID | null
  className?: string
}
