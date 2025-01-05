export interface CareNote {
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

export interface CareNoteInput {
  tenant_id: number
  facility_id: number
  patient_id: string
  category: 'medication' | 'observation' | 'treatment'
  priority: 1 | 2 | 3 | 4 | 5
  created_by: string
  note_content: string
}

// Add new types for the backend API
export interface CareStats {
  total_notes: number
  by_category: Record<string, number>
  by_priority: Record<number, number>
  by_facility: Record<number, number>
  avg_notes_per_patient: number
  date_range: {
    start: string
    end: string
  }
}

export interface CareNotesState {
  notes: CareNote[]
  stats: CareStats | null
  loading: boolean
  error: string | null
  lastSync: string | null
  selectedTenantId: number
  selectedDateRange: import("../components/DateRangeSelector").DateRange
  activeNotesRequestId?: string
  activeStatsRequestId?: string
  statsLoading?: boolean
  selectedFacilityIds: number[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    pageSize: number
  }
}

export interface RootState {
  careNotes: CareNotesState
}

export interface Pagination { currentPage: number; totalPages: number; totalItems: number; pageSize: number }
