import { describe, expect, it } from 'vitest'
import { formatDateTime, parseApiDate } from '../src/utils/formatDate'

describe('date formatting', () => {
  it('reads naive API timestamps as UTC', () => {
    expect(parseApiDate('2026-06-15T14:30:00').toISOString()).toBe('2026-06-15T14:30:00.000Z')
  })

  it('keeps an explicit offset', () => {
    expect(parseApiDate('2026-06-15T14:30:00+02:00').toISOString()).toBe('2026-06-15T12:30:00.000Z')
  })

  it('returns the raw value when it is not a date', () => {
    expect(formatDateTime('not-a-date')).toBe('not-a-date')
  })
})
