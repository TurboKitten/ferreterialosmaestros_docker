import FormularioContacto from '../../componente/FormularioContacto'

const CANALES = [
  {
    icono: 'bi-geo-alt-fill',
    color: 'text-primary',
    titulo: 'Ubicación y Sala de Ventas',
    texto: 'Panamericana Norte 1498, Coquimbo',
  },
  {
    icono: 'bi-whatsapp',
    color: 'text-success',
    titulo: 'WhatsApp Ventas Directas',
    texto: '+56 9 1234 5678 (Mesón de turnos)',
  },
  {
    icono: 'bi-envelope-fill',
    color: 'text-primary',
    titulo: 'Correo de Cotizaciones',
    texto: 'contacto@losmaestros.cl',
  },
  {
    icono: 'bi-clock-history',
    color: 'text-warning',
    titulo: 'Horario de Mesón y Bodega',
    texto: 'Lunes a Viernes: 08:00 a 18:30 hrs. / Sábados: 08:30 a 14:00 hrs.',
  },
]

//pagina de contacto / formulario de atencion
export default function Contacto() {
  return (
    <main className="container py-5" id="contacto">
      <div className="text-center mb-5">
        <span className="badge bg-primary px-3 py-2 fs-6 mb-2">Canal Oficial de Atención</span>
        <h1 className="display-6 fw-bold text-dark">Formulario de Contacto</h1>
        <p className="text-muted mx-auto" style={{ maxWidth: '650px' }}>
          ¿Tienes dudas sobre disponibilidad, especificaciones técnicas o necesitas despacho
          directo a tu obra? Completa el formulario a continuación o comunícate por nuestros
          canales directos.
        </p>
      </div>

      <div className="row g-4 justify-content-center">
        <div className="col-12 col-lg-4">
          <div className="card mi-cuadro-contacto shadow-sm border-0 p-4 bg-white">
            <h2 className="h5 fw-bold text-dark mb-3 pb-2 border-bottom">
              <i className="bi bi-telephone-inbound text-primary me-2" />Atención al Cliente
            </h2>

            {CANALES.map((canal) => (
              <div key={canal.titulo} className="d-flex align-items-start gap-3 mb-3">
                <div className={`bg-light p-2 rounded ${canal.color} fs-4`}>
                  <i className={`bi ${canal.icono}`} />
                </div>
                <div>
                  <div className="fw-bold small text-dark">{canal.titulo}</div>
                  <div className="small text-muted">{canal.texto}</div>
                </div>
              </div>
            ))}

            <div className="p-3 bg-light rounded border mt-4">
              <div className="fw-bold small text-dark mb-1">
                <i className="bi bi-truck text-primary me-1" /> Despacho en 24 Horas
              </div>
              <div className="small text-muted">
                Para pedidos de áridos, cemento o fierro sobre 30 unidades, cotiza tu flete con
                tarifa preferencial para contratistas.
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-7">
          <FormularioContacto />
        </div>
      </div>
    </main>
  )
}