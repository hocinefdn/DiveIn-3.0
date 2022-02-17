import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import './index.css'
import { Provider } from 'react-redux'
import { store, persistor } from './redux/store'
import { PersistGate } from 'redux-persist/integration/react'
import { IoProvider } from 'socket.io-react-hook'

ReactDOM.render(
 
        <Provider store={store}>
            <PersistGate persistor={persistor}>
                <IoProvider>
                        <App />
                </IoProvider>
            </PersistGate>
        </Provider>
,
    document.getElementById('root')
)
