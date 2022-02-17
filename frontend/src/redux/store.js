import { createStore } from 'redux'
import { persistStore } from 'redux-persist'
import rootReducer from './rootReducer'
import { loadState, initializeState, saveState } from './stateLoader'

export const store = createStore(
    rootReducer,
    loadState(),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
)

store.subscribe(() => {
    saveState(store.getState())
})

export const persistor = persistStore(store)

// import { configureStore } from '@reduxjs/toolkit'

// import commentaireReducer from './reducers/commentaire.reducer'
// import postReducer from './reducers/post.reducer'

// export const store = configureStore({
//     reducer: {
//         posts: postReducer,
//         commentaires: commentaireReducer,
//     },

//     // middleware: (getDefaultMiddleware) =>
//     //     getDefaultMiddleware({
//     //         serializableCheck: {
//     //             // Ignore these action types
//     //             ignoredActions: ['your/action/type'],
//     //             // Ignore these field paths in all actions
//     //             ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
//     //             // Ignore these paths in the state
//     //             ignoredPaths: ['items.dates'],
//     //         },
//     //     }),
// })
