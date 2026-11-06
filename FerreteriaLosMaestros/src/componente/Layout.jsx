import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router'
import Header from './Header/Header'
import Footer from './Footer/Footer'
import { cerrarSesion, obtenerSesion } from '../services/almacen'

function Layout() {
  const navigate = useNavigate()
  const [sesion, setSesion] = useState(() => obtenerSesion())

  useEffect(() => {
    const actualizar = () => setSesion(obtenerSesion())
    window.addEventListener('ferreteria:sesion', actualizar)
    return () => window.removeEventListener('ferreteria:sesion', actualizar)
  }, [])

  const manejarCerrarSesion = () => {
    cerrarSesion() // emite el evento y el estado se actualiza solo
    navigate('/')
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <Header sesion={sesion} onCerrarSesion={manejarCerrarSesion} />
      <main className="flex-grow-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout