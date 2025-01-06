import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { NotesList } from '../../src/components/NotesList'
import { makeNote } from '../fixtures'

const pagination = (currentPage: number, totalPages: number) => ({ currentPage, totalPages, totalItems: totalPages * 20, pageSize: 20 })

describe('NotesList', () => {
  it('shows a loading status before the first page arrives', () => {
    render(<NotesList notes={[]} loading pagination={pagination(1, 1)} onPageChange={vi.fn()} />)
    expect(screen.getByRole('status')).toHaveTextContent('Loading care notes')
  })

  it('explains an empty selection', () => {
    render(<NotesList notes={[]} loading={false} pagination={pagination(1, 1)} onPageChange={vi.fn()} />)
    expect(screen.getByText('No notes for this tenant and facility selection.')).toBeInTheDocument()
  })

  it('renders each note with resident, facility, carer and UTC time', () => {
    render(<NotesList notes={[makeNote({ category: 'medication', priority: 2 })]} loading={false} pagination={pagination(1, 1)} onPageChange={vi.fn()} />)
    const card = screen.getByRole('article')
    expect(card).toHaveTextContent('Medication')
    expect(card).toHaveTextContent('DEMO-P11-04')
    expect(card).toHaveTextContent('Facility 11')
    expect(card).toHaveTextContent('Priority 2')
    expect(card).toHaveTextContent('Recorded by demo-carer-07')
    expect(card.querySelector('time')).toHaveAttribute('dateTime', '2026-06-15T14:30:00')
  })

  it('keeps notes on screen during a background refresh', () => {
    render(<NotesList notes={[makeNote()]} loading pagination={pagination(1, 2)} onPageChange={vi.fn()} />)
    expect(screen.getByRole('article')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled()
  })

  it('pages forward and back within bounds', async () => {
    const onPageChange = vi.fn()
    render(<NotesList notes={[makeNote()]} loading={false} pagination={pagination(2, 3)} onPageChange={onPageChange} />)
    await userEvent.click(screen.getByRole('button', { name: 'Previous' }))
    await userEvent.click(screen.getByRole('button', { name: 'Next' }))
    expect(onPageChange.mock.calls).toEqual([[1], [3]])
    expect(screen.getByText('Page 2 of 3')).toBeInTheDocument()
  })

  it('disables Next on the last page', () => {
    render(<NotesList notes={[makeNote()]} loading={false} pagination={pagination(3, 3)} onPageChange={vi.fn()} />)
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Previous' })).toBeEnabled()
  })
})
