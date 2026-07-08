import {useLocalSearchParams, useRouter} from 'expo-router'
import {useCallback, useEffect} from 'react'
import {ScrollView, Text, View} from 'react-native'
import type {CreateAccountFormData} from '@features/create-account'
import {CreateAccountFormFieldset, createAccountFormSchema} from '@features/create-account'
import {DeleteAccountButton} from '@features/delete-account'
import {useAccountOnce, useUpdateAccount} from '@entities/account'
import {useTranslation} from '@shared/i18n'
import {
  FinalForm,
  FinalFormButtons,
  FinalFormFields,
  FinalFormProvider,
  useFinalForm,
} from '@shared/ui-primitives/FinalFormKit'
import {ScreenContent} from '@shared/ui-primitives/ScreenContent'

export default function AccountOverviewScreen() {
  const {t} = useTranslation('AccountOverviewScreen')
  const router = useRouter()
  const {id: accountId} = useLocalSearchParams()
  const id = String(accountId)
  if (typeof id === 'undefined') {
    throw new Error('Impossible account id')
  }

  const updateAccount = useUpdateAccount()
  const account = useAccountOnce(id)

  const form = useFinalForm({
    schema: createAccountFormSchema,
    async onSubmit(changedAccount: CreateAccountFormData) {
      await updateAccount(id, {...changedAccount})
      router.back()
    },
  })

  const {formState, watch, reset} = form

  useEffect(() => {
    if (account) {
      reset(account)
    }
  }, [account])

  const renderHeaderRight = useCallback(() => {
    return <DeleteAccountButton id={id} />
  }, [formState, formState.isValid])

  if (!account) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-muted-foreground">{t('notFound.title')}</Text>
      </View>
    )
  }

  const [currencyId] = watch(['currencyId'])

  if (currencyId === null) {
    throw new Error('Impossible currency id on the account overview page')
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
          automaticallyAdjustKeyboardInsets
          keyboardShouldPersistTaps="handled"
        >
          <FinalForm>
            <FinalFormFields>
              <CreateAccountFormFieldset />
            </FinalFormFields>
            <FinalFormButtons submitText={t('btnSave')} />
          </FinalForm>
        </ScrollView>
      </ScreenContent>
    </FinalFormProvider>
  )
}
