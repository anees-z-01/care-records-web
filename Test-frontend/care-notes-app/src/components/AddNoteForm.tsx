"use client"

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import { AppDispatch, RootState } from '../app/store'
import { addNote } from '../features/careNotes/careNotesThunks'

export function AddNoteForm({ onSuccess }: { onSuccess?: () => void } = {}) {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const { selectedTenantId, selectedFacilityIds } = useSelector((state: RootState) => state.careNotes)
  const [facilityId, setFacilityId] = useState(selectedFacilityIds[0] || selectedTenantId * 10 + 1)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    patient_id: '',
    category: 'observation' as 'medication' | 'observation' | 'treatment',
    priority: 3 as 1 | 2 | 3 | 4 | 5,
    created_by: '',
    note_content: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      await dispatch(addNote({
        ...formData,
        tenant_id: selectedTenantId,
        facility_id: facilityId,
      })).unwrap()

      if (onSuccess) onSuccess()
      else router.push('/')
    } catch (error) {
      setError('The note could not be saved. Your draft is still here; check the local API and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-sm rounded-lg p-6">
      <div className="space-y-6">
        <p className="text-sm text-slate-600">Synthetic examples only · Tenant {selectedTenantId}</p>
        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
        <div><label htmlFor="facility_id">Facility</label><select id="facility_id" value={facilityId} onChange={event=>setFacilityId(Number(event.target.value))}>{Array.from({length:5},(_,index)=>selectedTenantId*10+index+1).map(id=><option key={id} value={id}>Facility {id}</option>)}</select></div>
        <div>
          <label htmlFor="patient_id" className="block text-sm font-medium text-gray-700">
            Patient ID
          </label>
          <input
            type="text"
            id="patient_id"
            value={formData.patient_id}
            onChange={(e) => setFormData(prev => ({ ...prev, patient_id: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="category"
            value={formData.category}
            onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as 'medication' | 'observation' | 'treatment' }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="medication">Medication</option>
            <option value="observation">Observation</option>
            <option value="treatment">Treatment</option>
          </select>
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
            Priority
          </label>
          <select
            id="priority"
            value={formData.priority}
            onChange={(e) => setFormData(prev => ({ ...prev, priority: Number(e.target.value) as 1 | 2 | 3 | 4 | 5 }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
            <option value="5">5</option>
          </select>
        </div>

        <div>
          <label htmlFor="created_by" className="block text-sm font-medium text-gray-700">
            Care Provider Name
          </label>
          <input
            type="text"
            id="created_by"
            value={formData.created_by}
            onChange={(e) => setFormData(prev => ({ ...prev, created_by: e.target.value }))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="note_content" className="block text-sm font-medium text-gray-700">
            Care Note
          </label>
          <textarea
            id="note_content"
            value={formData.note_content}
            onChange={(e) => setFormData(prev => ({ ...prev, note_content: e.target.value }))}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Adding...' : 'Add Note'}
          </button>
        </div>
      </div>
    </form>
  )
}
