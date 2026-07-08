import {IconAlignJustified, IconLock} from '@tabler/icons-react-native'
import {useRouter} from 'expo-router'
import {Controller} from 'react-hook-form'
import {Pressable, ScrollView, StyleSheet, View} from 'react-native'
import {useKeyboardHandler} from 'react-native-keyboard-controller'
import Animated, {useAnimatedStyle, useSharedValue} from 'react-native-reanimated'
import {useUserEntitlements} from '@entities/subscription'
import type {Transaction} from '@entities/transaction'
import {useTranslation} from '@shared/i18n'
import {DatePicker} from '@shared/ui-primitives/DatePicker'
import type {UseFinalFormReturn} from '@shared/ui-primitives/FinalFormKit'
import {FinalFormProvider, InputField} from '@shared/ui-primitives/FinalFormKit'
import {NumericPad} from '@shared/ui-primitives/NumericPad'
import {AccountPickerButton} from '../../account-picker/ui/AccountPickerButton'
import {CategoryPickerButton} from '../../category-picker/ui/CategoryPickerButton'
import {TransactionAmount} from './TransactionAmount'
import {TransactionFormSubmitButton} from './TransactionFormSubmitButton'
import {TransactionOptionsDropdown} from './TransactionOptionsDropdown'
import {TransactionRemoveButton} from './TransactionRemoveButton'
import type {
  CreateTransactionFormData,
  createTransactionFormSchema,
} from './CreateTransactionForm.schema'

export const TransactionForm = ({
  form,
  onSubmit,
  onDelete,
  type,
  showAccountSelect,
}: TransactionFormProps) => {
  const {t} = useTranslation('TransactionForm')
  const router = useRouter()
  const {isPro} = useUserEntitlements()
  const keyboardHeight = useSharedValue(0)

  useKeyboardHandler(
    {
      onMove: (event) => {
        'worklet'
        keyboardHeight.value = -Math.max(event.height, 0)
      },
    },
    []
  )

  const translateStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateY: -keyboardHeight.value}],
    }
  })

  return (
    <FinalFormProvider {...form}>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        automaticallyAdjustKeyboardInsets
        contentContainerClassName="flex-1 justify-between bg-background"
        bounces={false}
      >
        <View className="flex-row items-center justify-between p-4 mt-1">
          <View className="flex-row items-center gap-2">
            <Controller
              name="datetime"
              control={form.control}
              render={({field: {onChange, value}}) => (
                <DatePicker
                  value={value}
                  onChange={onChange}
                  minimumDate={new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)}
                  maximumDate={new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)}
                />
              )}
            />
          </View>
          <View className="flex-row items-center gap-4">
            {onDelete ? <TransactionRemoveButton onDelete={onDelete} /> : null}
            {!onDelete ? <TransactionOptionsDropdown /> : null}
          </View>
        </View>
        <View className="flex-1 items-center justify-center pb-12">
          <View className="mb-2 h-24 w-full justify-end">
            <TransactionAmount />
          </View>
          <View className="h-[36px]">
            <InputField
              name="description"
              placeholder={t('transactionNote')}
              autoCapitalize="none"
              className="line-clamp-1 min-w-32 max-w-[320px] truncate border border-muted-foreground/70 rounded-xl bg-transparent"
              placeholderClassName="!text-muted"
              wrapperClassName="h-[65px] -mb-14"
              leftSection={
                <View className="flex h-10 w-11 items-center justify-center">
                  {isPro ? (
                    <IconAlignJustified className="text-foreground size-6" />
                  ) : (
                    <IconLock className="text-muted-foreground size-6" />
                  )}
                </View>
              }
              numberOfLines={1}
              multiline={false}
              style={{height: 36}}
              editable={isPro}
            />
            {!isPro && (
              <Pressable
                style={StyleSheet.absoluteFill}
                onPress={() => router.push('/paywall?highlight=notes')}
              />
            )}
          </View>
        </View>
        <Animated.View style={translateStyle}>
          <View className="flex-row items-center justify-between gap-3 border-border border-t bg-background p-2 px-4">
            <View className="flex-1 flex-shrink flex-row items-center gap-2">
              <Controller
                control={form.control}
                name="accountId"
                render={({field: {value, onChange}}) => (
                  <AccountPickerButton
                    value={value}
                    onChange={onChange}
                    visible={showAccountSelect}
                  />
                )}
              />
              <Controller
                control={form.control}
                name="categoryId"
                render={({field: {value, onChange}}) => (
                  <CategoryPickerButton type={type} value={value} onChange={onChange} />
                )}
              />
            </View>
            <TransactionFormSubmitButton form={form} onSubmit={onSubmit} />
          </View>
          <Controller
            name="amount"
            control={form.control}
            render={({field: {onChange, value}}) => (
              <NumericPad value={String(value)} onValueChange={onChange} />
            )}
          />
        </Animated.View>
      </ScrollView>
    </FinalFormProvider>
  )
}

type TransactionFormProps = {
  onSubmit: (data: CreateTransactionFormData) => void
  onCancel?: () => void
  onDelete?: (onFinish: () => void) => void
  form: UseFinalFormReturn<typeof createTransactionFormSchema>
  type: Transaction['type']
  showAccountSelect: boolean
}
