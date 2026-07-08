import {Model} from '@nozbe/watermelondb'
import {field} from '@nozbe/watermelondb/decorators'
import type {TDateISO} from '@shared/lib/dates'

export class TransactionModel extends Model {
  static table = 'transactions'

  @field('type') type!: 'expense' | 'income'
  @field('amount') amount!: number
  @field('categoryId') categoryId!: string
  @field('accountId') accountId!: string
  @field('datetime') datetime!: TDateISO
  @field('description') description?: string
  @field('createdAt') createdAt!: TDateISO
}
