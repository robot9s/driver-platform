import {Model} from '@nozbe/watermelondb'
import {field} from '@nozbe/watermelondb/decorators'
import type {TWalletIcon} from '@shared/config/icons'
import type {TDateISO} from '@shared/lib/dates'

export class AccountModel extends Model {
  static table = 'accounts'

  @field('title') title!: string
  @field('icon') icon!: TWalletIcon
  @field('currencyId') currencyId!: string
  @field('initialBalance') initialBalance?: number
  @field('createdAt') createdAt!: TDateISO
}
