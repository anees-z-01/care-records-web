"use client"

import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/navigation'
import type { AppDispatch, RootState } from '../app/store'
import { addNote } from '../features/careNotes/careNotesThunks'
import { facilitiesForTenant } from '../features/careNotes/scope'
import type { NoteCategory, NotePriority } from '../types'

// Mirrors the API's CareNoteCreate limits so the browser catches them first.
const MAX_ID_LENGTH = 64
const MAX_NOTE_LENGTH = 10_000

const SAVE_ERROR = 'The note could not be saved. Your draft is still here; check that the API is running and try again.'

export function AddNoteForm({ onSuccess }: { onSuccess?: () => void } = {}) {
  const dispatch = useDispatch<AppDispatch>()
  const router = useRouter()
  const { selectedTenantId, selectedFacilityIds } = useSelector((state: RootState) => state.careNotes)
  const [facilityId, setFacilityId] = useState(selectedFacilityIds[0] ?? facilitiesForTenant(selectedTenantId)[0])
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    patient_id: '',
    category: 'observation' as NoteCategory,
    priority: 3 as NotePriority,
    created_by: '',
    note_content: '',
  })

  const update = <K extends keyof typeof formData>(key: K, value: (typeof formData)[K]) =>
    setFormData(previous => ({ ...previous, [key]: value }))

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      await dispatch(addNote({ ...formData, tenant_id: selectedTenantId, facility_id: facilityId })).unwrap()
      if (onSuccess) onSuccess()
      else router.push('/')
    } catch {
      setError(SAVE_ERROR)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="panel space-y-5" aria-describedby="form-scope">
      <p id="form-scope" className="text-sm text-muted">
        Saving to <strong className="text-ink">tenant {selectedTenantId}</strong>. Use invented resident IDs and names only.
      </p>
      {error && <p role="alert" className="rounded-md bg-clay-50 p-3 text-sm text-clay-700">{error}</p>}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="facility_id" className="field-label">Facility</label>
          <select id="facility_id" className="field-control" value={facilityId} onChange={event => setFacilityId(Number(event.target.value))}>
            {facilitiesForTenant(selectedTenantId).map(id => <option key={id} value={id}>Facility {id}</option>)}
          </select>
        </div>

        <div>
          <label htmlFor="patient_id" className="field-label">Resident ID</label>
          <input
            id="patient_id"
            className="field-control font-mono"
            placeholder="DEMO-P11-04"
            value={formData.patient_id}
            maxLength={MAX_ID_LENGTH}
            onChange={event => update('patient_id', event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="category" className="field-label">Category</label>
          <select id="category" className="field-control" value={formData.category} onChange={event => update('category', event.target.value as NoteCategory)}>
            <option value="medication">Medication</option>
            <option value="observation">Observation</option>
            <option value="treatment">Treatment</option>
          </select>
        </div>

        <div>
          <label htmlFor="priority" className="field-label">Priority</label>
          <select
            id="priority"
            className="field-control"
            value={formData.priority}
            aria-describedby="priority-hint"
            onChange={event => update('priority', Number(event.target.value) as NotePriority)}
          >
            {[1, 2, 3, 4, 5].map(priority => <option key={priority} value={priority}>{priority}</option>)}
          </select>
          <p id="priority-hint" className="mt-1 text-xs text-muted">The API stores 1 to 5 without defining which end is most urgent.</p>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="created_by" className="field-label">Recorded by</label>
          <input
            id="created_by"
            className="field-control"
            placeholder="demo-carer-07"
            value={formData.created_by}
            maxLength={MAX_ID_LENGTH}
            onChange={event => update('created_by', event.target.value)}
            required
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="note_content" className="field-label">Note</label>
          <textarea
            id="note_content"
            className="field-control"
            rows={5}
            value={formData.note_content}
            maxLength={MAX_NOTE_LENGTH}
            onChange={event => update('note_content', event.target.value)}
            required
          />
        </div>
      </div>

      <div className="flex flex-wrap justify-end gap-3">
        <Link href="/" className="btn-secondary">Cancel</Link>
        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Saving…' : 'Save note'}
        </button>
      </div>
    </form>
  )
}
