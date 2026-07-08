import {Model} from '@nozbe/watermelondb'
import {field} from '@nozbe/watermelondb/decorators'
import type {TColor} from '@shared/config/colors'
import type {TCategoryIcon} from '@shared/config/icons'
import type {TDateISO} from '@shared/lib/dates'

export class BudgetModel extends Model {
  static table = 'budgets'

  @field('name') name!: string
  @field('period') period!: 'monthly' | 'yearly'
  @field('amountLimit') amountLimit!: number
  @field('icon') icon!: TCategoryIcon
  @field('color') color!: TColor
  @field('categoryIds') categoryIds!: string
  @field('accountId') accountId!: string
  @field('createdAt') createdAt!: TDateISO
}
