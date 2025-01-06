'use client'

import { AddNoteForm } from '../../src/components/AddNoteForm'

export default function AddNotePage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-2 text-3xl font-semibold sm:text-4xl">Add a care note</h1>
      <p className="mb-6 text-sm text-muted">The note is posted to the API and appears in the list if it matches your current selection.</p>
      <AddNoteForm />
    </div>
  )
}
