import type { CareNote, Pagination } from '../types'
import { CareNoteCard } from './CareNoteCard'

interface NotesListProps {
  notes: CareNote[]
  loading: boolean
  pagination: Pagination
  onPageChange: (page: number) => void
}

export function NotesList({ notes, loading, pagination, onPageChange }: NotesListProps) {
  if (loading && notes.length === 0) {
    return <p role="status" className="p-4 text-center text-sm text-slate-600">Loading care notes…</p>
  }

  if (notes.length === 0) {
    return <p className="p-4 text-center text-sm text-slate-500">No notes for this tenant and facility selection.</p>
  }

  return (
    <div>
      <div className="space-y-4">
        {notes.map(note => <CareNoteCard key={note.id} note={note} />)}
      </div>

      <nav aria-label="Note pages" className="mt-6 flex items-center justify-center gap-3">
        <button
          type="button"
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm disabled:opacity-50"
          disabled={pagination.currentPage <= 1 || loading}
          onClick={() => onPageChange(pagination.currentPage - 1)}
        >
          Previous
        </button>
        <span className="text-sm">Page {pagination.currentPage} of {pagination.totalPages}</span>
        <button
          type="button"
          className="rounded-md border border-slate-300 px-3 py-1.5 text-sm disabled:opacity-50"
          disabled={pagination.currentPage >= pagination.totalPages || loading}
          onClick={() => onPageChange(pagination.currentPage + 1)}
        >
          Next
        </button>
      </nav>
    </div>
  )
}
