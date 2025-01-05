import type { CareNote } from "../../types"

// Demo directory: the API seeds tenants 1-10, each with facilities
// tenant*10+1 .. tenant*10+5. This is not an authorised facility list.
export const TENANT_IDS = Array.from({ length: 10 }, (_, index) => index + 1)
export const FACILITIES_PER_TENANT = 5

export function facilitiesForTenant(tenantId: number): number[] {
  return Array.from({ length: FACILITIES_PER_TENANT }, (_, index) => tenantId * 10 + index + 1)
}

export function noteMatchesScope(
  note: Pick<CareNote, 'tenant_id' | 'facility_id'>,
  tenantId: number,
  facilityIds: number[],
): boolean {
  if (note.tenant_id !== tenantId) return false
  return facilityIds.length === 0 || facilityIds.includes(note.facility_id)
}

export function describeScope(tenantId: number, facilityIds: number[]): string {
  if (facilityIds.length === 0) return `Tenant ${tenantId}, all facilities`
  const sorted = [...facilityIds].sort((a, b) => a - b)
  const label = sorted.length === 1 ? 'facility' : 'facilities'
  return `Tenant ${tenantId}, ${label} ${sorted.join(', ')}`
}
