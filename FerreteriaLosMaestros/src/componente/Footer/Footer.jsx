import { Link } from 'react-router'

export default function Footer() {
  return (
    <footer className="footer-corporate text-light bg-dark py-5">
      <div className="container-fluid px-lg-5">
        <div className="row g-4">
          <div className="col-12 col-md-4">
            <h5 className="fw-bold text-white mb-3">Ferretería Los Maestros</h5>
            <p className="small text-secondary mb-3">
              Más de 22 años al servicio de La Serena. Negocio familiar especialista en
              materiales de construcción, herramientas, gasfitería y electricidad para
              particulares y contratistas.
            </p>
            <div className="small text-secondary">
              <i className="bi bi-geo-alt text-warning me-1" /> Panamericana Norte 1498, La Serena
              <br />
              <i className="bi bi-telephone text-warning me-1" /> +56 9 1234 5678 | contacto@losmaestros.cl
            </div>
          </div>

          <div className="col-6 col-md-2">
            <h5 className="footer-heading h6 fw-bold text-white mb-3">Categorías</h5>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li>
                <Link to="/" className="text-secondary text-decoration-none">Herramientas Eléctricas</Link>
              </li>
              <li>
                <Link to="/" className="text-secondary text-decoration-none">Herramientas Manuales</Link>
              </li>
              <li>
                <Link to="/" className="text-secondary text-decoration-none">Materiales de construcción</Link>
              </li>
              <li>
                <Link to="/" className="text-secondary text-decoration-none">Gasfitería</Link>
              </li>
              <li>
                <Link to="/" className="text-secondary text-decoration-none">Electricidad</Link>
              </li>
            </ul>
          </div>

          <div className="col-6 col-md-3">
            <h5 className="footer-heading h6 fw-bold text-white mb-3">Portales y Accesos</h5>
            <ul className="list-unstyled d-flex flex-column gap-2 small">
              <li>
                <Link to="/login" className="text-secondary text-decoration-none">Acceso Personal / Login</Link>
              </li>
              <li>
                <Link to="/admin" className="text-secondary text-decoration-none">Portal Administrador / Dueño</Link>
              </li>
              <li>
                <Link to="/vendedor" className="text-secondary text-decoration-none">Terminal de Mesón Vendedor</Link>
              </li>
              <li>
                <Link to="/contacto" className="text-secondary text-decoration-none">Contacto</Link>
              </li>
              <li>
                <Link to="/cotizacion" className="text-secondary text-decoration-none">Cotizaciones</Link>
              </li>
            </ul>
          </div>

          <div className="col-12 col-md-3">
            <h5 className="footer-heading h6 fw-bold text-white mb-3">Horario y Atención</h5>
            <p className="small text-light mb-1">
              <strong>Mesón y Bodega:</strong>
            </p>
            <p className="small text-secondary mb-3">
              Lunes a Viernes: 08:00 a 19:00 hrs.
              <br />
              Sábados: 08:30 a 14:00 hrs.
            </p>
            <div className="p-2 bg-black rounded border border-secondary small text-secondary">
              <i className="bi bi-credit-card-2-front text-warning me-1" /> Aceptamos Efectivo,
              Transferencia, Tarjetas de Débito/Crédito y Orden de Compra Contratista.
            </div>
          </div>
        </div>

        <div className="border-top border-secondary pt-4 mt-5 d-flex flex-wrap justify-content-between align-items-center small text-secondary">
          <div>&copy; 2026 Ferretería Los Maestros. Todos los derechos reservados.</div>
          <div>La Serena, Región de Coquimbo</div>
        </div>
      </div>
    </footer>
  )
}