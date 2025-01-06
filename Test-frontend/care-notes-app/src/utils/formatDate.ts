const DATE_TIME_FORMAT: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
  hour: "2-digit",
  minute: "2-digit",
}

// The API returns naive UTC timestamps (no offset); treat them as UTC
// rather than letting the browser read them as local time.
export function parseApiDate(value: string): Date {
  const hasZone = /([zZ]|[+-]\d{2}:?\d{2})$/.test(value)
  return new Date(hasZone ? value : `${value}Z`)
}

export function formatDateTime(value: string, locale = "en-GB"): string {
  const date = parseApiDate(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString(locale, DATE_TIME_FORMAT)
}

export function formatTime(value: string, locale = "en-GB"): string {
  return parseApiDate(value).toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" })
}
