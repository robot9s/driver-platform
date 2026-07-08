export function formatWhen(ms?: number, locale: string = 'en') {
  if (!ms) return '—'

  const d = new Date(ms)
  const today = new Date()

  const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const dayMs = 24 * 60 * 60 * 1000

  const diffDays = Math.floor((startOfDay(d).getTime() - startOfDay(today).getTime()) / dayMs)

  const timeFormatter = new Intl.DateTimeFormat(locale, {
    hour: '2-digit',
    minute: '2-digit',
  })

  if (diffDays === 0) {
    return `${new Intl.RelativeTimeFormat(locale, {numeric: 'auto'}).format(0, 'day')}, ${timeFormatter.format(d)}`
  }

  if (diffDays === -1) {
    return `${new Intl.RelativeTimeFormat(locale, {numeric: 'auto'}).format(-1, 'day')}, ${timeFormatter.format(d)}`
  }

  const dateTimeFormatter = new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return dateTimeFormatter.format(d)
}
