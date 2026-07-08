import {useLocalSearchParams, useRouter} from 'expo-router'
import {useCallback, useEffect} from 'react'
import {ScrollView, Text, View} from 'react-native'
import type {CreateCategoryFormData} from '@features/create-category'
import {CreateCategoryFormFieldset, createCategoryFormSchema} from '@features/create-category'
import {DeleteCategoryButton} from '@features/delete-category'
import {useCategoryOnce, useUpdateIncomeCategory} from '@entities/category'
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

export default function IncomeCategoryOverviewScreen() {
  const {t} = useTranslation('IncomeCategoryOverviewScreen')
  const router = useRouter()
  const {id: categoryId} = useLocalSearchParams()
  const id = String(categoryId)
  if (typeof id === 'undefined') {
    throw new Error('Impossible income category id')
  }

  const {isPro} = useUserEntitlements()
  const updateIncomeCategory = useUpdateIncomeCategory()
  const category = useCategoryOnce(id)

  const form = useFinalForm({
    schema: createCategoryFormSchema,
    async onSubmit(category: CreateCategoryFormData) {
      if (!isPro) {
        return router.push('/paywall?highlight=categories')
      }
      await updateIncomeCategory(id, {...category})
      router.back()
    },
  })
  const {reset, formState} = form

  useEffect(() => {
    if (category) {
      reset({...category, type: 'income'})
    }
  }, [id, category, reset])

  const beforeDelete = () => {
    reset({title: ''})
  }

  const renderHeaderRight = useCallback(() => {
    return <DeleteCategoryButton id={id} beforeDelete={beforeDelete} />
  }, [formState, formState.isValid])

  if (!category) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-muted-foreground">{t('notFound')}</Text>
      </View>
    )
  }

  return (
    <FinalFormProvider {...form}>
      <ScreenContent
        excludeEdges={['top', 'bottom']}
        navigationOptions={{
          headerRight: renderHeaderRight,
        }}
      >
        <ScrollView className="bg-background px-6 py-3" keyboardShouldPersistTaps="handled">
          <FinalForm>
            <FinalFormFields>
              <CreateCategoryFormFieldset />
            </FinalFormFields>
            <FinalFormButtons submitText={t('btnSave')} />
          </FinalForm>
        </ScrollView>
      </ScreenContent>
    </FinalFormProvider>
  )
}
