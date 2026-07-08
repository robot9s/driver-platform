export const TimeRangeControlConst = {
  ByDay: 'BY_DAY',
  ByMonth: 'BY_MONTH',
  ByYear: 'BY_YEAR',
} as const

export type TTimeRangeControl = (typeof TimeRangeControlConst)[keyof typeof TimeRangeControlConst]
