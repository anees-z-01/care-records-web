'use client'

import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { RootState, AppDispatch } from '../../src/app/store'
import { syncStatsFromAPI } from '../../src/features/careNotes/careNotesThunks'

export default function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>()
  const { stats, loading, error } = useSelector((state: RootState) => state.careNotes)

  useEffect(() => {
    dispatch(syncStatsFromAPI())

    // Refresh stats every minute
    const interval = setInterval(() => {
      dispatch(syncStatsFromAPI())
    }, 60000)

    return () => clearInterval(interval)
  }, [dispatch])

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Total Notes</h3>
          <p className="text-3xl font-bold text-blue-600">{stats?.total_notes || 0}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Categories</h3>
          <p className="text-3xl font-bold text-blue-600">
            {stats ? Object.keys(stats.by_category).length : 0}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Avg Notes/Patient</h3>
          <p className="text-3xl font-bold text-blue-600">
            {stats?.avg_notes_per_patient.toFixed(1) || '0.0'}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Categories Distribution */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Notes by Category</h2>
          <div className="space-y-4">
            {stats && Object.entries(stats.by_category)
              .sort(([, a], [, b]) => b - a)
              .map(([category, count]) => (
                <div key={category} className="flex items-center">
                  <div className="flex-1">
                    <div
                      className="h-2.5 bg-blue-600 rounded-full"
                      style={{ width: `${stats.total_notes > 0 ? (count / stats.total_notes) * 100 : 0}%` }}
                    />
                  </div>
                  <div className="ml-4 min-w-[120px] flex justify-between">
                    <span className="text-gray-700 capitalize">{category}</span>
                    <span className="text-gray-500">{count}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Notes by Priority</h2>
          <div className="space-y-4">
            {stats && Object.entries(stats.by_priority)
              .sort(([a], [b]) => Number(a) - Number(b))
              .map(([priority, count]) => (
                <div key={priority} className="flex items-center">
                  <div className="flex-1">
                    <div
                      className={`h-2.5 rounded-full ${getPriorityColor(Number(priority))}`}
                      style={{ width: `${stats.total_notes > 0 ? (count / stats.total_notes) * 100 : 0}%` }}
                    />
                  </div>
                  <div className="ml-4 min-w-[120px] flex justify-between">
                    <span className="text-gray-700">Priority {priority}</span>
                    <span className="text-gray-500">{count}</span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Facility Distribution */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Notes by Facility</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {stats && Object.entries(stats.by_facility)
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

      {loading && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 flex items-center">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
          <span className="text-gray-600">Updating stats...</span>
        </div>
      )}

      {error && (
        <div className="fixed bottom-4 right-4 bg-red-50 text-red-800 rounded-lg shadow-lg p-4">
          {error}
        </div>
      )}
    </div>
  )
}

function getPriorityColor(priority: number): string {
  switch (priority) {
    case 1:
      return 'bg-slate-500'
    case 2:
      return 'bg-slate-500'
    case 3:
      return 'bg-slate-500'
    case 4:
      return 'bg-slate-500'
    case 5:
      return 'bg-slate-500'
    default:
      return 'bg-gray-500'
  }
}