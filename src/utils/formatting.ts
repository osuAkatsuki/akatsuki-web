// TODO: proper localiztion
const REGULAR_NUMBER_FORMATTER = new Intl.NumberFormat("en-us")
const DECIMAL_NUMBER_FORMATTER = new Intl.NumberFormat("en-us", {
  // Always format to 2 decimal places
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})

export const formatNumber = (n: number): string =>
  REGULAR_NUMBER_FORMATTER.format(n)
export const formatDecimal = (n: number): string =>
  DECIMAL_NUMBER_FORMATTER.format(n)

export const formatDate = (date: Date): string => date.toLocaleString("en-US")

enum TimeUnits {
  Seconds = 1,
  Minutes = 60 * Seconds,
  Hours = 60 * Minutes,
  Days = 24 * Hours,
  Years = 365 * Days,
  Centuries = 100 * Years,
}

export const formatTimespan = (seconds: number, precision: number): string => {
  const centuries = Math.floor(seconds / TimeUnits.Centuries)
  seconds %= TimeUnits.Centuries
  const years = Math.floor(seconds / TimeUnits.Years)
  seconds %= TimeUnits.Years
  const days = Math.floor(seconds / TimeUnits.Days)
  seconds %= TimeUnits.Days
  const hours = Math.floor(seconds / TimeUnits.Hours)
  seconds %= TimeUnits.Hours
  const minutes = Math.floor(seconds / TimeUnits.Minutes)
  seconds %= TimeUnits.Minutes
  seconds = Math.floor(seconds)

  const parts = []
  if (centuries > 0) parts.push(`${centuries}c`)
  if (years > 0) parts.push(`${years}y`)
  if (days > 0) parts.push(`${days}d`)
  if (hours > 0) parts.push(`${hours}h`)
  if (minutes > 0) parts.push(`${minutes}m`)
  if (seconds > 0) parts.push(`${seconds}s`)

  return parts.slice(0, precision).join(" ")
}

export const formatNumberCompact = (n: number): string => {
  if (n < 1e3) return n.toString()
  if (n < 1e6) return `${(n / 1e3).toFixed(1)}k`
  if (n < 1e9) return `${(n / 1e6).toFixed(1)}m`
  return `${(n / 1e9).toFixed(1)}b`
}
