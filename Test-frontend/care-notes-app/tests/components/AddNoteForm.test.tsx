import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { AddNoteForm } from '../../src/components/AddNoteForm'
import { jsonResponse, makeNote } from '../fixtures'
import { renderWithStore } from '../render'

const push = vi.fn()
vi.mock('next/navigation', () => ({ useRouter: () => ({ push }), usePathname: () => '/add-note' }))

async function fillForm() {
  await userEvent.type(screen.getByLabelText('Resident ID'), 'DEMO-P22-09')
  await userEvent.selectOptions(screen.getByLabelText('Category'), 'medication')
  await userEvent.selectOptions(screen.getByLabelText('Priority'), '5')
  await userEvent.type(screen.getByLabelText('Recorded by'), 'demo-carer-02')
  await userEvent.type(screen.getByLabelText('Note'), 'Afternoon tablets given as charted.')
}

describe('AddNoteForm', () => {
  beforeEach(() => push.mockReset())

  it('posts to the selected tenant and chosen facility, then returns to the list', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(makeNote({ id: 77, tenant_id: 2, facility_id: 23 }), 201))
    vi.stubGlobal('fetch', fetchMock)
    const { store } = renderWithStore(<AddNoteForm />, { selectedTenantId: 2, selectedFacilityIds: [23] })

    expect(screen.getByLabelText('Facility')).toHaveValue('23')
    await userEvent.selectOptions(screen.getByLabelText('Facility'), '23')
    await fillForm()
    await userEvent.click(screen.getByRole('button', { name: 'Save note' }))

    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({
      tenant_id: 2,
      facility_id: 23,
      patient_id: 'DEMO-P22-09',
      category: 'medication',
      priority: 5,
      created_by: 'demo-carer-02',
      note_content: 'Afternoon tablets given as charted.',
    })
    expect(push).toHaveBeenCalledWith('/')
    expect(store.getState().careNotes.notes.map(note => note.id)).toEqual([77])
  })

  it('keeps the draft and explains the failure when saving fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(jsonResponse({ detail: 'down' }, 503)))
    renderWithStore(<AddNoteForm />)
    await fillForm()
    await userEvent.click(screen.getByRole('button', { name: 'Save note' }))

    expect(await screen.findByRole('alert')).toHaveTextContent('could not be saved')
    expect(screen.getByLabelText('Note')).toHaveValue('Afternoon tablets given as charted.')
    expect(screen.getByRole('button', { name: 'Save note' })).toBeEnabled()
    expect(push).not.toHaveBeenCalled()
  })

  it('applies the API length limits to free-text fields', () => {
    renderWithStore(<AddNoteForm />)
    expect(screen.getByLabelText('Resident ID')).toHaveAttribute('maxLength', '64')
    expect(screen.getByLabelText('Recorded by')).toHaveAttribute('maxLength', '64')
    expect(screen.getByLabelText('Note')).toHaveAttribute('maxLength', '10000')
  })
})
