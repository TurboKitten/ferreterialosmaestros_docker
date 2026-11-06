import FormularioCotizacion from '../../componente/FormularioCotizacion'

//solicitud de cotizacion
export default function Cotizacion() {
  return (
    <main>
      <section className="py-5" aria-labelledby="contactoTitle">
        <div className="container-fluid px-lg-5">
          <div className="row g-4 justify-content-center">
            <div className="col-12 col-lg-8">
              <FormularioCotizacion />
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}