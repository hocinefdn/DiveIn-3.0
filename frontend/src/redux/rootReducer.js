import { persistReducer } from 'redux-persist'
import { combineReducers } from 'redux'
import userReducer from './reducers/userReducer'
import storage from 'redux-persist/lib/storage'
//import autoMergeLevel2 from "redux-persist/lib/stateReconciler/autoMergeLevel2";

const persistConfig = {
    key: 'root',
    storage,
    // whitelist: ['user'],
    //stateReconciler: autoMergeLevel2
}

const allReducers = combineReducers({
    user: userReducer,
})

const persistedReducer = persistReducer(persistConfig, allReducers)

export default persistedReducer
