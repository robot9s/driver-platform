import {Controller, useFormContext} from 'react-hook-form'
import {useTranslation} from '@shared/i18n'
import {CategoryIconPicker} from '@shared/ui-primitives/CategoryIconPicker'
import {ColorPicker} from '@shared/ui-primitives/ColorPicker'
import {InputField} from '@shared/ui-primitives/FinalFormKit'
import {CategoryTypeField} from './CategoryTypeField'
import type {CreateCategoryFormData} from './CreateCategoryForm.schema'

export const CreateCategoryFormFieldset = () => {
  const {t} = useTranslation('CreateCategoryFormFieldset')
  const {control, formState, watch} = useFormContext<CreateCategoryFormData>()
  const {isLoading} = formState
  const color = watch('color')

  return (
    <>
      <Controller
        control={control}
        name="icon"
        render={({field: {value, onChange}}) => (
          <CategoryIconPicker
            label={t('icon.label')}
            value={value}
            onChange={onChange}
            color={color}
          />
        )}
      />
      <Controller
        control={control}
        name="type"
        render={({field: {value, onChange}}) => (
          <CategoryTypeField label={t('type.label')} value={value} onChange={onChange} />
        )}
      />
      <InputField
        name="title"
        label={t('title.label')}
        placeholder={t('title.placeholder')}
        autoCapitalize="none"
        disabled={isLoading}
      />
      <Controller
        control={control}
        name="color"
        render={({field: {value, onChange}}) => (
          <ColorPicker label={t('color.label')} value={value} onChange={onChange} />
        )}
      />
    </>
  )
}
