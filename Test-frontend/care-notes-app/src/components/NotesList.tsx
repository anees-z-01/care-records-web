import type { CareNote, Pagination } from '../types'
import { CareNoteCard } from './CareNoteCard'

interface NotesListProps {
  notes: CareNote[]
  loading: boolean
  pagination: Pagination
  onPageChange: (page: number) => void
}

export function NotesList({ notes, loading, pagination, onPageChange }: NotesListProps) {
  if (notes.length === 0) {
    return loading
      ? <p role="status" className="py-6 text-center text-sm text-muted">Loading care notes…</p>
      : <p className="py-6 text-center text-sm text-muted">No notes for this tenant and facility selection.</p>
  }

  return (
    <div aria-busy={loading}>
      <ul className="space-y-3">
        {notes.map(note => <li key={note.id}><CareNoteCard note={note} /></li>)}
      </ul>

      <nav aria-label="Note pages" className="mt-6 flex items-center justify-center gap-3">
        <button
          type="button"
          className="btn-secondary"
          disabled={pagination.currentPage <= 1 || loading}
          onClick={() => onPageChange(pagination.currentPage - 1)}
        >
          Previous
        </button>
        <span className="text-sm text-muted">Page {pagination.currentPage} of {pagination.totalPages}</span>
        <button
          type="button"
          className="btn-secondary"
          disabled={pagination.currentPage >= pagination.totalPages || loading}
          onClick={() => onPageChange(pagination.currentPage + 1)}
        >
          Next
        </button>
      </nav>
    </div>
  )
}
