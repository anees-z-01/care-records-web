'use client'

import { AddNoteForm } from '../../src/components/AddNoteForm'

export default function AddNotePage() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Add Care Note</h1>
      <AddNoteForm />
    </div>
  )
}