import type { CareNote, CareNoteInput, CareStats, DateRange, PaginatedNotes } from "../types"

export const API_ORIGIN = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '')
export const API_BASE_URL = `${API_ORIGIN}/api`

export const DEFAULT_PAGE_SIZE = 20

async function readJson<T>(response: Response, failure: string): Promise<T> {
  if (!response.ok) {
    throw new Error(`${failure} (HTTP ${response.status})`)
  }
  return response.json() as Promise<T>
}

export const careNotesAPI = {
  async fetchStats(tenantId: number, facilityIds: number[], dateRange: DateRange): Promise<CareStats> {
    const params = new URLSearchParams({ tenant_id: String(tenantId), range: dateRange })
    if (facilityIds.length) params.set('facility_ids', facilityIds.join(','))
    return readJson(await fetch(`${API_BASE_URL}/care-stats?${params}`), 'Could not load statistics')
  },

  async fetchNotes(tenantId: number, facilityIds: number[], page = 1, pageSize = DEFAULT_PAGE_SIZE): Promise<PaginatedNotes> {
    const params = new URLSearchParams({
      tenant_id: String(tenantId),
      page: String(page),
      page_size: String(pageSize),
    })
    if (facilityIds.length) params.set('facility_ids', facilityIds.join(','))
    return readJson(await fetch(`${API_BASE_URL}/care-notes?${params}`), 'Could not load care notes')
  },

  async createNote(noteInput: CareNoteInput): Promise<CareNote> {
    const response = await fetch(`${API_BASE_URL}/care-notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(noteInput),
    })
    return readJson(response, 'Could not save the note')
  },
}
