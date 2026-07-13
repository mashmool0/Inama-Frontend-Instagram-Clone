export function formatRelativeTimeFa(input: string) {
  const date = new Date(input)
  const diff = date.getTime() - Date.now()
  const minute = 60_000
  const hour = 60 * minute
  const day = 24 * hour
  const rtf = new Intl.RelativeTimeFormat('fa', { numeric: 'auto' })

  if (Math.abs(diff) < hour) {
    return rtf.format(Math.round(diff / minute), 'minute')
  }
  if (Math.abs(diff) < day) {
    return rtf.format(Math.round(diff / hour), 'hour')
  }
  return rtf.format(Math.round(diff / day), 'day')
}

export function formatCompactFa(value: number) {
  return new Intl.NumberFormat('fa-IR', { notation: 'compact', maximumFractionDigits: 1 }).format(value)
}

export function decodeJwtSubject(token: string) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1] ?? ''))
    return payload.sub ?? payload.user_id ?? payload.uid ?? payload.id ?? null
  } catch {
    return null
  }
}
