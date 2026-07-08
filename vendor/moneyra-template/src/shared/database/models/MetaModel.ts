import {Model} from '@nozbe/watermelondb'
import {field} from '@nozbe/watermelondb/decorators'

export class MetaModel extends Model {
  static table = 'meta'

  @field('key') key!: string
  @field('value') value!: string
}
