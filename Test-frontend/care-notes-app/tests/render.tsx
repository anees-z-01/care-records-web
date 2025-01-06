import type { ReactElement } from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { makeStore } from '../src/app/store'
import { initialState } from '../src/features/careNotes/careNotesSlice'
import type { CareNotesState } from '../src/types'

export function renderWithStore(ui: ReactElement, careNotes: Partial<CareNotesState> = {}) {
  const store = makeStore({ careNotes: { ...initialState, ...careNotes } })
  return { store, ...render(<Provider store={store}>{ui}</Provider>) }
}
