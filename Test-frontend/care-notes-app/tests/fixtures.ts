import type { CareNote, CareNoteInput, CareStats, PaginatedNotes } from '../src/types'

// Fictional residents and carers only, in the same shape the API seeds.
export function makeNote(overrides: Partial<CareNote> = {}): CareNote {
  return {
    id: 1,
    tenant_id: 1,
    facility_id: 11,
    patient_id: 'DEMO-P11-04',
    category: 'observation',
    priority: 3,
    created_at: '2026-06-15T14:30:00',
    created_by: 'demo-carer-07',
    note_content: 'Synthetic demo note for fictional resident DEMO-P11-04',
    ...overrides,
  }
}

export function makeNoteInput(overrides: Partial<CareNoteInput> = {}): CareNoteInput {
  const note = makeNote()
  return {
    tenant_id: note.tenant_id,
    facility_id: note.facility_id,
    patient_id: note.patient_id,
    category: note.category,
    priority: note.priority,
    created_by: note.created_by,
    note_content: note.note_content,
    ...overrides,
  }
}

export function makePage(notes: CareNote[], page = 1, totalPages = 1): PaginatedNotes {
  return {
    notes,
    pagination: { total: notes.length + (totalPages - 1) * 20, page, page_size: 20, total_pages: totalPages },
  }
}

export const sampleStats: CareStats = {
  total_notes: 42,
  by_category: { observation: 22, medication: 12, treatment: 8 },
  by_priority: { 1: 6, 2: 9, 3: 14, 4: 8, 5: 5 },
  by_facility: { 11: 25, 12: 17 },
  avg_notes_per_patient: 1.53,
  date_range: { start: '2026-06-15T00:00:00', end: '2026-06-15T23:59:59' },
}

export function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } })
}
