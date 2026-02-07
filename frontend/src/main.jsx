import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {Toaster} from "./components/ui/sonner.jsx"
import store from './redux/store.js'
import { Provider } from "react-redux";
import { SocketProvider } from './context/SocketContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <SocketProvider>
      <App />
      <Toaster closebutton/>
      </SocketProvider>
    </Provider>
  </StrictMode>,
)
