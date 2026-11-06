import { Link } from 'react-router'
import CatalogoProductos from '../../componente/CatalogoProductos'
import fondoInico from '../../assets/images/fondo_inico.jpg'

const ESTILOS_HERO = {
  //el fondo se importa como módulo para que Vite lo emita en dist/ junto al resto
  backgroundImage: `linear-gradient(rgba(33, 37, 41, 0.85), rgba(33, 37, 41, 0.85)), url(${fondoInico})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
}

const SERVICIOS = [
  {
    icono: 'bi-truck',
    color: 'text-primary',
    titulo: 'Despacho Exprés a Faena',
    texto: 'Entregamos en tu obra en Santiago y regiones adyacentes en menos de 24 horas con flota propia.',
  },
  {
    icono: 'bi-cash-coin',
    color: 'text-warning',
    titulo: 'Líneas de Crédito Contratista',
    texto: 'Cuentas corrientes para empresas constructoras y maestros con facturación mensual consolidada.',
  },
  {
    icono: 'bi-patch-check',
    color: 'text-success',
    titulo: 'Asesoría de Mesón Experto',
    texto: 'Cubicamos tus planos de radier, muros o techumbre sin costo adicional con nuestros maestros de mesón.',
  },
]

//pagina de inicio
export default function Inicio() {
  return (
    <>
      <section className="hero-simple" style={ESTILOS_HERO}>
        <div className="container text-center py-4">
          <h1 className="display-6 fw-bold text-white mb-2">Ferretería Los Maestros</h1>
          <p className="lead text-light mb-4">
            Materiales de construcción, herramientas manuales y eléctricas al mejor precio.
          </p>
          <div className="d-flex justify-content-center gap-3">
            <a href="#catalogo" className="btn btn-warning fw-bold px-4">Ver Catálogo</a>
            <Link to="/cotizacion" className="btn btn-outline-light px-4">Solicitar Cotización</Link>
          </div>
        </div>
      </section>

      <section className="py-5 bg-white border-top border-bottom">
        <div className="container-fluid px-lg-5">
          <div className="row g-4 text-center">
            {SERVICIOS.map((servicio) => (
              <div key={servicio.titulo} className="col-12 col-md-4">
                <div className="p-4 rounded border h-100">
                  <div className={`${servicio.color} fs-1 mb-3`}>
                    <i className={`bi ${servicio.icono}`} />
                  </div>
                  <h4 className="h5 fw-bold">{servicio.titulo}</h4>
                  <p className="text-muted small mb-0">{servicio.texto}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CatalogoProductos />
      <section className="container mt-5">
        <div className="card shadow">
          <div className="card-header bg-primary text-white">
            <h5 className="mb-0">Nuestra Ubicación</h5>
          </div>
          <div className="card-body p-0">
            <iframe
              title="Mapa de la ferretería"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d16926.01379674009!2d-71.34011255204052!3d-29.95184463863857!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9691c91a221aa227%3A0xa8b3af2660265f0b!2sFerreter%C3%ADa%20Dimaplac%20Panamericana!5e0!3m2!1ses!2scl!4v1788452633675!5m2!1ses!2scl"
              style={{ width: '100%', height: '300px', border: 0 }}
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </>
  )
}