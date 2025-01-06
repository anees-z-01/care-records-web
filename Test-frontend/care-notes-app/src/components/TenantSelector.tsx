'use client'

import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../app/store'
import { setFacilityIds, setTenantId } from '../features/careNotes/careNotesSlice'
import { TENANT_IDS, facilitiesForTenant } from '../features/careNotes/scope'

export function TenantSelector() {
  const dispatch = useDispatch<AppDispatch>()
  const { selectedTenantId, selectedFacilityIds } = useSelector((state: RootState) => state.careNotes)
  const facilities = facilitiesForTenant(selectedTenantId)

  const toggleFacility = (facilityId: number, checked: boolean) => {
    const next = checked
      ? [...selectedFacilityIds, facilityId].sort((a, b) => a - b)
      : selectedFacilityIds.filter(id => id !== facilityId)
    dispatch(setFacilityIds(next))
  }

  return (
    <div className="grid gap-4 sm:grid-cols-[10rem_1fr]">
      <div>
        <label htmlFor="tenant" className="field-label">Tenant</label>
        <select
          id="tenant"
          value={selectedTenantId}
          onChange={event => dispatch(setTenantId(Number(event.target.value)))}
          className="field-control"
        >
          {TENANT_IDS.map(id => <option key={id} value={id}>Tenant {id}</option>)}
        </select>
      </div>

      <fieldset>
        <legend className="field-label">Facilities</legend>
        <div className="flex flex-wrap gap-2">
          {facilities.map(id => {
            const checked = selectedFacilityIds.includes(id)
            return (
              <label
                key={id}
                className={`flex cursor-pointer items-center gap-2 rounded-full border px-3 py-1.5 text-sm ${checked ? 'border-pine-600 bg-pine-50 text-pine-800' : 'border-line bg-white'}`}
              >
                <input
                  type="checkbox"
                  className="accent-pine-600"
                  checked={checked}
                  onChange={event => toggleFacility(id, event.target.checked)}
                />
                Facility {id}
              </label>
            )
          })}
        </div>
        <p className="mt-1 text-xs text-muted">
          {selectedFacilityIds.length === 0 ? 'No facility ticked: showing all five.' : `${selectedFacilityIds.length} of 5 selected.`}
        </p>
      </fieldset>
    </div>
  )
}
