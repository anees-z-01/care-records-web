import { createAsyncThunk } from "@reduxjs/toolkit"
import { careNotesAPI, API_BASE_URL } from "../../api/careNotesAPI"
import type { CareNoteInput, CareNote, RootState } from "../../types"
import { setError } from "./careNotesSlice"



interface PaginatedResponse {
  notes: CareNote[]
  pagination: {
    total: number
    page: number
    page_size: number
    total_pages: number
  }
}

export const syncStatsFromAPI = createAsyncThunk(
  "careNotes/syncStatsFromAPI",
  async (_, { dispatch, getState }) => {
    try {
      const state = getState() as RootState
      const { selectedTenantId, selectedFacilityIds, selectedDateRange } = state.careNotes

      const stats = await careNotesAPI.fetchStats(
        selectedTenantId,
        selectedFacilityIds.length > 0 ? selectedFacilityIds : undefined,
        selectedDateRange
      )

      return stats
    } catch (error) {
      console.error('Error syncing stats:', error)
      throw error
    }
  }
)

export const syncNotesFromAPI = createAsyncThunk(
  "careNotes/syncFromAPI",
  async (page: number = 1, { getState }) => {
    try {
      const state = getState() as RootState
      const { selectedTenantId, selectedFacilityIds } = state.careNotes

      const data = await careNotesAPI.fetchNotes(
        selectedTenantId,
        selectedFacilityIds.length > 0 ? selectedFacilityIds : undefined,
        page
      )
      return data
    } catch (error) {
      throw new Error('Failed to sync notes')
    }
  }
)

export const loadNotesFromLocalDB = createAsyncThunk(
  "careNotes/loadFromLocalDB",
  async (page: number = 1, { getState }) => {
    try {
      const state = getState() as RootState
      const { selectedTenantId, selectedFacilityIds } = state.careNotes

      const data = await careNotesAPI.fetchNotes(
        selectedTenantId,
        selectedFacilityIds.length > 0 ? selectedFacilityIds : undefined,
        page
      )
      return data
    } catch (error) {
      throw new Error('Failed to load notes')
    }
  }
)

export const createCareNote = createAsyncThunk(
  "careNotes/create",
  async (noteInput: CareNoteInput, { dispatch }) => {
    try {
      const response = await careNotesAPI.createNote(noteInput)
      return response
    } catch (error) {
      dispatch(setError("Failed to create note"))
      throw error
    }
  }
)

export const runPerformanceTest = createAsyncThunk(
  "careNotes/performanceTest",
  async (_, { dispatch }) => {
    try {
      const result = await careNotesAPI.runPerformanceTest()
      return result
    } catch (error) {
      dispatch(setError("Failed to run performance test"))
      throw error
    }
  }
)

export const addNote = createAsyncThunk(
  "careNotes/addNote",
  async (note: Partial<CareNote>) => {
    const response = await fetch(`${API_BASE_URL}/care-notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(note),
    })

    if (!response.ok) {
      throw new Error('Failed to add note')
    }

    return response.json()
  }
)
