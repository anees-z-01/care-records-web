"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../app/store"
import { syncStatsFromAPI } from "../features/careNotes/careNotesThunks"
import { describeScope } from "../features/careNotes/scope"
import { StatsDisplay } from "../components/StatsDisplay"
import { CategoryChart } from "../components/CategoryChart"
import { PriorityDistribution } from "../components/PriorityDistribution"
import { DATE_RANGE_LABELS } from "../components/DateRangeSelector"

const STATS_POLL_MS = 60_000

export function Dashboard() {
  const dispatch = useDispatch<AppDispatch>()
  const { stats, statsLoading, statsError, selectedTenantId, selectedFacilityIds, selectedDateRange } =
    useSelector((state: RootState) => state.careNotes)
  const rangeLabel = DATE_RANGE_LABELS[selectedDateRange]

  useEffect(() => {
    dispatch(syncStatsFromAPI())
    const interval = setInterval(() => dispatch(syncStatsFromAPI()), STATS_POLL_MS)
    return () => clearInterval(interval)
  }, [dispatch, selectedTenantId, selectedFacilityIds, selectedDateRange])

  const facilities = stats ? Object.entries(stats.by_facility).sort(([, a], [, b]) => b - a) : []

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold sm:text-4xl">Dashboard</h1>
        <p className="mt-2 text-sm text-muted">
          {describeScope(selectedTenantId, selectedFacilityIds)} · {rangeLabel}. Change the selection on the Notes page.
        </p>
      </header>

      <StatsDisplay stats={stats} loading={statsLoading} error={statsError} onRetry={() => dispatch(syncStatsFromAPI())} />

      {stats && (
        <>
          <div className="grid gap-6 lg:grid-cols-2">
            <CategoryChart data={stats.by_category} />
            <PriorityDistribution data={stats.by_priority} />
          </div>

          <section className="panel">
            <h2 className="mb-4 text-lg font-semibold">Notes by facility</h2>
            {facilities.length === 0 ? (
              <p className="text-sm text-muted">No facility reported notes in this range.</p>
            ) : (
              <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {facilities.map(([facilityId, count]) => (
                  <li key={facilityId} className="flex items-center justify-between rounded-lg bg-pine-50 p-4">
                    <span className="font-medium">Facility {facilityId}</span>
                    <span className="font-serif text-2xl font-semibold text-pine-800">{count}</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  )
}
