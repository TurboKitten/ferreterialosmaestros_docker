import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router'
import './index.css'
import App from './App.jsx'
import { inicializarDatos } from './services/almacen'

//siembra los datos de ejemplo (productos, usuarios, cuentas) la primera vez.
inicializarDatos()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>,
)
