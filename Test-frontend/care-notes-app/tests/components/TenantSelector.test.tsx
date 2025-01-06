import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { TenantSelector } from '../../src/components/TenantSelector'
import { makeNote } from '../fixtures'
import { renderWithStore } from '../render'

describe('TenantSelector', () => {
  it('offers the five facilities of the selected tenant', () => {
    renderWithStore(<TenantSelector />, { selectedTenantId: 3 })
    const boxes = screen.getAllByRole('checkbox').map(box => box.closest('label')?.textContent)
    expect(boxes).toEqual(['Facility 31', 'Facility 32', 'Facility 33', 'Facility 34', 'Facility 35'])
  })

  it('ticking facilities narrows the scope and resets the page', async () => {
    const { store } = renderWithStore(<TenantSelector />, {
      pagination: { currentPage: 3, totalPages: 3, totalItems: 60, pageSize: 20 },
    })
    await userEvent.click(screen.getByRole('checkbox', { name: 'Facility 13' }))
    await userEvent.click(screen.getByRole('checkbox', { name: 'Facility 11' }))
    expect(store.getState().careNotes.selectedFacilityIds).toEqual([11, 13])
    expect(store.getState().careNotes.pagination.currentPage).toBe(1)
    expect(screen.getByText('2 of 5 selected.')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('checkbox', { name: 'Facility 13' }))
    expect(store.getState().careNotes.selectedFacilityIds).toEqual([11])
  })

  it('switching tenant clears the facility choice and previous notes', async () => {
    const { store } = renderWithStore(<TenantSelector />, { selectedFacilityIds: [12], notes: [makeNote()] })
    await userEvent.selectOptions(screen.getByLabelText('Tenant'), '4')
    const state = store.getState().careNotes
    expect(state.selectedTenantId).toBe(4)
    expect(state.selectedFacilityIds).toEqual([])
    expect(state.notes).toEqual([])
    expect(screen.getByRole('checkbox', { name: 'Facility 41' })).not.toBeChecked()
  })
})
