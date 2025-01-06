import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { StatsDisplay } from '../../src/components/StatsDisplay'
import { CategoryChart } from '../../src/components/CategoryChart'
import { PriorityDistribution } from '../../src/components/PriorityDistribution'
import { sampleStats } from '../fixtures'

describe('StatsDisplay', () => {
  it('shows loading only while there is nothing to show yet', () => {
    render(<StatsDisplay stats={null} loading error={null} />)
    expect(screen.getByRole('status')).toHaveTextContent('Loading figures')
  })

  it('offers a retry when statistics fail', async () => {
    const onRetry = vi.fn()
    render(<StatsDisplay stats={null} loading={false} error="Could not load statistics for this selection" onRetry={onRetry} />)
    const alert = screen.getByRole('alert')
    await userEvent.click(within(alert).getByRole('button', { name: 'Retry' }))
    expect(onRetry).toHaveBeenCalledOnce()
  })

  it('summarises totals from the API payload', () => {
    render(<StatsDisplay stats={sampleStats} loading={false} error={null} />)
    const value = (label: string) => screen.getByText(label).nextElementSibling?.textContent
    expect(value('Notes')).toBe('42')
    expect(value('Notes per resident')).toBe('1.5')
    expect(value('Facilities reporting')).toBe('2')
    expect(value('Categories used')).toBe('3')
  })
})

describe('distribution charts', () => {
  it('orders categories by count with percentages', () => {
    render(<CategoryChart data={sampleStats.by_category} />)
    const rows = screen.getAllByRole('listitem').map(item => item.textContent)
    expect(rows).toEqual(['Observation22 (52.4%)', 'Medication12 (28.6%)', 'Treatment8 (19.0%)'])
  })

  it('lists all five priorities with neutral labels, including empty ones', () => {
    render(<PriorityDistribution data={{ 3: 4 }} />)
    const rows = screen.getAllByRole('listitem').map(item => item.textContent)
    expect(rows).toEqual(['Priority 10 (0.0%)', 'Priority 20 (0.0%)', 'Priority 34 (100.0%)', 'Priority 40 (0.0%)', 'Priority 50 (0.0%)'])
  })

  it('says so when the range has no notes', () => {
    render(<CategoryChart data={{}} />)
    expect(screen.getByText('No notes in this range.')).toBeInTheDocument()
  })
})
