import type React from "react"
import type { CareNote } from "../types"
import { formatDate } from "../utils/formatDate"

interface CareNoteCardProps {
  note: CareNote
}

const PRIORITY_COLORS = {
  1: 'bg-gray-100',
  2: 'bg-blue-100',
  3: 'bg-yellow-100',
  4: 'bg-orange-100',
  5: 'bg-red-100',
}

const CATEGORY_LABELS = {
  medication: 'Medication',
  observation: 'Observation',
  treatment: 'Treatment',
}

export const CareNoteCard: React.FC<CareNoteCardProps> = ({ note }) => {
  return (
    <div className={`rounded-lg shadow-sm border border-gray-200 p-4 mb-3 hover:shadow-md transition-shadow ${PRIORITY_COLORS[note.priority]}`}>
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-semibold text-gray-900 text-lg">Patient {note.patient_id}</h3>
          <p className="text-sm text-gray-500">By {note.created_by}</p>
        </div>
        <div className="text-right">
          <span className="text-sm text-gray-500 whitespace-nowrap">{formatDate(note.created_at)}</span>
          <div className="flex items-center mt-1 space-x-2">
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-white">
              Priority {note.priority}
            </span>
            <span className="text-xs font-medium px-2 py-1 rounded-full bg-white">
              {CATEGORY_LABELS[note.category]}
            </span>
          </div>
        </div>
      </div>
      <p className="text-gray-700 leading-relaxed mt-2">{note.note_content}</p>
      <div className="mt-2 text-xs text-gray-500">
        Facility ID: {note.facility_id} • Tenant ID: {note.tenant_id}
      </div>
    </div>
  )
}
