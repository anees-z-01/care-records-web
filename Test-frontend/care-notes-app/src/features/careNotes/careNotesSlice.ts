import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { CareNotesState, DateRange, PaginatedNotes } from "../../types"
import { syncNotesFromAPI, syncStatsFromAPI, addNote } from "./careNotesThunks"
import { DEFAULT_PAGE_SIZE } from "../../api/careNotesAPI"
import { noteMatchesScope } from "./scope"

export const NOTES_ERROR = "Could not load care notes. Check that the API is reachable, then retry."
export const STATS_ERROR = "Could not load statistics for this selection"

export const initialState: CareNotesState = {
  notes: [],
  stats: null,
  loading: false,
  error: null,
  statsLoading: false,
  statsError: null,
  lastSync: null,
  selectedTenantId: 1,
  selectedFacilityIds: [],
  selectedDateRange: 'today',
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  },
}

// Any scope change makes in-flight responses stale; dropping the active
// request ids means their late results are ignored by the fulfilled cases.
function resetScopedData(state: CareNotesState) {
  state.pagination.currentPage = 1
  state.notes = []
  state.stats = null
  state.activeNotesRequestId = undefined
  state.activeStatsRequestId = undefined
}

function toPagination(page: PaginatedNotes['pagination']) {
  return {
    currentPage: page.page,
    totalPages: Math.max(1, page.total_pages),
    totalItems: page.total,
    pageSize: page.page_size,
  }
}

const careNotesSlice = createSlice({
  name: "careNotes",
  initialState,
  reducers: {
    setTenantId: (state, action: PayloadAction<number>) => {
      state.selectedTenantId = action.payload
      state.selectedFacilityIds = []
      resetScopedData(state)
    },
    setFacilityIds: (state, action: PayloadAction<number[]>) => {
      state.selectedFacilityIds = action.payload
      resetScopedData(state)
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload
    },
    setSelectedDateRange: (state, action: PayloadAction<DateRange>) => {
      state.selectedDateRange = action.payload
      state.stats = null
      state.activeStatsRequestId = undefined
    },
  },
  extraReducers: (builder) => {
    builder.addCase(syncNotesFromAPI.pending, (state, action) => {
      state.activeNotesRequestId = action.meta.requestId
      state.loading = true
      state.error = null
    })
    builder.addCase(syncNotesFromAPI.fulfilled, (state, action) => {
      if (state.activeNotesRequestId !== action.meta.requestId) return
      state.notes = action.payload.notes
      state.pagination = toPagination(action.payload.pagination)
      state.loading = false
      state.lastSync = new Date().toISOString()
    })
    builder.addCase(syncNotesFromAPI.rejected, (state, action) => {
      if (state.activeNotesRequestId !== action.meta.requestId) return
      state.loading = false
      state.error = NOTES_ERROR
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
    })
    builder.addCase(syncStatsFromAPI.rejected, (state, action) => {
      if (state.activeStatsRequestId !== action.meta.requestId) return
      state.statsLoading = false
      state.statsError = STATS_ERROR
    })

    builder.addCase(addNote.fulfilled, (state, action) => {
      const note = action.payload
      if (!noteMatchesScope(note, state.selectedTenantId, state.selectedFacilityIds)) return
      state.pagination.totalItems += 1
      if (state.pagination.currentPage === 1) {
        state.notes.unshift(note)
        state.notes.splice(state.pagination.pageSize)
      }
    })
  },
})

export const { setTenantId, setFacilityIds, setPage, setSelectedDateRange } = careNotesSlice.actions
export default careNotesSlice.reducer
