"use client"

import type React from "react"
import { useNavigate } from "react-router-dom"
import { AddNoteForm } from "../components/AddNoteForm"

export const AddNote: React.FC = () => {
  const navigate = useNavigate()

  const handleSuccess = () => {
    navigate("/")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate("/")}
            className="text-blue-600 hover:text-blue-800 font-medium mb-4 inline-flex items-center"
          >
            ← Back to Care Notes
          </button>
        </div>

        <AddNoteForm onSuccess={handleSuccess} />
      </div>
    </div>
  )
}
