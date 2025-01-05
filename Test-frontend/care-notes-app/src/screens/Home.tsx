"use client"

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../app/store'
import { TenantSelector } from '../components/TenantSelector'
import { DateRangeSelector } from '../components/DateRangeSelector'
import { StatsDisplay } from '../components/StatsDisplay'
import { NotesList } from '../components/NotesList'
import { syncNotesFromAPI, syncStatsFromAPI } from '../features/careNotes/careNotesThunks'
import { setPage, setSelectedDateRange } from '../features/careNotes/careNotesSlice'

const NOTES_POLL_MS = 60_000

export const Home = () => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    notes, stats, loading, statsLoading, error, statsError,
    selectedTenantId, selectedFacilityIds, selectedDateRange, pagination,
  } = useSelector((root: RootState) => root.careNotes)

  useEffect(() => {
    dispatch(syncNotesFromAPI(pagination.currentPage))
    const timer = setInterval(() => dispatch(syncNotesFromAPI(pagination.currentPage)), NOTES_POLL_MS)
    return () => clearInterval(timer)
  }, [dispatch, pagination.currentPage, selectedTenantId, selectedFacilityIds])

  useEffect(() => {
    dispatch(syncStatsFromAPI())
  }, [dispatch, selectedTenantId, selectedFacilityIds, selectedDateRange])

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-semibold uppercase tracking-widest text-teal-700">Synthetic-data prototype</p>
        <h1 className="mt-2 text-3xl font-semibold text-slate-900">Care notes, at a glance.</h1>
        <p className="mt-3 text-sm text-slate-600">Browse example records by tenant and facility. This demo has no authentication; do not enter real patient details.</p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        <TenantSelector />
        <DateRangeSelector selectedRange={selectedDateRange} onRangeChange={range => dispatch(setSelectedDateRange(range))} />
      </div>
      <section className="rounded-xl border bg-white p-5">
        <h2 className="mb-4 text-lg font-semibold">Selected statistics range</h2>
        <StatsDisplay stats={stats} loading={Boolean(statsLoading)} error={statsError} />
        <p className="mt-4 text-xs text-slate-500">The date range changes statistics; the note list remains paginated across all dates.</p>
      </section>
      <section className="rounded-xl border bg-white p-5">
        <h2 className="mb-4 text-lg font-semibold">Care notes</h2>
        {error && (
          <div role="alert" className="mb-4 rounded border border-red-200 bg-red-50 p-4 text-sm text-red-800">
            {error}
            <button className="ml-3 underline" onClick={() => dispatch(syncNotesFromAPI(pagination.currentPage))}>Retry</button>
          </div>
        )}
        <NotesList notes={notes} loading={loading} pagination={pagination} onPageChange={page => dispatch(setPage(page))} />
      </section>
    </div>
  )
}
