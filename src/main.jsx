import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { persistor, store } from './redux/store.js'
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { NextUIProvider } from '@nextui-org/react'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <PersistGate loading = {null} persistor={persistor}>
    <React.StrictMode>
    <NextUIProvider>
    <App />
    </NextUIProvider>
    </React.StrictMode>
    </PersistGate>
  </Provider>
)
