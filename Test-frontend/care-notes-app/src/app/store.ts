import { configureStore } from "@reduxjs/toolkit"
import careNotesReducer from "../features/careNotes/careNotesSlice"

export function makeStore() {
  return configureStore({
    reducer: {
      careNotes: careNotesReducer,
    },
  })
}

export const store = makeStore()

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']
