import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Home } from '../../src/screens/Home'
import { Dashboard } from '../../src/screens/Dashboard'
import { Navigation } from '../../src/components/Navigation'
import { jsonResponse, makeNote, makePage, sampleStats } from '../fixtures'
import { renderWithStore } from '../render'

vi.mock('next/navigation', () => ({ usePathname: () => '/dashboard', useRouter: () => ({ push: vi.fn() }) }))

function routeFetch(handlers: { notes?: () => Response; stats?: () => Response }) {
  const fetchMock = vi.fn(async (input: string) => {
    const url = new URL(input)
    if (url.pathname.endsWith('/care-notes')) return handlers.notes?.() ?? jsonResponse(makePage([]))
    return handlers.stats?.() ?? jsonResponse(sampleStats)
  })
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

describe('Home screen', () => {
  it('still lists notes when the statistics request fails', async () => {
    routeFetch({
      notes: () => jsonResponse(makePage([makeNote({ id: 1 }), makeNote({ id: 2, patient_id: 'DEMO-P12-11', facility_id: 12 })])),
      stats: () => jsonResponse({ detail: 'boom' }, 500),
    })
    renderWithStore(<Home />)

    expect(await screen.findByText('DEMO-P12-11')).toBeInTheDocument()
    expect(await screen.findByText('Could not load statistics for this selection')).toBeInTheDocument()
    expect(screen.getAllByRole('article')).toHaveLength(2)
  })

  it('refetches notes for the newly ticked facility', async () => {
    const fetchMock = routeFetch({ notes: () => jsonResponse(makePage([makeNote()])) })
    renderWithStore(<Home />)
    await screen.findByText('DEMO-P11-04')

    await userEvent.click(screen.getByRole('checkbox', { name: 'Facility 14' }))
    await screen.findByText('DEMO-P11-04')
    const noteUrls = fetchMock.mock.calls.map(([url]) => new URL(url)).filter(url => url.pathname.endsWith('/care-notes'))
    expect(noteUrls.at(-1)?.searchParams.get('facility_ids')).toBe('14')
  })

  it('shows a retryable error when notes cannot load', async () => {
    let failing = true
    routeFetch({ notes: () => (failing ? jsonResponse({}, 502) : jsonResponse(makePage([makeNote()]))) })
    renderWithStore(<Home />)

    const alert = await screen.findByText(/Could not load care notes/)
    failing = false
    await userEvent.click(within(alert.closest('[role="alert"]') as HTMLElement).getByRole('button', { name: 'Retry' }))
    expect(await screen.findByText('DEMO-P11-04')).toBeInTheDocument()
  })
})

describe('Dashboard screen', () => {
  it('describes the scope and breaks figures down by facility', async () => {
    routeFetch({})
    renderWithStore(<Dashboard />, { selectedFacilityIds: [11, 12], selectedDateRange: 'this_week' })
    expect(screen.getByText(/Tenant 1, facilities 11, 12 · This week/)).toBeInTheDocument()
    expect(await screen.findByText('Notes by facility')).toBeInTheDocument()
    const facility = screen.getByText('Facility 11').closest('li') as HTMLElement
    expect(facility).toHaveTextContent('25')
  })
})

describe('Navigation', () => {
  it('marks the current page', () => {
    renderWithStore(<Navigation />)
    expect(screen.getByRole('link', { name: 'Dashboard' })).toHaveAttribute('aria-current', 'page')
    expect(screen.getByRole('link', { name: 'Notes' })).not.toHaveAttribute('aria-current')
  })
})
