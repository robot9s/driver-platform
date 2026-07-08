import {useLocalSearchParams, useRouter} from 'expo-router'
import {useCallback} from 'react'
import {ScrollView} from 'react-native'
import type {CreateBudgetFormData} from '@widgets/budget'
import {CreateBudgetFormFieldset, createBudgetFormSchema} from '@widgets/budget'
import {useBudgetOnce, useUpdateBudget} from '@entities/budget'
import {useUserEntitlements} from '@entities/subscription'
import {useTranslation} from '@shared/i18n'
import {
  FinalForm,
  FinalFormButtons,
  FinalFormFields,
  FinalFormProvider,
  useFinalForm,
} from '@shared/ui-primitives/FinalFormKit'
import {ScreenContent} from '@shared/ui-primitives/ScreenContent'
import {DeleteBudgetButton} from './DeleteBudgetButton'

export default function EditBudgetScreen() {
  const {t} = useTranslation('EditBudgetScreen')
  const router = useRouter()
  const {id: budgetId} = useLocalSearchParams<{id: string}>()
  const id = String(budgetId)
  if (typeof id === 'undefined') {
    throw new Error('Impossible account id')
  }

  const {isPro} = useUserEntitlements()
  const updateBudgetRecord = useUpdateBudget()
  const budget = useBudgetOnce(id)

  const form = useFinalForm({
    schema: createBudgetFormSchema,
    defaultValues: budget! && {
      ...budget,
      categoryIds: String(budget.categoryIds)
        .split(',')
        .map((item) => item.trim()),
    },
    async onSubmit(budget: CreateBudgetFormData) {
      if (!isPro) {
        return router.push('/paywall?highlight=budgets')
      }
      await updateBudgetRecord(id, {
        ...budget,
      })
      router.back()
    },
  })

  const {formState, handleSubmit} = form

  const renderHeaderRight = useCallback(() => {
    return <DeleteBudgetButton id={id} onComplete={() => router.push('/budgets')} />
  }, [formState, handleSubmit, formState.isValid])

  if (!budget) {
    return null
  }

  return (
    <FinalFormProvider {...form}>
      <ScreenContent
        excludeEdges={['top', 'bottom']}
        navigationOptions={{
          headerRight: renderHeaderRight,
        }}
      >
        <ScrollView
          className="flex-1 bg-background"
          contentContainerClassName="gap-4 p-6"
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets
        >
          <FinalForm>
            <FinalFormFields>
              <CreateBudgetFormFieldset />
            </FinalFormFields>
            <FinalFormButtons submitText={t('btnUpdate')} />
          </FinalForm>
        </ScrollView>
      </ScreenContent>
    </FinalFormProvider>
  )
}
