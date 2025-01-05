"use client"

import type React from "react"
import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import type { RootState, AppDispatch } from "../app/store"
import { StatsCard } from "../components/StatsCard"
import { CategoryChart } from "../components/CategoryChart"
import { PriorityDistribution } from "../components/PriorityDistribution"
import { syncStatsFromAPI, runPerformanceTest } from "../features/careNotes/careNotesThunks"
import { clearError } from "../features/careNotes/careNotesSlice"

export const Dashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { stats, loading, error, lastSync } = useSelector((state: RootState) => state.careNotes)

  useEffect(() => {
    // Initial stats fetch
    dispatch(syncStatsFromAPI())

    // Set up polling every 60 seconds
    const interval = setInterval(() => {
      dispatch(syncStatsFromAPI())
    }, 60000)

    return () => clearInterval(interval)
  }, [dispatch])

  const handleRetry = () => {
    dispatch(clearError())
    dispatch(syncStatsFromAPI())
  }

  const handlePerformanceTest = () => {
    dispatch(runPerformanceTest())
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Care Notes Dashboard</h1>
              <p className="text-gray-600">Real-time care statistics and analytics</p>
              {lastSync && (
                <p className="text-sm text-gray-500 mt-2">Last synced: {new Date(lastSync).toLocaleTimeString()}</p>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handlePerformanceTest}
                className="bg-purple-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-purple-700 transition-colors"
              >
                Run Performance Test
              </button>
              {loading && (
                <div className="flex items-center text-gray-500">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  Syncing...
                </div>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
            <div className="flex justify-between items-center">
              <p className="text-red-800">{error}</p>
              <button onClick={handleRetry} className="text-red-600 hover:text-red-800 font-medium">
                Retry
              </button>
            </div>
          </div>
        )}

        {!stats && !loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No statistics available</p>
            <p className="text-gray-400 text-sm mt-2">Loading care statistics...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard title="Total Notes" value={stats?.total_notes || 0} subtitle="Today" />
              <StatsCard
                title="Avg Notes/Patient"
                value={stats?.avg_notes_per_patient || 0}
                subtitle="Per patient today"
              />
              <StatsCard
                title="Active Facilities"
                value={stats ? Object.keys(stats.by_facility).length : 0}
                subtitle="Reporting today"
              />
              <StatsCard
                title="Categories"
                value={stats ? Object.keys(stats.by_category).length : 0}
                subtitle="Note types"
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CategoryChart data={stats?.by_category || {}} title="Notes by Category" />
              <PriorityDistribution data={stats?.by_priority || {}} />
            </div>

            {/* Facility Breakdown */}
            {stats && Object.keys(stats.by_facility).length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes by Facility</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(stats.by_facility)
                    .sort(([, a], [, b]) => b - a)
                    .map(([facilityId, count]) => (
                      <div key={facilityId} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-900">Facility {facilityId}</span>
                          <span className="text-2xl font-bold text-blue-600">{count}</span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">notes today</p>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
