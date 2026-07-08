import type {TDateISO} from '@shared/lib/dates'

export enum TransactionsView {
  Default = 'Default',
  All = 'ALL',
  ByDay = 'BY_DAY',
  ByMonth = 'BY_MONTH',
  ByYear = 'BY_YEAR',
}

export type TimeRange = {
  from?: TDateISO
  to?: TDateISO
}
