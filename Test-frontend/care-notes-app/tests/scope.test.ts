import { describe, expect, it } from 'vitest'
import { describeScope, facilitiesForTenant, noteMatchesScope, TENANT_IDS } from '../src/features/careNotes/scope'

describe('tenant and facility scope', () => {
  it('lists the ten seeded demo tenants', () => {
    expect(TENANT_IDS).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
  })

  it('derives five facilities per tenant', () => {
    expect(facilitiesForTenant(1)).toEqual([11, 12, 13, 14, 15])
    expect(facilitiesForTenant(10)).toEqual([101, 102, 103, 104, 105])
  })

  it('matches notes on tenant and, when chosen, facility', () => {
    const note = { tenant_id: 2, facility_id: 23 }
    expect(noteMatchesScope(note, 2, [])).toBe(true)
    expect(noteMatchesScope(note, 2, [21, 23])).toBe(true)
    expect(noteMatchesScope(note, 2, [21])).toBe(false)
    expect(noteMatchesScope(note, 3, [])).toBe(false)
  })

  it('describes the scope in sorted, readable form', () => {
    expect(describeScope(1, [])).toBe('Tenant 1, all facilities')
    expect(describeScope(1, [13])).toBe('Tenant 1, facility 13')
    expect(describeScope(1, [14, 11])).toBe('Tenant 1, facilities 11, 14')
  })
})
