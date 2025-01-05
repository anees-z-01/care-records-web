export type NoteCategory = 'medication' | 'observation' | 'treatment'
export type NotePriority = 1 | 2 | 3 | 4 | 5
export type DateRange = 'today' | 'this_week' | 'this_month' | 'this_year' | 'all_time'

export interface CareNote {
  id: number
  tenant_id: number
  facility_id: number
  patient_id: string
  category: NoteCategory
  priority: NotePriority
  created_at: string
  created_by: string
  note_content: string
}

export type CareNoteInput = Omit<CareNote, 'id' | 'created_at'>

export interface CareStats {
  total_notes: number
  by_category: Record<string, number>
  by_priority: Record<number, number>
  by_facility: Record<number, number>
  avg_notes_per_patient: number
  date_range: {
    start: string | null
    end: string | null
  }
}

export interface Pagination {
  currentPage: number
  totalPages: number
  totalItems: number
  pageSize: number
}

export interface PaginatedNotes {
  notes: CareNote[]
  pagination: {
    total: number
    page: number
    page_size: number
    total_pages: number
  }
}

export interface CareNotesState {
  notes: CareNote[]
  stats: CareStats | null
  loading: boolean
  error: string | null
  statsLoading: boolean
  statsError: string | null
  lastSync: string | null
  selectedTenantId: number
  selectedFacilityIds: number[]
  selectedDateRange: DateRange
  activeNotesRequestId?: string
  activeStatsRequestId?: string
  pagination: Pagination
}
