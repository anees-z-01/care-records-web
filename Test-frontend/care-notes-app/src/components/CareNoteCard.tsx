import type { CareNote } from "../types"
import { formatDateTime } from "../utils/formatDate"

const CATEGORY_STYLE: Record<CareNote['category'], { label: string; accent: string }> = {
  medication: { label: 'Medication', accent: 'border-l-clay-600' },
  observation: { label: 'Observation', accent: 'border-l-pine-600' },
  treatment: { label: 'Treatment', accent: 'border-l-ink' },
}

export function CareNoteCard({ note }: { note: CareNote }) {
  const style = CATEGORY_STYLE[note.category] ?? { label: note.category, accent: 'border-l-line' }

  return (
    <article className={`rounded-lg border border-l-4 border-line bg-white p-4 ${style.accent}`}>
      <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="text-lg font-semibold">{style.label}</h3>
          <p className="text-sm text-muted">
            Resident <span className="font-mono text-ink">{note.patient_id}</span> · Facility {note.facility_id}
          </p>
        </div>
        <span className="rounded-full border border-line px-2.5 py-0.5 text-xs font-medium text-ink">
          Priority {note.priority}
        </span>
      </div>
      <p className="whitespace-pre-line leading-relaxed">{note.note_content}</p>
      <p className="mt-3 flex flex-wrap justify-between gap-2 text-xs text-muted">
        <span>Recorded by {note.created_by}</span>
        <time dateTime={note.created_at}>{formatDateTime(note.created_at)}</time>
      </p>
    </article>
  )
}
