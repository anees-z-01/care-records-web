import type { CareNote } from "../types"
import { formatDateTime } from "../utils/formatDate"

const CATEGORY_LABELS: Record<CareNote['category'], string> = {
  medication: 'Medication',
  observation: 'Observation',
  treatment: 'Treatment',
}

export function CareNoteCard({ note }: { note: CareNote }) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-2 flex items-start justify-between gap-3">
        <div>
          <h3 className="font-medium">{CATEGORY_LABELS[note.category] ?? note.category}</h3>
          <p className="text-sm text-slate-500">Patient ID: {note.patient_id}</p>
        </div>
        <span className="rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
          Priority {note.priority}
        </span>
      </div>
      <p className="mb-2 whitespace-pre-line text-slate-800">{note.note_content}</p>
      <div className="flex flex-wrap justify-between gap-2 text-sm text-slate-500">
        <span>Created by: {note.created_by}</span>
        <span>Facility {note.facility_id}</span>
        <time dateTime={note.created_at}>{formatDateTime(note.created_at)}</time>
      </div>
    </article>
  )
}
