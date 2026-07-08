import {Model} from '@nozbe/watermelondb'
import {field} from '@nozbe/watermelondb/decorators'
import type {TColor} from '@shared/config/colors'
import type {TCategoryIcon} from '@shared/config/icons'
import type {TDateISO} from '@shared/lib/dates'

export class CategoryModel extends Model {
  static table = 'categories'

  @field('title') title!: string
  @field('color') color!: TColor
  @field('icon') icon!: TCategoryIcon
  @field('parentId') parentId!: string | null
  @field('type') type!: 'expense' | 'income'
  @field('createdAt') createdAt!: TDateISO
}
