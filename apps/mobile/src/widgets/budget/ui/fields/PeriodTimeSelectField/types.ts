export const PeriodTime = {
  monthly: 'monthly',
  yearly: 'yearly',
} as const

export type PeriodTimeType = (typeof PeriodTime)[keyof typeof PeriodTime]
