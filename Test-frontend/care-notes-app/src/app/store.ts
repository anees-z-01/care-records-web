import { combineReducers, configureStore } from "@reduxjs/toolkit"
import careNotesReducer from "../features/careNotes/careNotesSlice"

const rootReducer = combineReducers({
  careNotes: careNotesReducer,
})

export type RootState = ReturnType<typeof rootReducer>

export function makeStore(preloadedState?: Partial<RootState>) {
  return configureStore({ reducer: rootReducer, preloadedState })
}

export const store = makeStore()

export type AppStore = ReturnType<typeof makeStore>
export type AppDispatch = AppStore['dispatch']
