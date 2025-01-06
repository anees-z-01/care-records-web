"use client"

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../app/store'
import { TenantSelector } from '../components/TenantSelector'
import { DateRangeSelector, DATE_RANGE_LABELS } from '../components/DateRangeSelector'
import { StatsDisplay } from '../components/StatsDisplay'
import { NotesList } from '../components/NotesList'
import { syncNotesFromAPI, syncStatsFromAPI } from '../features/careNotes/careNotesThunks'
import { setPage, setSelectedDateRange } from '../features/careNotes/careNotesSlice'
import { describeScope } from '../features/careNotes/scope'
import { formatTime } from '../utils/formatDate'

const NOTES_POLL_MS = 60_000

export const Home = () => {
  const dispatch = useDispatch<AppDispatch>()
  const {
    notes, stats, loading, statsLoading, error, statsError, lastSync,
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
        <p className="text-xs font-semibold uppercase tracking-widest text-clay-700">Synthetic data only</p>
        <h1 className="mt-2 text-3xl font-semibold sm:text-4xl">Care notes by home and facility</h1>
        <p className="mt-3 max-w-2xl text-sm text-muted">
          Pick a tenant and, if you like, a few of its facilities. The list and the figures follow that selection.
          This demo has no sign-in, so never enter real resident details.
        </p>
      </header>

      <section aria-labelledby="scope-heading" className="panel">
        <h2 id="scope-heading" className="sr-only">Selection</h2>
        <div className="grid gap-5 lg:grid-cols-[1fr_14rem]">
          <TenantSelector />
          <DateRangeSelector selectedRange={selectedDateRange} onRangeChange={range => dispatch(setSelectedDateRange(range))} />
        </div>
      </section>

      <section aria-labelledby="stats-heading" className="panel">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="stats-heading" className="text-xl font-semibold">Figures</h2>
          <p className="text-xs text-muted">{describeScope(selectedTenantId, selectedFacilityIds)} · {DATE_RANGE_LABELS[selectedDateRange]}</p>
        </div>
        <StatsDisplay stats={stats} loading={statsLoading} error={statsError} onRetry={() => dispatch(syncStatsFromAPI())} />
        <p className="mt-4 text-xs text-muted">The range applies to these figures only; the note list below covers all dates.</p>
      </section>

      <section aria-labelledby="notes-heading" className="panel">
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <h2 id="notes-heading" className="text-xl font-semibold">
            Notes <span className="font-sans text-sm font-normal text-muted">({pagination.totalItems})</span>
          </h2>
          <p className="text-xs text-muted" aria-live="polite">
            {lastSync ? `Refreshed ${formatTime(lastSync)}, checks every minute` : 'Not loaded yet'}
          </p>
        </div>
        {error && (
          <div role="alert" className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-md border border-clay-600/30 bg-clay-50 p-4 text-sm text-clay-700">
            <span>{error}</span>
            <button type="button" className="btn-secondary" onClick={() => dispatch(syncNotesFromAPI(pagination.currentPage))}>
              Retry
            </button>
          </div>
        )}
        <NotesList notes={notes} loading={loading} pagination={pagination} onPageChange={page => dispatch(setPage(page))} />
      </section>
    </div>
  )
}
