import { describe, expect, it, vi } from 'vitest'
import { API_BASE_URL, careNotesAPI } from '../src/api/careNotesAPI'
import { jsonResponse, makeNote, makeNoteInput, makePage, sampleStats } from './fixtures'

function stubFetch(response: Response) {
  const fetchMock = vi.fn().mockResolvedValue(response)
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

const calledUrl = (fetchMock: ReturnType<typeof vi.fn>) => new URL(fetchMock.mock.calls[0][0] as string)

describe('careNotesAPI', () => {
  it('uses NEXT_PUBLIC_API_URL with the /api prefix', () => {
    expect(API_BASE_URL).toBe('http://api.test/api')
  })

  it('requests a tenant page without a facility filter when none is chosen', async () => {
    const fetchMock = stubFetch(jsonResponse(makePage([makeNote()])))
    const page = await careNotesAPI.fetchNotes(3, [], 2)
    const url = calledUrl(fetchMock)
    expect(url.pathname).toBe('/api/care-notes')
    expect(Object.fromEntries(url.searchParams)).toEqual({ tenant_id: '3', page: '2', page_size: '20' })
    expect(page.notes).toHaveLength(1)
  })

  it('joins selected facilities into one comma-separated parameter', async () => {
    const fetchMock = stubFetch(jsonResponse(sampleStats))
    await careNotesAPI.fetchStats(1, [11, 13], 'this_week')
    const url = calledUrl(fetchMock)
    expect(url.pathname).toBe('/api/care-stats')
    expect(url.searchParams.get('facility_ids')).toBe('11,13')
    expect(url.searchParams.get('range')).toBe('this_week')
  })

  it('posts a new note as JSON', async () => {
    const fetchMock = stubFetch(jsonResponse(makeNote({ id: 7 }), 201))
    const input = makeNoteInput()
    const saved = await careNotesAPI.createNote(input)
    const [, init] = fetchMock.mock.calls[0]
    expect(init.method).toBe('POST')
    expect(JSON.parse(init.body)).toEqual(input)
    expect(saved.id).toBe(7)
  })

  it('turns an HTTP error into a rejected promise with the status', async () => {
    stubFetch(jsonResponse({ detail: 'nope' }, 422))
    await expect(careNotesAPI.fetchNotes(1, [])).rejects.toThrow('HTTP 422')
  })
})
