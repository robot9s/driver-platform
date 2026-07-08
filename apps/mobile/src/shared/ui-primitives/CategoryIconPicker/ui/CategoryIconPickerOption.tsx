import type {TCategoryIcon} from '@shared/config/icons'
import {cn} from '@shared/lib/utils'
import {Button} from '@shared/ui/button'
import {GenericIcon} from '@shared/ui-primitives/GenericIcon'

export function CategoryIconPickerOption({onChange, value, icon}: ColorPickerOptionProps) {
  const handleClick = (color: TCategoryIcon) => {
    if (color === value) {
      onChange(null)
    } else {
      onChange(color)
    }
  }

  return (
    <Button
      size="icon"
      className={cn('flex h-16 flex-1 flex-grow', value === icon && 'border border-primary')}
      variant={value === icon ? 'secondary' : 'outline'}
      onPress={() => handleClick(icon)}
    >
      <GenericIcon name={icon} className="size-8 text-primary" />
    </Button>
  )
}

// TYPES

interface ColorPickerOptionProps {
  onChange(color: TCategoryIcon | null): void
  value: TCategoryIcon
  icon: TCategoryIcon
  className?: string
}
