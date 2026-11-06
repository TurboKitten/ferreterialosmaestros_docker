import { Link, NavLink } from 'react-router'
import { esRolCliente } from '../../services/almacen'

export default function Header({ sesion, onCerrarSesion }) {
  const estaConectado = Boolean(sesion)
  const rol = sesion ? sesion.rol?.toLowerCase() : null

  const destinoPorRol = () => {
    if (rol === 'administrador') return '/admin'
    if (rol === 'vendedor') return '/vendedor'
    return '/carrito'
  }

  const etiquetaBoton = () => {
    if (rol === 'administrador') return 'Administración'
    if (rol === 'vendedor') return 'Panel Vendedor'
    return 'Mi Carrito'
  }

  const claseBoton = () => {
    if (rol === 'administrador') return 'btn btn-danger fw-bold shadow-sm'
    if (rol === 'vendedor') return 'btn btn-primary fw-bold shadow-sm'
    return 'btn btn-success fw-bold shadow-sm'
  }

  const iconoBoton = () => {
    if (rol === 'administrador') return 'bi-person-lock'
    if (rol === 'vendedor') return 'bi-person-badge'
    return 'bi-person-check'
  }

  return (
    <header>
      {/*barra superior de información*/}
      <aside className="topbar-info" aria-label="Información">
        <div className="container d-flex flex-wrap justify-content-between align-items-center">
          <div>
            <a
              href="https://www.google.com/maps/search/?api=1&query=Panamericana+Norte+1498,+Coquimbo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-decoration-none text-reset me-3"
            >
              <i className="bi bi-geo-alt-fill text-warning me-1" /> Panamericana Norte 1498, Coquimbo
            </a>
            <i className="bi bi-clock-fill text-warning ms-2 me-1" /> Lunes a Viernes: 08:00 a 19:00 hrs. | Sábados: 08:30 a 14:00 hrs
          </div>
          <a href="tel:+56912345678" className="text-decoration-none text-reset me-3">
            <i className="bi bi-telephone-fill text-warning me-1" /> +56 9 1234 5678
          </a>
        </div>
      </aside>

      <nav className="navbar-ferreteria sticky-top" aria-label="Navegación principal">
        <div className="container d-flex justify-content-between align-items-center">
          <Link to="/" className="brand-logo">
            <span className="brand-icon">
              <i className="bi bi-tools" />
            </span>
            Los Maestros
          </Link>

          {/*enlaces de navegación visibles solo en md y superior */}
          <div className="d-none d-md-flex align-items-center gap-3">
            <NavLink to="/" className={({ isActive }) => `nav-link fw-semibold ${isActive ? 'text-primary' : ''}`}>
              Inicio
            </NavLink>
            <NavLink to="/cotizacion" className={({ isActive }) => `nav-link fw-semibold ${isActive ? 'text-primary' : ''}`}>
              Cotización
            </NavLink>
            <NavLink to="/contacto" className={({ isActive }) => `nav-link fw-semibold ${isActive ? 'text-primary' : ''}`}>
              Contacto
            </NavLink>
          </div>

          {/*acceso / menú de usuario según la sesión*/}
          {estaConectado ? (
            <div className="dropdown">
              <button
                type="button"
                className={claseBoton()}
                id="btnSesion"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className={`bi ${iconoBoton()} me-1`} /> {sesion.nombre}
              </button>
              <ul className="dropdown-menu dropdown-menu-end show" aria-labelledby="btnSesion">
                <li>
                  <span className="dropdown-item-text">
                    <strong>{sesion.nombre}</strong>
                    <br />
                    <small className="text-muted">{sesion.rol}</small>
                  </span>
                </li>
                <li>
                  <Link to="/" className="dropdown-item">
                    <i className="bi bi-house me-2" /> Volver al menú
                  </Link>
                </li>
                <li>
                  {esRolCliente(sesion.rol) || rol === 'cliente' ? (
                    <Link to="/carrito" className="dropdown-item">
                      <i className="bi bi-cart me-2" /> Mi carrito
                    </Link>
                  ) : (
                    <Link to={destinoPorRol()} className="dropdown-item">
                      <i className="bi bi-shop me-2" /> {etiquetaBoton()}
                    </Link>
                  )}
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <button
                    type="button"
                    className="dropdown-item text-danger"
                    onClick={onCerrarSesion}
                  >
                    <i className="bi bi-box-arrow-right me-2" /> Cerrar sesión
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <Link to="/login" className="btn btn-warning fw-bold shadow-sm" id="btnIrLogin">
              <i className="bi bi-person-lock me-1" /> Acceso Usuarios
            </Link>
          )}
        </div>
      </nav>
    </header>
  )
}