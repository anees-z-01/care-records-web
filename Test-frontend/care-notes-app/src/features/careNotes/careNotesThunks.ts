import { createAsyncThunk } from "@reduxjs/toolkit"
import { careNotesAPI } from "../../api/careNotesAPI"
import type { CareNoteInput, CareNotesState } from "../../types"

type ThunkState = { careNotes: CareNotesState }

export const syncStatsFromAPI = createAsyncThunk<Awaited<ReturnType<typeof careNotesAPI.fetchStats>>, void, { state: ThunkState }>(
  "careNotes/syncStatsFromAPI",
  async (_, { getState }) => {
    const { selectedTenantId, selectedFacilityIds, selectedDateRange } = getState().careNotes
    return careNotesAPI.fetchStats(selectedTenantId, selectedFacilityIds, selectedDateRange)
  }
)

export const syncNotesFromAPI = createAsyncThunk<Awaited<ReturnType<typeof careNotesAPI.fetchNotes>>, number | undefined, { state: ThunkState }>(
  "careNotes/syncFromAPI",
  async (page = 1, { getState }) => {
    const { selectedTenantId, selectedFacilityIds, pagination } = getState().careNotes
    return careNotesAPI.fetchNotes(selectedTenantId, selectedFacilityIds, page, pagination.pageSize)
  }
)

export const addNote = createAsyncThunk(
  "careNotes/addNote",
  async (note: CareNoteInput) => careNotesAPI.createNote(note)
)
