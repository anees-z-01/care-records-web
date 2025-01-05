'use client'

import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '../app/store'
import { setTenantId, setFacilityIds } from '../features/careNotes/careNotesSlice'

export function TenantSelector() {
  const dispatch = useDispatch<AppDispatch>()
  const { selectedTenantId, selectedFacilityIds } = useSelector((state: RootState) => state.careNotes)

  // Hardcoded tenant and facility options for demo
  const tenants = Array.from({ length: 10 }, (_, i) => i + 1)
  const facilities = Array.from({ length: 5 }, (_, i) => selectedTenantId * 10 + i + 1)

  return (
    <div className="bg-white shadow-sm rounded-lg p-4 mb-6">
      <div className="flex items-center space-x-4">
        <div>
          <label htmlFor="tenant" className="block text-sm font-medium text-gray-700 mb-1">
            Tenant
          </label>
          <select
            id="tenant"
            value={selectedTenantId}
            onChange={(e) => dispatch(setTenantId(Number(e.target.value)))}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            {tenants.map((id) => (
              <option key={id} value={id}>
                Tenant {id}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="facilities" className="block text-sm font-medium text-gray-700 mb-1">
            Facilities
          </label>
          <select
            id="facilities"
            multiple
            value={selectedFacilityIds.map(String)}
            onChange={(e) => {
              const values = Array.from(e.target.selectedOptions, option => Number(option.value))
              dispatch(setFacilityIds(values))
            }}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-24"
          >
            {facilities.map((id) => (
              <option key={id} value={id}>
                Facility {id}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-gray-500">Hold Ctrl/Cmd to select multiple</p>
        </div>
      </div>
    </div>
  )
}