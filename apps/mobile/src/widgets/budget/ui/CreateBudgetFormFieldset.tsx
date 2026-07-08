import {Controller, useFormContext, useWatch} from 'react-hook-form'
import type {AccountID} from '@entities/account'
import {useAccountsOnce} from '@entities/account'
import {useCurrenciesOnce} from '@entities/currency'
import {useTranslation} from '@shared/i18n'
import {Button} from '@shared/ui/button'
import {Text} from '@shared/ui/text'
import {CategoryIconPicker} from '@shared/ui-primitives/CategoryIconPicker'
import {InputField} from '@shared/ui-primitives/FinalFormKit'
import {AccountPickerField} from '../../account-picker/ui/AccountPickerField'
import {CategoryPickerField} from '../../category-picker/ui/CategoryPickerField'
import type {CreateBudgetFormData} from './CreateBudgetForm.schema'

export const CreateBudgetFormFieldset = () => {
  const {t} = useTranslation('CreateBudgetFormFieldset')
  const {control} = useFormContext<CreateBudgetFormData>()

  const {data: accounts} = useAccountsOnce()
  const {data: currencies} = useCurrenciesOnce()
  const accountId = useWatch<Record<AccountID, string>>({name: 'accountId'})
  const currencyId =
    accounts.find((account) => account.id === accountId)?.currencyId ?? accounts[0]?.id
  const currency = currencies.find((currency) => currency.id === currencyId)

  return (
    <>
      <Controller
        control={control}
        name="icon"
        render={({field: {value, onChange}}) => (
          <CategoryIconPicker label={t('icon.label')} value={value} onChange={onChange} />
        )}
      />
      <InputField name="name" label={t('name.label')} placeholder={t('name.placeholder')} />
      <InputField
        name="amountLimit"
        label={t('amountLimit.label')}
        placeholder={t('amountLimit.placeholder')}
        keyboardType="numeric"
        className="!pl-[62px]"
        leftSection={
          <Button
            variant="ghost"
            className="!border-r !h-11 !py-0 !px-0 !w-16 rounded-r-none border-input"
          >
            <Text>{currency?.symbol ?? '-/-'}</Text>
          </Button>
        }
      />
      <Controller
        control={control}
        name="accountId"
        render={({field: {value, onChange}}) => (
          <AccountPickerField label={t('accountId.label')} value={value} onChange={onChange} />
        )}
      />
      <Controller
        control={control}
        name="categoryIds"
        render={({field: {value, onChange}}) => (
          <CategoryPickerField
            label={t('categoryIds.label')}
            multiple
            value={value}
            onChange={onChange}
          />
        )}
      />
    </>
  )
}
