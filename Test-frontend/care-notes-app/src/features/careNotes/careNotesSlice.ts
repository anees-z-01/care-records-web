import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import type { CareNotesState, Pagination } from "../../types"
import { loadNotesFromLocalDB, syncNotesFromAPI, syncStatsFromAPI, addNote } from "./careNotesThunks"
import type { DateRange } from '../../components/DateRangeSelector'

const initialState: CareNotesState = {
  notes: [],
  stats: null,
  loading: false,
  error: null,
  statsError: null,
  lastSync: null,
  selectedTenantId: 1,
  selectedFacilityIds: [],
  selectedDateRange: 'today',
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 20
  }
}

const careNotesSlice = createSlice({
  name: "careNotes",
  initialState,
  reducers: {
    setTenantId: (state, action) => {
      state.selectedTenantId = action.payload
      state.pagination.currentPage = 1
      state.selectedFacilityIds = []
      state.notes = []
      state.stats = null
      state.activeNotesRequestId = undefined
      state.activeStatsRequestId = undefined
    },
    setFacilityIds: (state, action) => {
      state.selectedFacilityIds = action.payload
      state.pagination.currentPage = 1
      state.notes = []
      state.stats = null
      state.activeNotesRequestId = undefined
      state.activeStatsRequestId = undefined
    },
    setPage: (state, action) => {
      state.pagination.currentPage = action.payload
    },
    clearError: (state) => {
      state.error = null
    },
    setStats: (state, action) => {
      state.stats = action.payload
    },
    setLastSync: (state, action) => {
      state.lastSync = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    setSelectedDateRange: (state, action: PayloadAction<DateRange>) => {
      state.selectedDateRange = action.payload
      state.stats = null
      state.activeStatsRequestId = undefined
    },
    setPagination: (state, action: PayloadAction<Pagination>) => {
      state.pagination = action.payload
    }
  },
  extraReducers: (builder) => {
    // Load notes from local DB
    builder.addCase(loadNotesFromLocalDB.pending, (state) => {
      state.loading = true
      state.error = null
    })
    builder.addCase(loadNotesFromLocalDB.fulfilled, (state, action) => {
      state.notes = action.payload.notes
      state.pagination = {
        currentPage: action.payload.pagination.page,
        totalPages: action.payload.pagination.total_pages,
        totalItems: action.payload.pagination.total,
        pageSize: action.payload.pagination.page_size
      }
      state.loading = false
    })
    builder.addCase(loadNotesFromLocalDB.rejected, (state, action) => {
      state.loading = false
      state.error = action.error.message || "Failed to load notes"
    })

    // Sync notes from API
    builder.addCase(syncNotesFromAPI.pending, (state, action) => {
      state.activeNotesRequestId = action.meta.requestId
      state.loading = true
      state.error = null
    })
    builder.addCase(syncNotesFromAPI.fulfilled, (state, action) => {
      if (state.activeNotesRequestId !== action.meta.requestId) return
      state.notes = action.payload.notes
      state.pagination = {
        currentPage: action.payload.pagination.page,
        totalPages: action.payload.pagination.total_pages,
        totalItems: action.payload.pagination.total,
        pageSize: action.payload.pagination.page_size
      }
      state.loading = false
      state.lastSync = new Date().toISOString()
    })
    builder.addCase(syncNotesFromAPI.rejected, (state, action) => {
      if (state.activeNotesRequestId !== action.meta.requestId) return
      state.loading = false
      state.error = action.error.message || "Failed to sync notes"
    })

    builder.addCase(syncStatsFromAPI.pending, (state, action) => {
      state.activeStatsRequestId = action.meta.requestId
      state.statsLoading = true
      state.statsError = null
    })
    builder.addCase(syncStatsFromAPI.fulfilled, (state, action) => {
      if (state.activeStatsRequestId !== action.meta.requestId) return
      state.stats = action.payload
      state.statsLoading = false
      state.lastSync = new Date().toISOString()
    })
    builder.addCase(syncStatsFromAPI.rejected, (state, action) => {
      if (state.activeStatsRequestId !== action.meta.requestId) return
      state.statsLoading = false
      state.statsError = "Could not load statistics for this selection"
    })

    // Add new note
    builder.addCase(addNote.fulfilled, (state, action) => {
      const note = action.payload
      const inScope =
        note.tenant_id === state.selectedTenantId &&
        (state.selectedFacilityIds.length === 0 || state.selectedFacilityIds.includes(note.facility_id))
      if (!inScope) return
      state.pagination.totalItems += 1
      if (state.pagination.currentPage === 1) {
        state.notes.unshift(note)
        state.notes.splice(state.pagination.pageSize)
      }
    })
  },
})

export const {
  setTenantId,
  setFacilityIds,
  setPage,
  clearError,
  setStats,
  setLastSync,
  setError,
  setSelectedDateRange,
  setPagination
} = careNotesSlice.actions
export default careNotesSlice.reducer
