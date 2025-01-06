import { describe, expect, it } from 'vitest'
import reducer, { initialState, setFacilityIds, setPage, setSelectedDateRange, setTenantId, STATS_ERROR } from '../src/features/careNotes/careNotesSlice'
import { addNote, syncNotesFromAPI, syncStatsFromAPI } from '../src/features/careNotes/careNotesThunks'
import type { CareNotesState } from '../src/types'
import { makeNote, makeNoteInput, makePage, sampleStats } from './fixtures'

const init = (): CareNotesState => reducer(undefined, { type: 'init' })
const noteInput = makeNoteInput()

describe('careNotes reducer', () => {
  it('starts on tenant 1, page 1, with every facility selected', () => {
    expect(init()).toEqual(initialState)
  })

  it('maps API pagination to the client shape and never reports zero pages', () => {
    let state = reducer(init(), syncNotesFromAPI.pending('r1', 1))
    state = reducer(state, syncNotesFromAPI.fulfilled({ notes: [], pagination: { total: 0, page: 1, page_size: 20, total_pages: 0 } }, 'r1', 1))
    expect(state.pagination).toEqual({ currentPage: 1, totalPages: 1, totalItems: 0, pageSize: 20 })
    expect(state.loading).toBe(false)
    expect(state.lastSync).not.toBeNull()
  })

  it('tenant change clears notes, stats, facility scope and page', () => {
    let state = reducer(init(), setPage(2))
    state = reducer(state, syncNotesFromAPI.pending('old', 2))
    state = reducer(state, syncNotesFromAPI.fulfilled(makePage([makeNote()], 2, 3), 'old', 2))
    state = reducer(state, setFacilityIds([11]))
    state = reducer(state, setTenantId(2))
    expect(state.selectedTenantId).toBe(2)
    expect(state.pagination.currentPage).toBe(1)
    expect(state.selectedFacilityIds).toEqual([])
    expect(state.notes).toEqual([])
    expect(state.stats).toBeNull()

    state = reducer(state, syncNotesFromAPI.fulfilled(makePage([makeNote({ id: 99 })], 2, 3), 'old', 2))
    expect(state.notes).toEqual([])
  })

  it('ignores an out-of-order note response from an older request', () => {
    let state = reducer(init(), syncNotesFromAPI.pending('first', 1))
    state = reducer(state, syncNotesFromAPI.pending('second', 2))
    state = reducer(state, syncNotesFromAPI.fulfilled(makePage([makeNote({ id: 2 })], 2, 3), 'second', 2))
    state = reducer(state, syncNotesFromAPI.fulfilled(makePage([makeNote({ id: 1 })], 1, 3), 'first', 1))
    expect(state.notes.map(note => note.id)).toEqual([2])
    expect(state.pagination.currentPage).toBe(2)
  })

  it('ignores a failure from a request that is no longer current', () => {
    let state = reducer(init(), syncNotesFromAPI.pending('first', 1))
    state = reducer(state, syncNotesFromAPI.pending('second', 1))
    state = reducer(state, syncNotesFromAPI.rejected(new Error('late'), 'first', 1))
    expect(state.error).toBeNull()
    expect(state.loading).toBe(true)
  })

  it('a facility change invalidates late statistics', () => {
    let state = reducer(init(), syncStatsFromAPI.pending('old'))
    state = reducer(state, setFacilityIds([12]))
    state = reducer(state, syncStatsFromAPI.fulfilled({ ...sampleStats, total_notes: 99 }, 'old'))
    expect(state.stats).toBeNull()
    state = reducer(state, syncStatsFromAPI.pending('new'))
    state = reducer(state, syncStatsFromAPI.fulfilled(sampleStats, 'new'))
    expect(state.stats?.total_notes).toBe(42)
    expect(state.statsLoading).toBe(false)
  })

  it('a date range change drops stats but keeps the note list', () => {
    let state = reducer(init(), syncNotesFromAPI.pending('n', 1))
    state = reducer(state, syncNotesFromAPI.fulfilled(makePage([makeNote()]), 'n', 1))
    state = reducer(state, syncStatsFromAPI.pending('s'))
    state = reducer(state, syncStatsFromAPI.fulfilled(sampleStats, 's'))
    state = reducer(state, setSelectedDateRange('this_month'))
    expect(state.selectedDateRange).toBe('this_month')
    expect(state.stats).toBeNull()
    expect(state.notes).toHaveLength(1)
  })

  it('reports statistics failures separately from note failures', () => {
    let state = reducer(init(), syncStatsFromAPI.pending('s1'))
    state = reducer(state, syncStatsFromAPI.rejected(new Error('down'), 's1'))
    expect(state.error).toBeNull()
    expect(state.statsError).toBe(STATS_ERROR)
    state = reducer(state, syncStatsFromAPI.pending('s2'))
    expect(state.statsError).toBeNull()
  })

  it('adds a saved note only when it belongs to the selected scope', () => {
    let state = reducer(init(), setFacilityIds([11]))
    state = reducer(state, addNote.fulfilled(makeNote({ id: 5, facility_id: 12 }), 'a1', noteInput))
    expect(state.notes).toHaveLength(0)
    state = reducer(state, addNote.fulfilled(makeNote({ id: 6, facility_id: 11 }), 'a2', noteInput))
    expect(state.notes.map(note => note.id)).toEqual([6])
    expect(state.pagination.totalItems).toBe(1)
  })

  it('keeps page 1 at its page size when a note is added', () => {
    const notes = Array.from({ length: 20 }, (_, index) => makeNote({ id: index + 1 }))
    let state = reducer(init(), syncNotesFromAPI.pending('n', 1))
    state = reducer(state, syncNotesFromAPI.fulfilled(makePage(notes), 'n', 1))
    state = reducer(state, addNote.fulfilled(makeNote({ id: 100 }), 'a', noteInput))
    expect(state.notes).toHaveLength(20)
    expect(state.notes[0].id).toBe(100)
  })
})
