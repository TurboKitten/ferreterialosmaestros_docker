import PuntoVenta from '../../componente/PuntoVenta'
import TablaPedidosVendedor from '../../componente/TablaPedidosVendedor'

//terminal de mesón del vendedor: punto de venta y control de pedidos.
export default function Vendedor() {
  return (
    <main className="container py-4">
      <div className="row g-4">
        <div className="col-12 col-lg-7">
          <PuntoVenta />
        </div>
        <div className="col-12 col-lg-5">
          <TablaPedidosVendedor />
        </div>
      </div>
    </main>
  )
}