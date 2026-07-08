import {Model} from '@nozbe/watermelondb'
import {field} from '@nozbe/watermelondb/decorators'
import type {TColor} from '@shared/config/colors'
import type {TDateISO} from '@shared/lib/dates'

export class CurrencyModel extends Model {
  static table = 'currencies'

  @field('currency') currency!: string
  @field('name') name!: string
  @field('symbol') symbol!: string
  @field('symbolPosition') symbolPosition!: 'left' | 'right'
  @field('color') color!: TColor
  @field('createdAt') createdAt!: TDateISO
}
