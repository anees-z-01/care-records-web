import type { CareNote, CareNoteInput, CareStats } from "../types"
import type { DateRange } from '../components/DateRangeSelector'

export const API_ORIGIN = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000').replace(/\/$/, '')
export const API_BASE_URL = `${API_ORIGIN}/api`

export interface CareNoteDTO {
  id: number
  tenant_id: number
  facility_id: number
  patient_id: string
  category: 'medication' | 'observation' | 'treatment'
  priority: 1 | 2 | 3 | 4 | 5
  created_at: string
  created_by: string
  note_content: string
}

class CareNotesAPI {
  private baseURL = API_ORIGIN

  async fetchStats(tenantId: number, facilityIds?: number[], dateRange: DateRange = 'today'): Promise<CareStats> {
    const params = new URLSearchParams({
      tenant_id: tenantId.toString(),
      range: dateRange,
    })

    if (facilityIds?.length) {
      params.append('facility_ids', facilityIds.join(','))
    }

    const url = `${this.baseURL}/api/care-stats?${params}`
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`Failed to fetch stats: ${response.statusText}`)
    }

    const stats = await response.json()
    return stats
  }

  async fetchNotes(tenantId?: number, facilityIds?: number[], page: number = 1, pageSize: number = 20): Promise<PaginatedResponse> {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        page_size: pageSize.toString()
      })

      if (tenantId) {
        params.append('tenant_id', tenantId.toString())
      }

      if (facilityIds?.length) {
        params.append('facility_ids', facilityIds.join(','))
      }

      const response = await fetch(`${API_BASE_URL}/care-notes?${params}`)
      if (!response.ok) {
        throw new Error('Failed to fetch notes')
      }
      return response.json()
    } catch (error) {
      console.error("Error fetching notes from API:", error)
      throw new Error("Failed to fetch notes from server")
    }
  }

  async createNote(noteInput: CareNoteInput): Promise<CareNote> {
    try {
      const response = await fetch(`${API_BASE_URL}/care-notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(noteInput),
      })

      if (!response.ok) {
        throw new Error('Failed to create note')
      }

      return response.json()
    } catch (error) {
      console.error("Error creating note via API:", error)
      throw new Error("Failed to create note")
    }
  }

  async runPerformanceTest(): Promise<{ message: string }> {
    try {
      const response = await fetch(`${API_BASE_URL}/run-performance-test`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (error) {
      console.error("Error running performance test:", error)
      throw new Error("Failed to run performance test")
    }
  }
}

interface PaginatedResponse {
  notes: CareNote[]
  pagination: {
    total: number
    page: number
    page_size: number
    total_pages: number
  }
}

export const careNotesAPI = new CareNotesAPI()
