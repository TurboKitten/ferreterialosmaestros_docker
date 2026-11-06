import { Navigate, Outlet, Route, Routes } from 'react-router'
import Layout from './componente/Layout'
import Inicio from './pages/publico/Inicio'
import Login from './pages/publico/Login'
import Contacto from './pages/publico/Contacto'
import Cotizacion from './pages/publico/Cotizacion'
import Carrito from './pages/publico/Carrito'
import Administracion from './pages/administracion/Administracion'
import Vendedor from './pages/vendedor/Vendedor'
import { obtenerSesion } from './services/almacen'

//protege rutas internas: si no hay sesión o el rol no coincide, redirige.
function RutaProtegida({ roles }) {
  const sesion = obtenerSesion()

  if (!sesion) {
    return <Navigate to="/login" replace />
  }

  if (roles && !roles.includes(sesion.rol)) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Inicio />} />
        <Route path="login" element={<Login />} />
        <Route path="contacto" element={<Contacto />} />
        <Route path="cotizacion" element={<Cotizacion />} />
        <Route path="carrito" element={<Carrito />} />

        <Route element={<RutaProtegida roles={['Administrador']} />}>
          <Route path="admin" element={<Administracion />} />
        </Route>

        <Route element={<RutaProtegida roles={['Vendedor']} />}>
          <Route path="vendedor" element={<Vendedor />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}

export default App